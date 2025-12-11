// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const { testNewestNews } = require("./tests/newest")

async function sortHackerNewsArticles() {
  
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Test pages
  testNewestNews(page);

  return 0;
  
}

(async () => {
  await sortHackerNewsArticles();
})();
