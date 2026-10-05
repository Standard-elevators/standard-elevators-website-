const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
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

async function capture(viewportWidth, viewportHeight, outName) {
  const port = 9222;
  const userDataDir = path.resolve(__dirname, '..', '.cdp-temp-profile');
  
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
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

    if (!target) throw new Error("Could not find target page in CDP");

    const client = new CDPClient(target.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log("Waiting for site loader...");
    await sleep(3800);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: 1,
      mobile: viewportWidth < 768
    });

    // Scroll to credentials section taking into account fixed header
    await client.send('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('#engineering-credentials');
        if (el) {
          const rect = el.getBoundingClientRect();
          const targetY = window.pageYOffset + rect.top - 80;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'instant' });
        }
      `
    });

    await sleep(600);

    const { data } = await client.send('Page.captureScreenshot', {
      format: 'png'
    });

    const outPath = path.resolve(__dirname, '..', outName);
    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot to ${outPath}`);

    client.close();
  } finally {
    edge.kill();
  }
}

const width = parseInt(process.argv[2] || "1440", 10);
const height = parseInt(process.argv[3] || "900", 10);
const out = process.argv[4] || "screenshot-v3.png";

capture(width, height, out).catch(err => {
  console.error("CDP Screenshot failed:", err);
  process.exit(1);
});
