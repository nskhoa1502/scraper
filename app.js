const startBrowser = require("./browser");

let browser = startBrowser();
// =========  Scrape 1 page
// const scrapeController = require("./scrapeController");

// scrapeController(browser);

// =========== Scrape multiple pages (pagination)
const scrapeMultiplePage = require("./scrapeMultiplePage");

scrapeMultiplePage(browser);

//
