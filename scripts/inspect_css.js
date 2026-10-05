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

async function inspectCSS() {
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

    const info = await send('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('#engineering-credentials');
        const c1 = el.children[0];
        const c2 = el.children[1];
        ({
          sectionDisplay: getComputedStyle(el).display,
          sectionHeight: el.offsetHeight,
          c1Display: getComputedStyle(c1).display,
          c1Height: c1.offsetHeight,
          c1Classes: c1.className,
          c2Display: getComputedStyle(c2).display,
          c2Height: c2.offsetHeight,
          c2Classes: c2.className
        })
      `,
      returnByValue: true
    });
    console.log("Computed styles:", info.result.value);
    ws.close();
  } finally {
    edge.kill();
  }
}

inspectCSS();
