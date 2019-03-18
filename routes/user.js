const UserModel = require('../models/user')

module.exports = {
    async signup(ctx, next) {
        const user = {
            name: 'whh',
            email: 'whh.@test.com',
            password: '123123',
        }
        const result = await UserModel.create(user)
        ctx.body = result
    }
}