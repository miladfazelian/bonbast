const puppeteer = require("puppeteer");
const {extractValues} = require("../function.js");
const {Usd} = require("../models");
const { response } = require("express");

const getUSD = async () => {
    const pervData = await Usd.findAll({
        limit:1,
        order: [['id','DESC']],
        attributes: ['telegramTime']
    }) 

    prevTime = pervData[0]?.telegramTime


    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        timeout: 60000
    });

    try {
        const page = await browser.newPage();
        await page.goto('https://t.me/s/dolaretehran20', { waitUntil: 'domcontentloaded',timeout:60000 });

        // Scroll to the bottom of the page
        await autoScroll(page);

        const fetchData = await page.evaluate((prevTime) => {
            const messageWraps = Array.from(document.querySelectorAll('.tgme_widget_message_wrap.js-widget_message_wrap')).reverse();
            const filteredPosts = [];

            for (let messageWrap of messageWraps) {
                // Extract post time
                const postTimeTelegram = messageWrap.querySelector('time')?.getAttribute('datetime') || 'N/A';

                // If the post time matches the previous data timestamp, break out of the loop
                if (postTimeTelegram === prevTime) break;

                // Extract post text
                const postText = messageWrap.querySelector('.tgme_widget_message_text.js-message_text')?.innerText || 'N/A';

                // Only return posts containing "دلار لحظه ای تهران"
                if (postText.includes("دلار لحظه ای تهران")) {
                    const postTime = messageWrap.querySelector('time')?.textContent || 'N/A';
                    filteredPosts.push({
                        postTimeTelegram,
                        postTime,
                        postText,
                    });
                }
            }

            return filteredPosts; // Return in the order they were found (bottom to top)
        }, prevTime);

        for (const item of fetchData.reverse()) {
            const { price, type, action } = extractValues(item.postText);
            const body = {
                telegramTime: item.postTimeTelegram,
                postTime: item.postTime,
                price,
                type,
                action
            };

            await Usd.create(body);
        }

        await browser.close();
        return 'ok'
    } catch (error) {
        await browser.close();
        console.log(error);
    }
};

// Function to auto scroll to the bottom of the page
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

module.exports = { getUSD };
