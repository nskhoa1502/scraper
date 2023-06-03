const scrapers = require("./scraper");

const scrapeController = async (browserInstance) => {
  const url = "https://phongtro123.com/";
  const indexes = [1, 2, 3, 4];
  try {
    let browser = await browserInstance;

    // Call scrape functions in scraper.js

    // ==== 1. Scrape by category ========
    let categories = await scrapers.scrapeCategory(browser, url);
    // Take only 4 items
    const selectedCategories = categories.filter((category, index) =>
      indexes.some((i) => i === index)
    );
    // console.log(selectedCategories);

    // ==== 2. Scrape header data =======
    await scrapers.scraper(browser, selectedCategories[0].link);
  } catch (error) {
    console.log("Error in scrape controller: " + error);
  }
};

module.exports = scrapeController;
