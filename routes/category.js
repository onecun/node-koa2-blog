const CategoryModel = require('../models/category')

module.exports = {
    async list(ctx, next) {
        const categories = await CategoryModel.find({})
        await ctx.render('category/category', {
            title: '分类管理',
            categories
        })
    },

    async create(ctx, next) {
        if (ctx.method === 'GET') {
            await ctx.render('category/create-category', {
                title: '新建分类'
            })
            return
        }
        await CategoryModel.create(ctx.request.body)
        ctx.redirect('/category')
    },

    async delete(ctx, next) {
        await CategoryModel.findByIdAndRemove(ctx.params.id)
        ctx.flash = {
            success: '删除分类成功'
        }
        ctx.redirect('/category')
    },
}