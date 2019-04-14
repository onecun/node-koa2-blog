const CommentModel = require('../models/comment')

module.exports = {
    async create (ctx, next) {
        const comment = Object.assign(ctx.request.body, {
            commentator: ctx.session.user._id,
        })
        await CommentModel.create(comment)
        ctx.flash = {success: '评论成功'}
        ctx.redirect('back')
    },

      async delete (ctx, next) {
        const comment = await CommentModel.findById(ctx.params.id)
        if (!comment) {
            ctx.body = '留言不存在'
        } else if (comment.commentator.toString() !== ctx.session.user._id.toString()) {
            ctx.body = '没有权限'
        } else {
            await CommentModel.findByIdAndRemove(ctx.params.id)
            ctx.flash = { success: '成功删除留言' }
            ctx.redirect('back')
        }
    }
}