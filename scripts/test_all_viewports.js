const { spawn } = require('child_process');
const http = require('http');

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

const VIEWPORTS = [
  { name: 'Small Phone 320x568', width: 320, height: 568, mobile: true },
  { name: 'Small Phone 360x640', width: 360, height: 640, mobile: true },
  { name: 'Standard Phone 375x667', width: 375, height: 667, mobile: true },
  { name: 'iPhone 14/15 390x844', width: 390, height: 844, mobile: true },
  { name: 'iPhone Plus 414x896', width: 414, height: 896, mobile: true },
  { name: 'iPhone Pro Max 430x932', width: 430, height: 932, mobile: true },
  { name: 'iPad Mini / Tablet 768x1024', width: 768, height: 1024, mobile: true },
  { name: 'iPad Air 820x1180', width: 820, height: 1180, mobile: true },
  { name: 'Landscape Tablet 1024x768', width: 1024, height: 768, mobile: false },
  { name: 'Laptop 1280x720', width: 1280, height: 720, mobile: false },
  { name: 'Standard Laptop 1440x900', width: 1440, height: 900, mobile: false },
  { name: 'Full HD Desktop 1920x1080', width: 1920, height: 1080, mobile: false },
  { name: 'QHD Large Desktop 2560x1440', width: 2560, height: 1440, mobile: false }
];

async function run() {
  const edge = spawn("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", [
    '--remote-debugging-port=9222',
    '--headless=new',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\sai veni\\OneDrive\\Desktop\\standard elevators web\\.cdp-temp-profile',
    'http://localhost:3000'
  ]);

  try {
    let target = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      try {
        const list = await getJson('http://127.0.0.1:9222/json');
        target = list.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
        if (target) break;
      } catch (e) {}
    }
    if (!target) throw new Error("Could not find browser tab");

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    
    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const curId = id++;
        const handler = e => {
          const msg = JSON.parse(e.data);
          if (msg.id === curId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    console.log("Waiting for page initialization...");
    await sleep(3500);

    console.log("\n=======================================================");
    console.log("TESTING VIEWPORTS FOR HORIZONTAL OVERFLOW & LAYOUT INTEGRITY");
    console.log("=======================================================");

    let passedCount = 0;

    for (const vp of VIEWPORTS) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });
      await sleep(200);

      const metrics = await send('Runtime.evaluate', {
        expression: `
          ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            bodyScrollWidth: document.body.scrollWidth,
            hasOverflow: document.documentElement.scrollWidth > window.innerWidth
          })
        `,
        returnByValue: true
      });

      const { scrollWidth, innerWidth, hasOverflow } = metrics.result.value;
      const status = !hasOverflow ? "PASS" : "FAIL (OVERFLOW)";
      console.log(`[${status}] ${vp.name.padEnd(30)}: innerWidth=${innerWidth}px, scrollWidth=${scrollWidth}px`);
      if (!hasOverflow) passedCount++;
    }

    console.log("=======================================================");
    console.log(`VIEWPORT AUDIT RESULT: ${passedCount}/${VIEWPORTS.length} PASSED (0 horizontal overflow)`);
    console.log("=======================================================\n");

    ws.close();
  } finally {
    edge.kill();
  }
}

run().catch(console.error);
