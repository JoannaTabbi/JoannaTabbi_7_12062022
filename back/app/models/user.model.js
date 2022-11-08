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
        maxlength: 1024,
        default: "Je suis..." 
    },
    imageUrl: {
        type: String
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        default: 0,
        ref: "User" 
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        default: 0,
        ref: "User"
    }],
    reports: {
        type: Number,
        default: 0
    },
    usersWhoReported: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    refreshToken: [String]
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