const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const CategoryModel = require('../models/category')


module.exports = {
    async index(ctx, next) {
        const pageSize = 10
        const currentPage = parseInt(ctx.query.page) || 1
        // 分类名
        const cname = ctx.query.c
        let cid
        if (cname) {
            // 查询分类id
            const cateogry = await CategoryModel.findOne({
                name: cname
            })
            cid = cateogry._id
        }
        // 根据是否有分类来控制查询语句
        const query = cid ? { category: cid } : {}
        const allPostsCount = await PostModel.find(query).count()
        const pageCount = Math.ceil(allPostsCount / pageSize)
        const pageStart = currentPage - 2 > 0 ? currentPage - 2 : 1
        const pageEnd = pageStart + 4 >= pageCount ? pageCount : pageStart + 4
        const posts = await PostModel.find(query).skip((currentPage - 1) * pageSize).limit(pageSize)
        // 根据是否有分类来控制分页链接
        const baseUrl = cname ? `${ctx.path}?c=${cname}&page=` : `${ctx.path}?page=`
        await ctx.render('index', {
            title: '一寸的床',
            posts,
            pageSize,
            currentPage,
            allPostsCount,
            pageCount,
            pageStart,
            pageEnd,
            baseUrl
        })
    },

    async create(ctx, next) {
        if (ctx.method === 'GET') {
            if (ctx.session.user) {
                // 新建文章时选择
                const categories = await CategoryModel.find({})
                await ctx.render('posts/create', {
                    title: '新建文章',
                    categories,
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
        ctx.flash = {
            success: '发表文章成功'
        }
        ctx.redirect(`/posts/${res._id}`)
    },

    async show(ctx, next) {
        // 因为之前在 Schema 中，关联了 User 集合，
        // 所以这里直接使用 populate 引用
        const post = await PostModel.findById(ctx.params.id).populate([{
                path: 'author',
                select: 'username'
            },
            {
                path: 'category',
                select: ['title', 'name']
            }
        ])
        // 查找评论
        const comments = await CommentModel.find({
            "postId": ctx.params.id
        }).populate({
            path: 'commentator',
            select: 'username',
        })

        await ctx.render('posts/post', {
            title: post.title,
            post,
            comments,
        })
    },

    async edit(ctx, next) {
        if (ctx.method === 'GET') {
            const post = await PostModel.findById(ctx.params.id)
            if (!post) {
                ctx.body = '文章不存在'
            } else if (post.author.toString() !== ctx.session.user._id.toString()) {
                console.log(post.title, post.author, ctx.session.user._id)
                ctx.body = '没有权限'
            } else {
                // 编辑文章时选择分类
                const categories = await CategoryModel.find({})
                await ctx.render('posts/edit', {
                    title: '更新文章',
                    post,
                    categories,
                })
            }
            return
        }

        const {
            title,
            category,
            content
        } = ctx.request.body
        await PostModel.findByIdAndUpdate(ctx.params.id, {
            title,
            category,
            content,
        })
        ctx.flash = {
            success: '更新文章成功'
        }
        ctx.redirect(`/posts/${ctx.params.id}`)
    },

    async delete(ctx, next) {
        const post = await PostModel.findById(ctx.params.id)
        if (!post) {
            ctx.body = '文章不存在'
        } else if (post.author.toString() !== ctx.session.user._id.toString()) {
            ctx.body = '没有权限'
        } else {
            await PostModel.findByIdAndRemove(ctx.params.id)
            ctx.flash = {
                success: '删除成功'
            }
            ctx.redirect('/')
        }
    },
}