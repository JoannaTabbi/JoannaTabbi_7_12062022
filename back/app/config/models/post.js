const mongoose = require('mongoose');

//create the schema for the post

const postSchema = new mongoose.Schema({
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
    imageUrl: {
        type: String
    },
    videoUrl: {
        type: String
    },
    votes: {
        type: Number
    },
    usersVoted: [{
        type: String,
        ref: "User"
    }],
    comments: {
        type: [{
            commenterId: {
                type: String,
                ref: "User"
            },
            commenterPseudo: {
                type: String,
                ref: "User"
            },
            text: String,
            timestamp: Number
        }],
        required: true
    },
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

module.exports = mongoose.model("Post", postSchema);