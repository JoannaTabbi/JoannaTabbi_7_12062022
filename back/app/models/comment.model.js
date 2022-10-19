const mongoose = require('mongoose');
const Post = require("./post.model");
const User = require("./user.model");

//create the schema for the post

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    message: {
        type: String,
        trim: true,
        maxlength: 500
    },
    likes: {
        type: Number
    },
    usersLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    reports: {
        type: Number,
        default: 0
    },
    usersWhoReported: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("Comment", commentSchema);
