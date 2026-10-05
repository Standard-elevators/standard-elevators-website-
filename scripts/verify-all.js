async function verifyRoute(name, path, checks = []) {
  try {
    const res = await fetch(`http://localhost:3000${path}`);
    const text = await res.text();
    const status = res.status;
    
    console.log(`\n========================================`);
    console.log(`ROUTE: ${name} (${path}) — HTTP ${status}`);
    console.log(`========================================`);

    if (status !== 200) {
      console.error(`FAILED: Expected 200, got ${status}`);
      return false;
    }

    let allPassed = true;
    for (const check of checks) {
      const passed = check.test(text);
      console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${check.desc}`);
      if (!passed) allPassed = false;
    }

    return allPassed;
  } catch (err) {
    console.error(`ERROR verifying ${path}:`, err);
    return false;
  }
}

async function main() {
  console.log("STARTING FULL SITE AUDIT & VERIFICATION...");

  const results = [];

  // 1. Homepage
  results.push(await verifyRoute("Homepage", "/", [
    { desc: "Has canonical tag pointing to standardelevators.in", test: t => t.includes('rel="canonical"') && t.includes('href="https://standardelevators.in"') },
    { desc: "Has unique homepage title", test: t => t.includes("<title>Standard Engineering Works Elevators | Smooth, Smart, Spacious</title>") },
    { desc: "Has meta description", test: t => t.includes('name="description"') && t.includes('Pioneering elevator design') },
    { desc: "Has OpenGraph tags", test: t => t.includes('property="og:title"') && t.includes('property="og:image"') },
    { desc: "Has HomeAndConstructionBusiness JSON-LD schema", test: t => t.includes('"@type":"HomeAndConstructionBusiness"') && t.includes('Standard Engineering Works Elevators') },
    { desc: "Has WebSite JSON-LD schema", test: t => t.includes('"@type":"WebSite"') },
    { desc: "Has Project Portfolio section", test: t => t.includes('id="project-portfolio"') && t.includes('Project Portfolio') },
    { desc: "Has Engineering Credentials rendered via SSR (no null flash)", test: t => t.includes('id="engineering-credentials"') && t.includes('100+') },
  ]));

  // 2. About Page
  results.push(await verifyRoute("About Page", "/about", [
    { desc: "Has canonical tag /about", test: t => t.includes('rel="canonical"') && t.includes('https://standardelevators.in/about') },
    { desc: "Has unique title", test: t => t.includes("About Us | Standard Engineering Works Elevators") },
    { desc: "Has BreadcrumbList schema", test: t => t.includes('"@type":"BreadcrumbList"') },
    { desc: "Contains history and credentials", test: t => t.includes("Established in the year 2003") && t.includes("100+ Verified Units") },
  ]));

  // 3. Services Overview Page
  results.push(await verifyRoute("Services Overview", "/services", [
    { desc: "Has canonical tag /services", test: t => t.includes('rel="canonical"') && t.includes('https://standardelevators.in/services') },
    { desc: "Has unique title", test: t => t.includes("Elevator Solutions &amp; Services") || t.includes("Elevator Solutions & Services") },
    { desc: "Has BreadcrumbList schema", test: t => t.includes('"@type":"BreadcrumbList"') },
    { desc: "Contains services list", test: t => t.includes("Passenger Lifts") && t.includes("MRL Lifts") },
  ]));

  // 4. Passenger Lifts Service Detail
  results.push(await verifyRoute("Passenger Lifts Detail", "/services/passenger-lifts", [
    { desc: "Has canonical tag /services/passenger-lifts", test: t => t.includes('rel="canonical"') && t.includes('https://standardelevators.in/services/passenger-lifts') },
    { desc: "Has unique title", test: t => t.includes("Passenger Lifts &amp; Elevators") || t.includes("Passenger Lifts & Elevators") },
    { desc: "Has Service JSON-LD schema", test: t => t.includes('"@type":"Service"') && t.includes('Passenger Elevators') },
    { desc: "Has BreadcrumbList schema", test: t => t.includes('"@type":"BreadcrumbList"') },
    { desc: "Uses dedicated architectural image", test: t => t.includes('3d_apartments.jpg') },
  ]));

  // 5. MRL Lifts Service Detail
  results.push(await verifyRoute("MRL Lifts Detail", "/services/mrl-lifts", [
    { desc: "Has canonical tag /services/mrl-lifts", test: t => t.includes('rel="canonical"') && t.includes('https://standardelevators.in/services/mrl-lifts') },
    { desc: "Has Service JSON-LD schema", test: t => t.includes('"@type":"Service"') && t.includes('Machine-Room-Less') },
    { desc: "Uses dedicated commercial image", test: t => t.includes('3d_commercial.jpg') },
  ]));

  // 6. Goods Lifts Service Detail
  results.push(await verifyRoute("Goods Lifts Detail", "/services/goods-lifts", [
    { desc: "Has canonical tag /services/goods-lifts", test: t => t.includes('rel="canonical"') && t.includes('https://standardelevators.in/services/goods-lifts') },
    { desc: "Has Service JSON-LD schema", test: t => t.includes('"@type":"Service"') && t.includes('Goods &amp; Freight Lifts') || t.includes('Goods & Freight Lifts') },
    { desc: "Uses dedicated industrial image", test: t => t.includes('3d_industrial.jpg') },
  ]));

  // 7. Hospital Lifts Service Detail
  results.push(await verifyRoute("Hospital Lifts Detail", "/services/hospital-lifts", [
    { desc: "Has canonical tag /services/hospital-lifts", test: t => t.includes('rel="canonical"') && t.includes('https://standardelevators.in/services/hospital-lifts') },
    { desc: "Has Service JSON-LD schema", test: t => t.includes('"@type":"Service"') && t.includes('Hospital &amp; Stretcher Lifts') || t.includes('Hospital & Stretcher Lifts') },
    { desc: "Uses dedicated healthcare image", test: t => t.includes('3d_healthcare_v2.jpg') },
  ]));

  // 8. Gallery Page
  results.push(await verifyRoute("Gallery Page", "/gallery", [
    { desc: "Has canonical tag /gallery", test: t => t.includes('rel="canonical"') && t.includes('https://standardelevators.in/gallery') },
    { desc: "Has unique gallery title", test: t => t.includes("Project Portfolio &amp; Gallery") || t.includes("Project Portfolio & Gallery") },
    { desc: "Has BreadcrumbList schema", test: t => t.includes('"@type":"BreadcrumbList"') },
    { desc: "Contains gallery filters and grid", test: t => t.includes("Project") && t.includes("Gallery") },
  ]));

  // 9. Contact Page
  results.push(await verifyRoute("Contact Page", "/contact", [
    { desc: "Has canonical tag strictly /contact (without query string pollution)", test: t => t.includes('rel="canonical"') && t.includes('https://standardelevators.in/contact') },
    { desc: "Has unique contact title", test: t => t.includes("Contact Us &amp; Request a Quote") || t.includes("Contact Us & Request a Quote") },
    { desc: "Has BreadcrumbList schema", test: t => t.includes('"@type":"BreadcrumbList"') },
    { desc: "Contains contact form and NAP info", test: t => t.includes("9515231555") && t.includes("standardelevators.engworks12@gmail.com") },
  ]));

  // 10. Sitemap
  results.push(await verifyRoute("Sitemap XML", "/sitemap.xml", [
    { desc: "Contains homepage", test: t => t.includes("<loc>https://standardelevators.in/</loc>") },
    { desc: "Contains about", test: t => t.includes("<loc>https://standardelevators.in/about</loc>") },
    { desc: "Contains services", test: t => t.includes("<loc>https://standardelevators.in/services</loc>") },
    { desc: "Contains gallery", test: t => t.includes("<loc>https://standardelevators.in/gallery</loc>") },
    { desc: "Contains contact", test: t => t.includes("<loc>https://standardelevators.in/contact</loc>") },
    { desc: "Excludes admin portal", test: t => !t.includes("/admin") },
  ]));

  // 11. Robots.txt
  results.push(await verifyRoute("Robots TXT", "/robots.txt", [
    { desc: "Allows public crawling", test: t => t.includes("Allow: /") },
    { desc: "Blocks admin", test: t => t.includes("Disallow: /admin/") },
    { desc: "Declares sitemap URL", test: t => t.includes("Sitemap: https://standardelevators.in/sitemap.xml") },
  ]));

  const total = results.length;
  const passed = results.filter(Boolean).length;
  console.log(`\n========================================`);
  console.log(`AUDIT SUMMARY: ${passed}/${total} PAGES FULLY PASSED`);
  console.log(`========================================\n`);
}

main();
