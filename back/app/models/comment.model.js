const mongoose = require('mongoose');
const Post = require("./post.model");
const User = require("./user.model");

//create the schema for the post

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
        required: true
    },
    postId: {
        type: String,
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
        type: String,
        ref: "User"
    }],
    reports: {
        type: Number,
        default: 0
    },
    usersWhoReported: [{
        type: String,
        ref: "User"
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("Comment", commentSchema);
