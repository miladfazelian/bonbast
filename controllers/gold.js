const puppeteer = require('puppeteer');
const { Gold, Ounce, Mazaneh } = require('../models');
require("dotenv").config();

// Start scanning the crypto gold
const gold = async (req, res) => {
    // Get last price of Ounce table
    const prevOunceData = await Ounce.findOne({
        order: [['id', 'DESC']],
        attributes: ['price']
    });
    const prevOunce = prevOunceData ? prevOunceData.price : null;

    // Get last price of Gold table
    const prevGoldData = await Gold.findOne({
        order: [['id', 'DESC']],
        attributes: ['price']
    });
    const prevGold = prevGoldData ? prevGoldData.price : null;

    // Get last price of Mazaneh table
    const prevMazanehData = await Mazaneh.findOne({
        order: [['id', 'DESC']],
        attributes: ['price']
    });
    const prevMazaneh = prevMazanehData ? prevMazanehData.price : null;

    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('ounce: ', prevOunce);
    console.log('gold: ', prevGold);
    console.log('mazaneh: ', prevMazaneh);

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    });
    try {
        const page = await browser.newPage();
        await page.goto('https://www.bonbast.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

        const data = await page.evaluate(() => {
            const ounceElement = document.querySelector('#ounce_top');
            const goldElement = document.querySelector('#gol18_top');
            const priceElement = document.querySelector('#mithqal_top');

            return {
                ounce: ounceElement ? ounceElement.textContent.trim() : null,
                gold: goldElement ? goldElement.textContent.trim() : null,
                price: priceElement ? priceElement.textContent.trim() : null
            };
        });

        // Convert Persian digits to English digits and parse float
        const convertedData = {
            ounce: parseFloat(persianToEnglishDigits(data.ounce)),
            price: parseFloat(persianToEnglishDigits(data.price)),
            gold: parseFloat(persianToEnglishDigits(data.gold))
        };

        console.log('Converted data:', convertedData);

        // Save data to the database if it has changed
        if (convertedData.ounce && convertedData.ounce != prevOunce) {
            await Ounce.create({ price: convertedData.ounce });
        }

        if (convertedData.gold && convertedData.gold != prevGold) {
            await Gold.create({ price: convertedData.gold });
        }

        if (convertedData.price && convertedData.price != prevMazaneh) {
            await Mazaneh.create({ price: convertedData.price });
        }

        // If it's not a cron job, send response
       return 'ok'

    } catch (error) {
        console.log(error);
        
    } finally {
        await browser.close();
    }
};

// GET GOLD BY LIMIT
const getGold = async (req, res) => {
    try {
        const { limit } = req.params;
        const data = await Gold.findAll({
            limit: +limit,
            order: [['createdAt', 'DESC']]
        });
        return res.json({ data });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

function persianToEnglishDigits(str) {
    if (!str) return '';
    const stringWithoutCommas = str.replace(/,/g, '');
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return stringWithoutCommas.replace(/[۰-۹]/g, function (d) {
        const index = persianDigits.indexOf(d);
        return index !== -1 ? index.toString() : d;
    });
}

module.exports = { gold, getGold };
