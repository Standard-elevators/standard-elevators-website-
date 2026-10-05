const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

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

async function testScroll() {
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

    await sleep(3800);

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    const info = await send('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('#engineering-credentials');
        ({
          offsetTop: el.offsetTop,
          offsetHeight: el.offsetHeight,
          offsetWidth: el.offsetWidth
        })
      `,
      returnByValue: true
    });
    console.log("Desktop Section info at 1440px:", info.result.value);

    // Scroll to the exact top of the section minus header height (80px)
    const targetY = info.result.value.offsetTop - 80;
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${targetY}, behavior: 'instant' })`
    });

    await sleep(800);

    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshot-scratch-desktop.png', Buffer.from(data, 'base64'));
    console.log("Saved screenshot-scratch-desktop.png");
    ws.close();
  } finally {
    edge.kill();
  }
}

testScroll();
