// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const { testNewestNews } = require("./tests/newest")
const { testPastNews } = require("./tests/past")

async function sortHackerNewsArticles() {
  
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Test pages
  try {

    await testNewestNews(page);
    await testPastNews(page);
    browser.close();          // Script does not end if browser does not close
    return 0;

  } catch (error) {
    console.error("Testing Has Failed: ");
    console.error(error);
    browser.close();
    return -1;
  }

}

(async () => {
  await sortHackerNewsArticles();
})();
