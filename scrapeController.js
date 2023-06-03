const scrapers = require("./scraper");

const scrapeController = async (browserInstance) => {
  const url = "https://phongtro123.com/";
  try {
    let browser = await browserInstance;

    // Call scrape functions in scraper.js

    // 1. Scrape by category
    let categories = scrapers.scrapeCategory(browser, url);
  } catch (error) {
    console.log("Error in scrape controller: " + error);
  }
};

module.exports = scrapeController;
