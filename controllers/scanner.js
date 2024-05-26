const puppeteer = require('puppeteer');
const { Bonbast, Dirham } = require('../models')
require("dotenv").config();
// ! start scanning the crypto scanner
const scanner = async () => {
    //* get last price of Bonbast table
    const pervBonbast = await Bonbast.findAll({
        limit: 1,
        order: [['id', 'DESC']],
        attributes: ['aed']
    })
    const prevAed = pervBonbast[0]?.aed

    //* get last price of Dirham table
    const pervDirham = await Dirham.findAll({
        limit: 1,
        order: [['id', 'DESC']],
        attributes: ['sell', 'buy']
    })
    const prevSell = pervDirham ? pervDirham[0].sell : null;
    const prevBuy = pervDirham ? pervDirham[0].buy : null;

    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('sell:', prevSell)
    console.log('buy:', prevBuy)
    console.log('aed:', prevAed)

    const browser = await puppeteer.launch({
        headless:true,
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath:
            process.env.PUPPETEER_EXECUTABLE_PATH,
    });

    try {
        const page = await browser.newPage();
        await page.goto('https://www.bonbast.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

        const data = await page.evaluate(async () => {
            const sellElement = document.querySelector('#aed1');
            const buyElement = document.querySelector('#aed2');

            if (!sellElement || !buyElement) {
                throw new Error('Sell or Buy elements not found');
            }
            await new Promise(resolve => setTimeout(resolve, 500));

            const sell = parseInt(sellElement.textContent);
            const buy = parseInt(buyElement.textContent);

            //* Select 'AED' from the dropdown
            document.querySelector('#toSelect').value = 'AED';
            document.querySelector('#toSelect').dispatchEvent(new Event('change'));

            //* Wait for the value in #tamount to update after selection
            await new Promise(resolve => setTimeout(resolve, 2500));

            const aedToUsdElement = document.querySelector('#tamount');

            if (!aedToUsdElement) {
                throw new Error('AED to USD element not found');
            }

            const aedToUsd = parseFloat(aedToUsdElement.value);

            return { sell, buy, aedToUsd, rial: parseInt(sell * aedToUsd) };
        })
console.log(data)
 
        if (data.aedToUsd != prevAed) {
            await Bonbast.create({
                aed: data.aedToUsd,
                rial: data.rial
            })
        }

        if (data.sell != prevSell || data.buy != prevBuy) {
            if (data.sell != null && data.buy != null) {
                await Dirham.create({
                    sell: data.sell,
                    buy: data.buy
                });
            } else {
                throw new Error('Sell or Buy value is null');
            }
        }

        //* If it's not a cron job, send response

        return 'ok';

    } catch (error) {
        console.log(error)
    } finally {
        await browser.close();
    }
}



// ! GET SCANNER BY LIMIT
const getScanner = async (req, res) => {
    try {
        const { limit } = req.params;
        const data = await Bonbast.findAll({
            limit: +limit,
            order: [['createdAt', 'DESC']]
        });
        return res.json({ data })
    } catch (error) {
        console.log(error)
    }
}

module.exports = { scanner, getScanner }