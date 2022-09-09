const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/**
 * setting the schema for a user
 */
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    aboutMe: {
        type: String,
        maxlength: 1024  
    },
    imageUrl: {
        type: String,
        default: "/images/avatar-200.png"
    },
    followers: [{
        type: String,
        default: 0,
        ref: "User" 
    }],
    following: [{
        type: String,
        default: 0,
        ref: "User"
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