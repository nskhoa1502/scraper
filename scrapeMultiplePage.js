const scrapers = require("./scraper");
const fs = require("fs");

function formatVietnameseText(text) {
  // Remove diacritical marks
  const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Convert to lowercase and replace spaces with hyphens
  const formatted = normalized.toLowerCase().replace(/\s+/g, "-");

  return formatted;
}

const scrapeMultiplePage = async (browserInstance) => {
  console.log(
    "====================== SCRAPING MULTIPLE PAGES =============================="
  );
  const url = "https://phongtro123.com/";
  const indexes = [1, 2, 3, 4]; // Choose which category you will fetch.
  const maxPages = 5; // Number of pages to scrape for each category

  try {
    let browser = await browserInstance;

    // Call scrape functions in scraper.js

    // ==== 1. Scrape by category ========
    const categories = await scrapers.scrapeCategory(browser, url);
    // Take only 4 items
    const selectedCategories = categories.filter((category, index) =>
      indexes.some((i) => i === index)
    );
    // console.log(selectedCategories);

    // ==== 2. Scrape data =======

    for (const category of selectedCategories) {
      const result = [];

      for (let page = 1; page <= maxPages; page++) {
        const categoryUrl = `${category.link}?page=${page}`;

        try {
          const data = await scrapers.scraper(browser, categoryUrl);
          //   console.log(data);
          result.push(data);
          console.log(
            `Finish scraping page ${page} of ${formatVietnameseText(
              category.category
            )}`
          );
        } catch (error) {
          console.log(
            `Error scraping page ${page} of ${
              formatVietnameseText(category.category) || "unknown category"
            }: ${error}`
          );
        }
      }

      const filename = `${(
        formatVietnameseText(category.category) || "unknown category"
      ).replace(/\s+/g, "")}.json`;

      try {
        await new Promise((resolve, reject) => {
          fs.writeFile(filename, JSON.stringify(result), (error) => {
            if (error) {
              reject(error);
            } else {
              console.log(`Write ${filename} successfully`);
              resolve();
            }
          });
        });
      } catch (error) {
        console.log(`Failed to write ${filename}: ${error}`);
      }
    }

    await browser.close();
  } catch (error) {
    console.log("Error in scrape controller: " + error);
  }
};

module.exports = scrapeMultiplePage;
