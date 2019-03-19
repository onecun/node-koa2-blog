const router =  require('koa-router')()

module.exports = (app) => {
    // 主页
    router.get('/', require('./home').index)
    // 登录页
    router.get('/signup', require('./user').signup)
    router.post('/signup', require('./user').signup)

    // 添加路由中间件
    app.use(router.routes())
    // 处理 路由错误信息
    app.use(router.allowedMethods())
}