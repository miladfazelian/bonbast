const express = require('express')
const { scanner, getScanner } = require('../controllers/scanner')
const { gold, getGold } = require('../controllers/gold')
const cron = require('node-cron');
const { getUSD } = require('../controllers/usd_telegram');
const { getAED } = require('../controllers/aed_telegram');

const router = express.Router()

// ! cron job
cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
    scanner()
    gold()
    getAED()
    getUSD()
});


// ! first page
router.get('/', (req, res) => {
    return res.json("ما گرگ های توبه کرده ایم، جنگل بماند برای بچه خرگوش ها")
})

// ! get scanner
router.get('/scanner/:limit', getScanner)

// ! get gold
router.get('/gold/:limit', getGold)

// ! get UAE from telegram
//router.get('/telegram/aed',getAED)

// ! get USD from telegram 

// router.get('/telegram/usd',getUSD)



module.exports = router 