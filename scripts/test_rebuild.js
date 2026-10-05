const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function getJson(url) {
  return new Promise((res, rej) => {
    http.get(url, (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

const VIEWPORTS = [
  { name: 'desktop-1920x1080', w: 1920, h: 1080, mobile: false },
  { name: 'desktop-1366x768', w: 1366, h: 768, mobile: false },
  { name: 'tablet-1024x768', w: 1024, h: 768, mobile: false },
  { name: 'tablet-768x1024', w: 768, h: 1024, mobile: false },
  { name: 'mobile-390x844', w: 390, h: 844, mobile: true },
  { name: 'mobile-320x568', w: 320, h: 568, mobile: true },
];

async function run() {
  const port = 9222;
  const userDataDir = path.resolve(__dirname, '..', '.cdp-temp-profile');
  
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:3000'
  ]);

  try {
    let target = null;
    for (let i = 0; i < 25; i++) {
      await sleep(300);
      try {
        const list = await getJson(`http://127.0.0.1:${port}/json`);
        target = list.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
        if (target) break;
      } catch (e) {}
    }

    const client = new CDPClient(target.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log("Waiting for site loader...");
    await sleep(3800);

    const outDir = path.resolve(__dirname, '..', 'public', 'verification-rebuild');
    fs.mkdirSync(outDir, { recursive: true });

    for (const vp of VIEWPORTS) {
      console.log(`Testing ${vp.name} (${vp.w}x${vp.h})...`);

      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      await sleep(400);

      // Reset scroll to 0, wait for viewport resize reflow
      await client.send('Runtime.evaluate', {
        expression: `window.scrollTo(0, 0);`
      });
      await sleep(600);

      // Now calculate exact element top and scroll
      const evalRes = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.querySelector('#engineering-credentials');
            if (!el) return { found: false };
            const rect = el.getBoundingClientRect();
            const top = rect.top + window.pageYOffset;
            const scrollTarget = Math.max(0, top - 70);
            window.scrollTo({ top: scrollTarget, behavior: 'instant' });
            return { found: true, top, scrollTarget, windowY: window.pageYOffset, rectTopAfter: el.getBoundingClientRect().top };
          })()
        `,
        returnByValue: true
      });
      console.log(`Scroll result for ${vp.name}:`, evalRes.result.value);

      await sleep(1000);

      const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
      const outPath = path.join(outDir, `${vp.name}.png`);
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
      console.log(`Saved ${outPath}`);
    }

    client.close();
    console.log("Done testing all viewports!");
  } finally {
    edge.kill();
  }
}

run();
