const router =  require('koa-router')()

    
module.exports = (app) => {
    router.get('/', require('./home').index)
    router.get('/signup', require('./user').signup)

    app.use(router.routes())
    app.use(router.allowedMethods())
}