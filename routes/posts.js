const PostModel = require('../models/post')

module.exports = {
    async index (ctx, next1) {
        const posts = await PostModel.find({})
        await ctx.render('index', {
            title: '一寸的床',
            posts,
        })
    },

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
    },

    async show (ctx, next) {
        // 因为之前在 Schema 中，关联了 User 集合，
        // 所以这里直接使用 populate 引用
        const post = await PostModel.findById(ctx.params.id).populate({
            path: 'author',
            select: 'username',
        })
        await ctx.render('post', {
            title: post.title,
            post,
        })
    }
}