const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    content: {
        type: String,
        required: true,
    },
    commentator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'true',
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
})

module.exports = mongoose.model('Comment', CommentSchema)