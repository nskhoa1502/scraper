const puppeteer = require("puppeteer");

const startBrowser = async () => {
  let browser;
  try {
    // Start a browser instance
    browser = await puppeteer.launch({
      headless: true, // True -> No broswer open | False -> Browser open

      // By default, chrome will use multiple layers of sandbox to prevent risk contents
      // If you want to disable that protection then set it to disable
      args: ["--disable-stuid-sandbox"],

      // Ignore https error
      ignoreHTTPSErrors: true,
    });
  } catch (error) {
    console.log("Could not launch browser: " + error);
  }
  return browser;
};

module.exports = startBrowser;
