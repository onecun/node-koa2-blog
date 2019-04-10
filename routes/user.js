const bcrypt = require('bcryptjs')
const UserModel = require('../models/user')

module.exports = {
    async signup(ctx, next) {
        // get 请求时返回 模板页面
        if(ctx.method === 'GET') {
            await ctx.render('signup', {
                title: '用户注册',
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
        // 每次重新开关服务器或者数据库，需要删除原有的集合，否则会报错
        // 储存到数据库
        const result = await UserModel.create(user)
        // 去登录
        ctx.redirect('/signin')
    },

    async signin(ctx, next) {
        // get 请求时返回 模板页面
        if (ctx.method === 'GET') {
            await ctx.render('signin', {
                title: '用户登录',
            })
            return
        }

        // post 请求比对是否有无该用户
        const {username, password} = ctx.request.body
        const user = await UserModel.findOne({"username": username})
        if (user && await bcrypt.compare(password, user.password)) {
        // 跳转到首页
        ctx.session.user = {
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
            email: user.email
        }
        // // flash 闪现消息
        // ctx.flash = {success: '登录成功'}
        ctx.redirect('/')
        } else {
        ctx.body = '用户名或密码错误'
        }
    },

    async signout(ctx, next) {
        // // flash 闪现消息
        // ctx.flash = {warning: '退出登录'}
        // 清除 session 跳转首页
        ctx.session = null
        ctx.redirect('/')
    }
}