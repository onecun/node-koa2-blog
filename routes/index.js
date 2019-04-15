const router =  require('koa-router')()

// 判断是否登录的中间件
const isLoginUser = async (ctx, next) => {
    if (!ctx.session.user) {
        ctx.flash = {warning: '请先登录'}
        return ctx.redirect('/signin')
    }
    await next()
}

const isAdmin = async (ctx, next) => {
    if (!ctx.session.user) {
        ctx.flash = {warning: '请先登录'}
        return ctx.redirect('/signin')
    } else if (!ctx.session.user.isAdmin) {
        ctx.flash = {warning: '没有权限'}
        return ctx.redirect('back')
    }
    await next()
}

module.exports = (app) => {
    // 主页
    router.get('/', require('./posts').index)
    // 注册页
    router.get('/signup', require('./user').signup)
    router.post('/signup', require('./user').signup)
    // 登录页
    router.get('/signin', require('./user').signin)
    router.post('/signin', require('./user').signin)
    // 登出
    router.get('/signout', require('./user').signout)
    // 文章
    router.get('/posts', require('./posts').index)
    router.get('/posts/new', isLoginUser, require('./posts').create)
    router.post('/posts/new', isLoginUser, require('./posts').create)
    router.get('/posts/:id', require('./posts').show)
    router.get('/posts/:id/edit', isLoginUser, require('./posts').edit)
    router.post('/posts/:id/edit', isLoginUser, require('./posts').edit)
    router.get('/posts/:id/delete', require('./posts').delete)
    // 评论
    router.post('/comments/new', isLoginUser, require('./comments').create)
    router.get('/comments/:id/delete', isLoginUser, require('./comments').delete)
    // 分类
    router.get('/category', require('./category').list)
    router.get('/category/new', require('./category').create)
    router.post('/category/new', require('./category').create)
    router.get('/category/:id/delete', require('./category').delete)


    // 添加路由中间件
    app.use(router.routes())
    // 处理 路由错误信息
    app.use(router.allowedMethods())
}