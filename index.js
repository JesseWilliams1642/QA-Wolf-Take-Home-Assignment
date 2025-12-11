// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const { expect } = require("playwright/test");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  const NUM_ARTICLES = 100;
  const ARTICLES_PER_PAGE = 30;
  let previousTime = 0;

  try {

    for (let i = 0; i < NUM_ARTICLES; i++) {

      // Check if we need to move to the next page
      if (i > 0 && i % ARTICLES_PER_PAGE === 0) 
        await page.locator('.morelink').click()

      // Get the (i+1)th row
      const index = (i+1).toString() + ".";
      const spanText = page.locator('.rank', {
        hasText: new RegExp(`^${index}$`)           // Using hasText does not do exact text matching. Regex does!
      });
      const tableData = page.locator('td').filter({ has: spanText });
      const tableRow = page.locator('tr.athing.submission').filter({ has: tableData });
      
      // Extract the id of the entry
      const id = await tableRow.getAttribute('id');

      // Get the corresponding link element for this id
      const aString = "a[href=\"item?id=" + id + "\"]";
      const timeLink = page.locator(aString).filter({
        hasText: /[0-9]+\s[A-Za-z]+\sago/i          
      });
      const time = await timeLink.innerHTML();

      // Convert to comparable number and check that ordering is correct
      const convertedTime = convertTime(time);
      await expect(convertedTime >= previousTime).toBeTruthy();
      previousTime = convertedTime;

    }

    console.log("Test completed successfully.");
  
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.stack)
      console.error(error.stack);
  }
  
}

function convertTime(time) {
  const splitString = time.split(" ");
  switch (splitString[1]) {
    case "minute":
      return 1;
    case "minutes":
      return parseInt(splitString[0]);
    case "hour":
      return 60;
    case "hours":
      return parseInt(splitString[0]) * 60;
    case "day":
      return 60 * 24;
    case "days":
      return parseInt(splitString[0]) * 60 * 24;
    case "month":
      return 60 * 24 * 30;
    case "months":
      return parseInt(splitString[0]) * 60 * 24 * 30;
    case "year":
      return 60 * 24 * 30 * 12;
    case "years":
      return parseInt(splitString[0]) * 60 * 24 * 30 * 12;;
    default:
      throw new Error("Time could not be converted.");
  }
}

(async () => {
  await sortHackerNewsArticles();
})();
