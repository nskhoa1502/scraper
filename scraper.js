const scrapeCategory = async (browser, url) => {
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
        return htmlElements.map((element) => {
          return {
            // After extracting the 'li' element -> extract the 'a' and innertext
            category: element.querySelector("a").innerText,
            link: element.querySelector("a").href,
          };
        });
      }
    );

    // Turn off page tab
    await page.close();
    console.log("page tab is closed");
    return dataCategory;
  } catch (err) {
    console.log("Scrape category error: " + err);
    throw err;
  }
};

const scraperDetail = async (browser, link) => {
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
        return htmlElements
          .map((htmlElement) => {
            return htmlElement.querySelector("img")?.src;
          })
          .filter((i) => i !== false);
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
            ?.className?.replace(/^\D+/g, ""),
          class: {
            content: htmlElement.querySelector("p").innerText,
            classType: htmlElement.querySelector("p > a > strong").innerText,
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

    // c. Scraping Detail content
    const scrapedMainContentHeader = await pageDetail.$eval(
      "#left-col > article.the-post > section.post-main-content",
      (htmlElement) =>
        htmlElement.querySelector("div.section-header>h2").innerText
    );
    const scrapedMainContentContent = await pageDetail.$$eval(
      "#left-col > article > section.section.post-main-content > div.section-content > p",
      (htmlElements) => htmlElements.map((element) => element.innerText)
    );

    // d. Scraping post features
    const scrapedPostFeaturesHeader = await pageDetail.$eval(
      "#left-col > article.the-post > section.post-overview",
      (htmlElement) =>
        htmlElement.querySelector("div.section-header>h3").innerText
    );
    const scrapedPostFeaturesContent = await pageDetail.$$eval(
      "#left-col > article > section.section.post-overview > div.section-content > table.table > tbody > tr",
      (htmlElements) =>
        htmlElements.map((element) => ({
          name: element.querySelector("td:first-child").innerText,
          content: element.querySelector("td:last-child").innerText,
        }))
    );

    // e. Contact info
    let scrapedContactHeader = "";
    let scrapedContactContent = [];

    try {
      scrapedContactHeader = await pageDetail.$eval(
        "#left-col > article.the-post > section.post-contact",
        (htmlElement) =>
          htmlElement.querySelector("div.section-header>h3").innerText
      );

      scrapedContactContent = await pageDetail.$$eval(
        "#left-col > article > section.section.post-contact > div.section-content > table.table > tbody > tr",
        (htmlElements) =>
          htmlElements.map((element) => ({
            name: element.querySelector("td:first-child").innerText,
            content: element.querySelector("td:last-child").innerText,
          }))
      );
    } catch (err) {
      console.log("Error in scraping contact info: " + err);
    }

    detailData.images = scrapedImages;
    detailData.header = scrapedHeader;
    detailData.mainContent = {
      header: scrapedMainContentHeader,
      content: scrapedMainContentContent,
    };
    detailData.overview = {
      header: scrapedPostFeaturesHeader,
      content: scrapedPostFeaturesContent,
    };
    detailData.contact = {
      header: scrapedContactHeader ? scrapedContactHeader : "",
      content: scrapedContactContent ? scrapedContactContent : [],
    };

    // 4. Close page
    await pageDetail.close();
    console.log(">> Closed tab " + link);
    return detailData;
  } catch (err) {
    console.log("Error in scraping data detail: " + err);
    throw err;
  }
};

const scraper = async (browser, url) => {
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

    // =========== Scrape item ============

    // 1. Scrape detail links
    const detailLinks = await newPage.$$eval(
      "#left-col > section.section-post-listing > ul > li",
      (htmlElements) => {
        return htmlElements.map((element) => {
          return element.querySelector(".post-meta > h3 > a").href;
        });
      }
    );

    // 2. Scrape detail data
    const details = [];
    for (let link of detailLinks) {
      const detail = await scraperDetail(browser, link);
      details.push(detail);
    }

    // 3. Append all the scraping data into scrapedData

    scrapedData.header = headerData;
    scrapedData.body = details;
    console.log(">> Browser closed");
    return scrapedData;
  } catch (err) {
    throw err;
  }
};

module.exports = { scrapeCategory, scraper };
