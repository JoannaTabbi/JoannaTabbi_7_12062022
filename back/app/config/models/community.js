const mongoose = require('mongoose');

//create the schema for the community

const communitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true 
    },
    creatorId: {
        type: String,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    iconUrl: {
        type: String
    },
    subscriptions: {
        type: Number
    },
    subscribers: [{
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

module.exports = mongoose.model("Community", communitySchema);