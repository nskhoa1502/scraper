const scrapeCategory = async (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      // Open a new page
      let page = await browser.newPage();
      console.log(">> Opening new tab");
      await page.goto(url);
      console.log(">> Going to URL: " + url);

      // Wait for the HTML element to finish loading all content
      // Use selector to identify the element (class -> '.' , id -> '#')
      await page.waitForSelector("#webpage");
      console.log(">> Website has finished loading all content");

      // Extract html element with $$eval -> return a callback
      const dataCategory = await page.$$eval(
        "#navbar-menu > ul > li",
        (htmlElements) => {
          dataCategory = htmlElements.map((element) => {
            return {
              // After extracting the 'li' element -> extract the 'a' and innertext
              category: element.querySelector("a").innerText,
              link: element.querySelector("a").href,
            };
          });
          return dataCategory;
        }
      );

      console.log(dataCategory);

      // Turn off page
      await page.close();
      resolve();
    } catch (err) {
      console.log("Scrape category error: " + err);
      reject(err);
    }
  });

module.exports = { scrapeCategory };
