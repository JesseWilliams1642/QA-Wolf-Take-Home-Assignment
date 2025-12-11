const { convertTime } = require('../utils/timeToNumber');
const { expect } = require('@playwright/test');

async function testNewestNews(page) {

    // Go to Newest News
    await page.goto("https://news.ycombinator.com/newest");

    const NUM_ARTICLES = 100;
    const ARTICLES_PER_PAGE = 30;
    let previousTime = 0;

    try {

        for (let i = 0; i < NUM_ARTICLES; i++) {

        // Check if we need to move to the next page
        if (i > 0 && i % ARTICLES_PER_PAGE === 0)
            await page.locator('.morelink').click();

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

        console.log("Test for Newest News completed successfully.");
    
    } catch (error) {
        console.error(`Error testing Newest News: ${error.message}`);
        if (error.stack)
            console.error(error.stack);
        return -1;
    }
}

module.exports = { testNewestNews };