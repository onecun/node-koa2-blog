// 消息闪现
module.exports = function(opt) {
    let key = 'flash'
    return async function(ctx, next) {
        if (ctx.session === undefined) {
            throw new Error('ctx.flash requires session')
        }
        // 消息闪现一次就删除
        let data = ctx.session[key]
        ctx.session[key] = null
        Object.defineProperty(ctx, 'flash', {
            enumerable: true, //  true 可枚举
            configurable: true, // true 可删除
            get: () => data,
            set: (val) => {
                ctx.session[key] = val
            },
        })
        await next()
    }
}