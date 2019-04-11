const PostModel = require('../models/post')

module.exports = {
    async create (ctx, next) {
        if (ctx.method === 'GET') {
            if (ctx.session.user) {
                await ctx.render('create', {
                    title: '新建文章',
                })
            } else {
                ctx.redirect('/signin')
            }
            return 
        }

        const post = Object.assign(ctx.request.body, {
            author: ctx.session.user._id,
        })
        const res = await PostModel.create(post)
        ctx.flash = { success: '发表文章成功' }
        ctx.redirect(`/posts/${res._id}`)
    }
}