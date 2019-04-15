// models/category.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    // 用来在 url 中显示
    name: {
        type: String,
        required: true
    },
    // '前端'， '后端'
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        }
    }
})

module.exports = mongoose.model('Category', CategorySchema)