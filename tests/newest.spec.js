const { testNewestNews } = require('./newest');
const { test } = require('@playwright/test');

test('Newest Hacker News', async ({ page }) => {
  await testNewestNews(page);
});