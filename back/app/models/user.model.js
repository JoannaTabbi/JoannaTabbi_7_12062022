const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { isEmail } = require('validator');

/**
 * setting the schema for a user
 */
const userSchema = new mongoose.Schema({
    userName: {
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
        //validate: [isEmail],
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
    avatarUrl: {
        type: String,
        default: '/uploads/profile/defaultIcon.png'
    },
    followers: [{
        type: String,
        default: 0
    }],
    following: [{
        type: String,
        default: 0
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