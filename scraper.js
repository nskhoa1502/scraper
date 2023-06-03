const scrapeCategory = async (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      // Open a new page
      let page = await browser.newPage();
      console.log(">> Opened new tab");
      await page.goto(url);
      console.log(">> Accessed to URL: " + url);

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

      // Turn off page tab
      await page.close();
      console.log("page tab is closed");
      resolve(dataCategory);
    } catch (err) {
      console.log("Scrape category error: " + err);
      reject(err);
    }
  });

const scraper = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let newPage = await browser.newPage();
      console.log(">> Opened new page");
      await newPage.goto(url);
      console.log(">> Accessed to URL: " + url);
      await newPage.waitForSelector("#main");
      console.log(">> main element finished loading");

      const scrapedData = {};

      // =========== Scrape header ===========
      const headerData = await newPage.$eval("header", (htmlElement) => {
        return {
          title: htmlElement.querySelector("h1").innerText,
          description: htmlElement.querySelector("p").innerText,
        };
      });
      //   console.log(headerData);
      scrapedData.header = headerData;

      // =========== Scrape item ============

      // 1. Scrape detail links
      const detailLinks = await newPage.$$eval(
        "#left-col > section.section-post-listing > ul > li",
        (htmlElements) => {
          detailLinks = htmlElements.map((element) => {
            return element.querySelector(".post-meta > h3 > a").href;
          });
          return detailLinks;
        }
      );

      //   console.log(detailLinks);

      // Scrape detail data
      const scraperDetail = async (link) => {
        try {
          let pageDetail = await browser.newPage();

          // 1. Open detail page
          await pageDetail.goto(link);
          console.log(">> Opened detail page: " + link);
          console.log("---");

          // 2. Wait for page to finish loading
          await pageDetail.waitForSelector("#main");
          //   console.log(">> Loaded page " + link);
          //   console.log("---");

          // 3. Start scraping...
          const detailData = {};

          // a. scrape image:
          const scrapedImages = await pageDetail.$$eval(
            "#left-col > article > div.post-images > div.images-swiper-container > div.swiper-wrapper > div.swiper-slide",
            (htmlElements) => {
              scrapedImages = htmlElements.map((htmlElement) => {
                return htmlElement.querySelector("img").src;
              });
              return scrapedImages;
            }
          );

          // b. scrape header detail
          const scrapedHeader = await pageDetail.$eval(
            "header.page-header",
            (htmlElement) => {
              return {
                title: htmlElement.querySelector("h1>a").innerText,
                start: htmlElement
                  .querySelector("h1 > span")
                  // Only extract the number of className => 'star start-5' => 5
                  .className.replace(/^\D+/g, ""),
                class: {
                  content: htmlElement.querySelector("p").innerText,
                  classType:
                    htmlElement.querySelector("p > a > strong").innerText,
                },
                address: htmlElement.querySelector("address").innerText,
                attributes: {
                  price: htmlElement.querySelector(
                    "div.post-attributes > .price > span"
                  ).innerText,
                  acreage: htmlElement.querySelector(
                    "div.post-attributes > .acreage > span"
                  ).innerText,
                  published: htmlElement.querySelector(
                    "div.post-attributes > .published > span"
                  ).innerText,
                  hashtag: htmlElement.querySelector(
                    "div.post-attributes > .hashtag > span"
                  ).innerText,
                },
              };
            }
          );

          console.log(scrapedHeader);
          //   console.log(scrapedImages);
          detailData.images = images;

          // 4. Close page
          await pageDetail.close();
          console.log(">> Closed tab " + link);
        } catch (err) {
          console.log("Error in scraping data detail: " + err);
        }
      };

      // Initializing the scraping process
      for (let link of detailLinks) {
        await scraperDetail(link);
      }

      await browser.close();
      console.log(">> Browser closed");
      resolve();
    } catch (err) {
      reject(err);
    }
  });
module.exports = { scrapeCategory, scraper };
