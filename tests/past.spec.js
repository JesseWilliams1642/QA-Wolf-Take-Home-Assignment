const { testPastNews } = require('./past');
const { test } = require('@playwright/test');

test('Past Hacker News', async ({ page }) => {
  await testPastNews(page);
});