const express = require('express')
const db = require('./models')
const api  = require('./routes/api')
require("dotenv").config();

const app = express()

// ! middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// ! routes
app.use('/', api)



db.sequelize.sync().then(req => {
    app.listen(process.env.PORT, () => {
        console.log(`http://localhost:3000`)
    })
})
