const flash = (opt) => {
    let key = 'flash'
    return async (ctx, next) => {
        console.log('yoooooo')
        if (ctx.session === undefined) {
            throw new Error('ctx.flash requires session')
        }
        // 消息闪现一次就删除
        let data = ctx.session[key]
        ctx.session[key] = null
        console.log(ctx.flash,ctx.session[key], ctx.session, key)
        Object.defineProperty(ctx, 'flash', {
            enumerable: true,
            get: () => data,
            set: (val) => {
                console.log('valll', val, key, ctx.session[key])
                ctx.session[key] = val
                console.log('endddd')
            },
        })
        await next()
    }
}

module.exports = flash