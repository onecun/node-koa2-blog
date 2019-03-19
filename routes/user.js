const bcrypt = require('bcryptjs')
const UserModel = require('../models/user')

module.exports = {
    async signup(ctx, next) {
        // get 请求时返回 模板页面
        if(ctx.method === 'GET') {
            await ctx.render('signup', {
                title: '用户注册'
            })
            return
        }

        // post 请求时，处理数据到数据库
        // 生成 slat
        const salt = await bcrypt.genSalt(10)
        console.log('yoooo', ctx.request.body)
        let { username, email, password } = ctx.request.body
        // 对密码加密
        password = await bcrypt.hash(password, salt)
        const user = {
            "username": username,
            "email": email,
            "password": password,
        }
        // 储存到数据库
        const result = await UserModel.create(user)
        ctx.body = result
    }
}