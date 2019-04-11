const router =  require('koa-router')()

module.exports = (app) => {
    // 主页
    router.get('/', require('./home').index)
    // 注册页
    router.get('/signup', require('./user').signup)
    router.post('/signup', require('./user').signup)
    // 登录页
    router.get('/signin', require('./user').signin)
    router.post('/signin', require('./user').signin)
    // 登出
    router.get('/signout', require('./user').signout)
    // 文章
    // router.get('/posts', require('./posts').index)
    router.get('/posts/new', require('./posts').create)
    router.post('/posts/new', require('./posts').create)
    router.get('/posts/:id', require('./posts').show)
    // router.get('/posts/:id/edit', require('./posts').edit)
    // router.post('/posts/:id/edit', require('./posts').edit)
    // router.get('/posts/:id/delete', require('./posts').destroy)

    // 添加路由中间件
    app.use(router.routes())
    // 处理 路由错误信息
    app.use(router.allowedMethods())
}