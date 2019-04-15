const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const mongoose = require('mongoose')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const marked = require('marked')

const CONFIG = require('./config/config')
const router = require('./routes')
const flash = require('./middlewares/flash')

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

// 使用默认配置连接数据库
mongoose.connect(CONFIG.mongodb)

const app = new Koa()

// 配置 静态文件地址
app.use(static(path.resolve(__dirname, "./public")))

// 设置 模板
app.use(views(path.join(__dirname, 'views'), {
    map: {html: 'nunjucks'}
}))

// 为了在 view 中使用 ctx
app.use(async (ctx, next) => {
  ctx.state.ctx = ctx
  ctx.state.marked = marked
  await next()
})

// 设置 session
app.keys = ['somethings']
app.use(session({
  key: CONFIG.session.key,
  maxAge: CONFIG.session.maxAge
}, app))


// 解析 post数据到 ctx.request.body
app.use(bodyParser())

// 消息闪回
app.use(flash())

// 配置路由
router(app)

app.listen(4567, () => {
    console.log('run server http://localhost:4567')
})
