const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function runAudit() {
  console.log('====================================================');
  console.log('   STANDARD ENGINEERING WORKS ELEVATORS — AUDIT     ');
  console.log('====================================================\n');

  // 1. Static Assets Verification
  console.log('--- 1. STATIC ASSET AUDIT ---');
  function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat && stat.isDirectory()) results = results.concat(walk(full));
      else if (/\.(tsx|ts)$/.test(file)) results.push(full);
    });
    return results;
  }
  const files = walk('./src');
  const regex = /['"](\/[a-zA-Z0-9_\-\/]+\.(png|jpg|jpeg|svg|webp|mp4))['"]/g;
  const foundAssets = new Set();
  files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    let match;
    while ((match = regex.exec(content)) !== null) {
      foundAssets.add(match[1]);
    }
  });
  let missingCount = 0;
  for (const asset of foundAssets) {
    const local = path.join('./public', asset);
    const exists = fs.existsSync(local);
    console.log(`  [Asset] ${asset.padEnd(32)}: ${exists ? 'PASS (Exists)' : 'FAIL (Missing)'}`);
    if (!exists) missingCount++;
  }

  // 2. Secret Exposure & Gitignore Audit
  console.log('\n--- 2. CREDENTIAL & GIT SECRECY AUDIT ---');
  try {
    const gitIgnoreCheck = execSync('git check-ignore .env.local', { encoding: 'utf8' }).trim();
    console.log(`  [Git] .env.local ignored: ${gitIgnoreCheck === '.env.local' ? 'PASS (Properly ignored)' : 'FAIL'}`);
  } catch (e) {
    console.log('  [Git] .env.local check failed:', e.message);
  }

  // Check no private server secrets have NEXT_PUBLIC_
  const envContent = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';
  const exposedSecret = /NEXT_PUBLIC_[A-Z0-9_]*SECRET/i.test(envContent);
  console.log(`  [Secrets] No NEXT_PUBLIC_*_SECRET in .env.local: ${!exposedSecret ? 'PASS (Secure)' : 'FAIL (Exposed!)'}`);

  // 3. HTTP Endpoints & Route Crawl
  console.log('\n--- 3. ROUTE AVAILABILITY & SEO METADATA ---');
  const testRoutes = [
    '/',
    '/about',
    '/services',
    '/services/passenger-lifts',
    '/services/mrl-lifts',
    '/services/goods-lifts',
    '/services/hospital-lifts',
    '/gallery',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/admin/login',
    '/admin',
    '/admin/services',
    '/admin/gallery',
    '/admin/inquiries',
    '/robots.txt',
    '/sitemap.xml',
  ];

  const htmlResponses = {};
  for (const route of testRoutes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`);
      const text = await res.text();
      htmlResponses[route] = text;
      const isXmlOrTxt = route.endsWith('.xml') || route.endsWith('.txt');
      const hasTitle = text.includes('<title>') || isXmlOrTxt;
      const statusOk = res.status === 200;
      console.log(`  [Route] ${route.padEnd(28)}: HTTP ${res.status} | Title: ${hasTitle ? 'YES' : 'NO '} | Size: ${text.length}B -> ${statusOk ? 'PASS' : 'FAIL'}`);
    } catch (err) {
      console.log(`  [Route] ${route.padEnd(28)}: ERROR (${err.message}) -> FAIL`);
    }
  }

  // 3b. 404 Error Page Test
  try {
    const res404 = await fetch('http://localhost:3000/non-existent-floor');
    const text404 = await res404.text();
    const is404 = res404.status === 404 && text404.includes('Floor Not Found');
    console.log(`  [Route] /non-existent-floor         : HTTP ${res404.status} | Custom 404: ${is404 ? 'YES' : 'NO '} -> ${is404 ? 'PASS (Branded 404)' : 'FAIL'}`);
  } catch (err) {
    console.log('  [Route] 404 test error:', err.message);
  }

  // 4. Broken Link Checker (Scan all links in rendered HTML)
  console.log('\n--- 4. INTERNAL LINK INTEGRITY AUDIT ---');
  const linkRegex = /href=["'](\/[^"'#?]*)/g;
  const internalLinks = new Set();
  Object.values(htmlResponses).forEach(html => {
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      if (href && !href.startsWith('/_next') && !href.startsWith('/api')) {
        internalLinks.add(href);
      }
    }
  });

  let brokenLinks = 0;
  for (const href of internalLinks) {
    try {
      const res = await fetch(`http://localhost:3000${href}`);
      const pass = res.status === 200 || res.status === 307 || res.status === 308;
      console.log(`  [Link] ${href.padEnd(30)}: HTTP ${res.status} -> ${pass ? 'PASS' : 'FAIL (404/Error)'}`);
      if (!pass) brokenLinks++;
    } catch (e) {
      console.log(`  [Link] ${href.padEnd(30)}: ERROR -> FAIL`);
      brokenLinks++;
    }
  }
  console.log(`  Total internal links verified: ${internalLinks.size}, Broken: ${brokenLinks}`);

  // 5. Cloudinary & Admin Security Tests
  console.log('\n--- 5. API SECURITY & ACCESS CONTROL AUDIT ---');
  // 5a. Unauthorized calls to /api/cloudinary/sign
  try {
    const res = await fetch('http://localhost:3000/api/cloudinary/sign', { method: 'POST' });
    const json = await res.json();
    const pass = res.status === 401 && json.error.includes('Authentication token');
    console.log(`  [Security] /api/cloudinary/sign (No Auth): HTTP ${res.status} -> ${pass ? 'PASS (Protected)' : 'FAIL'}`);
  } catch (e) {
    console.log('  [Security] /api/cloudinary/sign error:', e.message);
  }

  // 5b. Unauthorized calls to /api/cloudinary/delete
  try {
    const res = await fetch('http://localhost:3000/api/cloudinary/delete', { method: 'POST' });
    const json = await res.json();
    const pass = res.status === 401 && json.error.includes('Authentication token');
    console.log(`  [Security] /api/cloudinary/delete (No Auth): HTTP ${res.status} -> ${pass ? 'PASS (Protected)' : 'FAIL'}`);
  } catch (e) {
    console.log('  [Security] /api/cloudinary/delete error:', e.message);
  }

  // 5c. Invalid token calls
  try {
    const res = await fetch('http://localhost:3000/api/cloudinary/sign', {
      method: 'POST',
      headers: { Authorization: 'Bearer fake-invalid-token' }
    });
    const json = await res.json();
    const pass = res.status === 401 && json.error.includes('Invalid or expired');
    console.log(`  [Security] /api/cloudinary/sign (Fake Token): HTTP ${res.status} -> ${pass ? 'PASS (Rejected)' : 'FAIL'}`);
  } catch (e) {
    console.log('  [Security] Fake token test error:', e.message);
  }

  // 6. Production Build & Lint Summary
  console.log('\n====================================================');
  console.log('   AUDIT SUITE EXECUTION COMPLETE                   ');
  console.log('====================================================');
}

runAudit();
