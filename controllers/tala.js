const puppeteer = require('puppeteer');
const { Gold } = require('../models');
require("dotenv").config();
// ! start scanning the crypto gold
const gold = async (req, res) => {
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath:
          process.env.PUPPETEER_EXECUTABLE_PATH
               
    });
    try {
        const page = await browser.newPage();
        await page.goto('https://www.tala.ir/', { waitUntil: 'domcontentloaded',timeout:60000 });

        const data = await page.evaluate(async () => {
            const ounce = document.querySelector('.gold_ounce .value').textContent

            const price = document.querySelector('.gold_bazaruser .value').textContent

            const gold = document.querySelector('.gold_18k .value').textContent

            return { ounce, price, gold };
        })


        const convertedData = {
            ounce: parseFloat(persianToEnglishDigits(data.ounce)),
            price: parseFloat(persianToEnglishDigits(data.price)),
            gold: parseFloat(persianToEnglishDigits(data.gold))
        };

        //* insert into db
        const gold = await Gold.create(convertedData)


        //* If it's not a cron job, send response

        return res.json(gold);


    } catch (error) {
        console.log(error)
    } finally {
        await browser.close();
    }

}

function persianToEnglishDigits(str) {
    const stringWithoutCommas = str.replace(/,/g, '');
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return stringWithoutCommas.replace(/[۰-۹]/g, function (d) {
        return persianDigits.indexOf(d).toString();
    });
}


module.exports = { gold }