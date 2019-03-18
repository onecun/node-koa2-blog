const Koa = require('koa')
const path = require('path')
const router = require('./routes')
const views = require('koa-views')
const mongoose = require('mongoose')
const CONFIG = require('./config/config')

mongoose.connect(CONFIG.mongodb)

const app = new Koa()

app.use(views(path.join(__dirname, 'views'), {
    map: {html: 'nunjucks'}
}))

router(app)

app.listen(4567, () => {
    console.log('run server http://localhost:4567')
})
