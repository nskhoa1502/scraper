const scrapers = require("./scraper");
const fs = require("fs");

const scrapeController = async (browserInstance) => {
  console.log(
    "====================== SCRAPING SINGLE PAGE =============================="
  );
  const url = "https://phongtro123.com/";
  const indexes = [1, 2, 3, 4];
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

    // let result1 = await scrapers.scraper(browser, selectedCategories[0].link);
    // fs.writeFile("chothuephongtro.json", JSON.stringify(result1), (err) => {
    //   if (err) console.log("Fail to write json file: " + err);
    //   console.log("Write data successfully");
    // });

    // let result2 = await scrapers.scraper(browser, selectedCategories[1].link);
    // fs.writeFile("nhachothue.json", JSON.stringify(result2), (err) => {
    //   if (err) console.log("Fail to write json file: " + err);
    //   console.log("Write data successfully");
    // });

    // let result3 = await scrapers.scraper(browser, selectedCategories[2].link);
    // fs.writeFile("chothuecanho.json", JSON.stringify(result3), (err) => {
    //   if (err) console.log("Fail to write json file: " + err);
    //   console.log("Write data successfully");
    // });

    let result4 = await scrapers.scraper(browser, selectedCategories[3].link);
    fs.writeFile("chothuematbang.json", JSON.stringify(result4), (err) => {
      if (err) console.log("Fail to write json file: " + err);
      console.log("Write data successfully");
    });

    await browser.close();
  } catch (error) {
    console.log("Error in scrape controller: " + error);
  }
};

module.exports = scrapeController;
