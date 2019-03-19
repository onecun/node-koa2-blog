const Koa = require('koa')
const path = require('path')
const router = require('./routes')
const views = require('koa-views')
const mongoose = require('mongoose')
const CONFIG = require('./config/config')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')

mongoose.connect(CONFIG.mongodb)

const app = new Koa()

app.use(require('koa-static')('./public'));

app.use(views(path.join(__dirname, 'views'), {
    map: {html: 'nunjucks'}
}))

app.keys = ['somethings']
app.use(session({
  key: CONFIG.session.key,
  maxAge: CONFIG.session.maxAge
}, app))

app.use(bodyParser())


router(app)

app.listen(4567, () => {
    console.log('run server http://localhost:4567')
})
