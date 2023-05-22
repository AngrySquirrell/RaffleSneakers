import puppeteer from "puppeteer";
import fs from "fs";

const main = async () => {
    let targets = JSON.parse(fs.readFileSync("config.json", "utf8")).urls;
    let results;

    const browser = await puppeteer.launch({
            headless: false,
        }),
        page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0');
    targets.forEach(async (el, id) => {
        await page.goto(el);
        await page.click("#menu-button-pdp-size-selector");

        let buttonsWithPrices = await page.$$("css-1o6kz7w > button");
        for (let button of buttonsWithPrices) {
            let size = await button.$eval("dt", (el) => el.innerHTML);
            console.log("size: "+ size);
            let price = await button.$eval("dd", (el) => el.innerHTML);
            console.log("price: "+ price);
            results = { ...results, [size]: price };
        }
    });

    console.table(results);
    // page.close();

    // fs.writeFileSync("output.json", JSON.stringify(results));

};

main();

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
