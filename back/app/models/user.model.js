const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/**
 * setting the schema for a user
 */
const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [isEmail],
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    aboutMe: {
        type: String,
        maxlength: 1024  
    },
    iconUrl: {
        type: String,
        default: 'images/defaultIcon.png'
    },
    followers: [{
        type: String,
        default: 0
    }],
    following: [{
        type: String,
        default: 0
    }],
    votes: [{
        type: String,
        default: 0
    }],
    communitySubscriptions: [{
        type: String,
        default: 0,
        ref: "Community"
    }],
    reports: {
        type: Number,
        default: 0
    },
    usersWhoReported: [{
        type: String,
        ref: "User"
    }],
},
{
    timestamps: true
});

/**
 * checks for duplicate database entries and reports them
 * like a validation error
 */
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);