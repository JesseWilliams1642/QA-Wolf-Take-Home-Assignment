const { convertTime } = require('../utils/timeToNumber');
const { expect } = require('@playwright/test');
require('dotenv').config();

async function testPastNews(page) {

    try {

        console.log("Testing Past Page.");

        // Go to Past News (currently yesterday)
        await page.goto("https://news.ycombinator.com/front");

        // Read past date from website
        const dateFormated = await page.locator('font').filter({
            hasText: /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/i          
        }).innerHTML();
        const [year, month, day] = dateFormated.split('-').map(Number);
        let date = new Date(Date.UTC(year, month-1, day, 23, 59, 59));      // As month is 0-11

        // Test yesterday
        process.stdout.write("\tTesting Past Landing Page.")
        let trackedTime = (Date.now() - date.getTime()) / 60000;    // Calculate time (in min) since today
        await testPastDate(page, trackedTime);                            // Test the date 
        process.stdout.write(" ✅\n");

        // Test going back a day
        date.setDate(date.getDate() - 1);                           // Decrement date tracker
        let dateText = date.toISOString().slice(0, 10);             // Format to create href string
        let aString = "a[href=\"front?day=" + dateText + "\"]";
        await page.locator(aString).click();                        // Move backward 1 day
        
        process.stdout.write("\tTesting Backwards 1 Day Page.");
        trackedTime = (Date.now() - date.getTime()) / 60000;    // Calculate time (in min) since today
        await testPastDate(page, trackedTime);
        process.stdout.write(" ✅\n");

        // Test going back a month
        date.setMonth(date.getMonth() - 1);                        // Decrement month
        dateText = date.toISOString().slice(0, 10);            
        aString = "a[href=\"front?day=" + dateText + "\"]";
        await page.locator(aString).click();                       // Move back 1 month
        
        process.stdout.write("\tTesting Backwards 1 Month Page.");
        trackedTime = (Date.now() - date.getTime()) / 60000;    
        await testPastDate(page, trackedTime);
        process.stdout.write(" ✅\n");

        // Test going back a year
        date.setFullYear(date.getFullYear() - 1);                  // Decrement year
        dateText = date.toISOString().slice(0, 10);            
        aString = "a[href=\"front?day=" + dateText + "\"]";
        await page.locator(aString).click();                       // Move back 1 year
        
        process.stdout.write("\tTesting Backwards 1 Year Page.");
        trackedTime = (Date.now() - date.getTime()) / 60000;    
        await testPastDate(page, trackedTime);
        process.stdout.write(" ✅\n");

        // Test going forward a year
        date.setFullYear(date.getFullYear() + 1);                  // Increment year
        dateText = date.toISOString().slice(0, 10);            
        aString = "a[href=\"front?day=" + dateText + "\"]";
        await page.locator(aString).click();                       // Move forward 1 year
        
        process.stdout.write("\tTesting Forwards 1 Year Page.");
        trackedTime = (Date.now() - date.getTime()) / 60000;    
        await testPastDate(page, trackedTime);
        process.stdout.write(" ✅\n");

        // Test going forward a month
        date.setMonth(date.getMonth() + 1);                        // Increment month
        dateText = date.toISOString().slice(0, 10);            
        aString = "a[href=\"front?day=" + dateText + "\"]";
        await page.locator(aString).click();                       // Move forward 1 month
        
        process.stdout.write("\tTesting Forwards 1 Month Page.");
        trackedTime = (Date.now() - date.getTime()) / 60000;    
        await testPastDate(page, trackedTime);
        process.stdout.write(" ✅\n");

        // Test going forward a day
        date.setDate(date.getDate() + 1);                           // Increment date tracker
        dateText = date.toISOString().slice(0, 10);             
        aString = "a[href=\"front?day=" + dateText + "\"]";
        await page.locator(aString).click();                        // Move forward 1 day
        
        process.stdout.write("\tTesting Forwards 1 Day Page.");
        trackedTime = (Date.now() - date.getTime()) / 60000;    
        await testPastDate(page, trackedTime);
        process.stdout.write(" ✅\n");

        console.log("Test for Past News completed successfully.");
    
    } catch (error) {
        process.stdout.write(" ❌\n");
        console.error(`Error testing Past News: ${error.message}`);
        if (error.stack)
            console.error(error.stack);
        return -1;
    }
}

async function testPastDate(page, trackedTime) {

    const NUM_ARTICLES = process.env.NUM_ARTICLES;
    const ARTICLES_PER_PAGE = process.env.ARTICLES_PER_PAGE;

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
            hasText: /[0-9]+\s[A-Za-z]+\sago|(?:[Jan,Feb,March,April,May,June,July,Aug,Sept,Oct,Nov,Dec]\s[1-3]{0,1}[0-9],\s[0-9][0-9][0-9][0-9])/i       
        });
        const time = await timeLink.innerHTML();

        // Convert to comparable number and check that it is before 
        // the tracked time.

        // Note: For the past functionality, it goes back in time strictly based
        // on UTC time. So for myself (AEST) there is a 10 hour difference. This means
        // that my Date() is 10 hours off of the times given on the website. Need to
        // offset it so comparisons work (or change the website to accomodate timezones!)
        const convertedTime = convertTime(time) - new Date().getTimezoneOffset();

        await expect(convertedTime >= trackedTime).toBeTruthy();

    }

}

module.exports = { testPastNews };