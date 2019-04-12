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
                await ctx.render('posts/create', {
                    title: '新建文章',
                })
            } else {
                ctx.redirect('sign/signin')
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
        console.log('show', post.title)
        await ctx.render('posts/post', {
            title: post.title,
            post,
        })
    },

    async edit (ctx, next) {
        if (ctx.method === 'GET') {
            const post = await PostModel.findById(ctx.params.id)
            if (!post) {
                ctx.body = '文章不存在'
            } else if (post.author.toString() !== ctx.session.user._id.toString()) {
                console.log(post.title, post.author, ctx.session.user._id)
                ctx.body = '没有权限'
            } else {
                await ctx.render('posts/edit', {
                    title: '更新文章',
                    post,
                })
            }
            return
        }

        const {title, content} = ctx.request.body
        await PostModel.findByIdAndUpdate(ctx.params.id, {
            title,
            content,
        })
        ctx.flash = {success: '更新文章成功'}
        console.log(ctx.params.id)
        ctx.redirect(`/posts/${ctx.params.id}`)
    },
}