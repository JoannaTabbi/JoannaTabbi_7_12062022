const mongoose = require('mongoose');

//create the schema for the post

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
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
    comments: [{
        type: String,
        ref: "Comment"
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
