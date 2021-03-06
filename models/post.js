const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // 关联 User 集合
        required: true,
    },
    // 关联分类
    category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    PV: {
        type: Number,
        default: 0,
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        updatedAt: {
            type: Date,
            default: Date.now(),
        },
    },
})


PostSchema.pre('save', function(next) { //此处不能用 箭头函数, this
    if (this.isNew) {
        this.meta.createdAt = Date.now()
        this.meta.updatedAt = this.meta.createdAt
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})

module.exports = mongoose.model('Post', PostSchema)