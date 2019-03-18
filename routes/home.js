module.exports = {
    async index(ctx, next) {
        await ctx.render('index', {
            title: 'node-blog',
            desc: 'yo.'
        })
    }
}