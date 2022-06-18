const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cryptoJS = require('crypto-js');
require('dotenv').config();

/**
 * encrypts the user's email 
 */

function encryptMail(content) {
    const encrypted = cryptoJS.AES.encrypt(
        content,
        cryptoJS.enc.Utf8.parse(process.env.EMAIL_KEY), {
            iv: cryptoJS.enc.Utf8.parse(process.env.IV),
            mode: cryptoJS.mode.ECB,
            padding: cryptoJS.pad.Pkcs7
        });
    return encrypted.toString();
};
/**
 * decrypts user's email 
 */
function decryptMail(encryptedContent) {
    const decrypted = cryptoJS.AES.decrypt(
        encryptedContent,
        cryptoJS.enc.Utf8.parse(process.env.EMAIL_KEY), {
            iv: cryptoJS.enc.Utf8.parse(process.env.IV),
            mode: cryptoJS.mode.ECB,
            padding: cryptoJS.pad.Pkcs7
        });
    return decrypted.toString(cryptoJS.enc.Utf8);
};


/**
 * Register a new user. 
 * the password is securised with hash (bcrypt module) and
 * the email is encrypted
 */
exports.signup = (req, res, next) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                userName: req.body.userName,
                email: encryptMail(req.body.email),
                password: hash,
                isAdmin: req.body.isAdmin
            });
            user
                .save()
                .then((user) => res.status(201).json(
                    user
                ))
                .catch((error) => res.status(400).json({
                    error
                }));
        })
        .catch((error) => res.status(500).json({
            error
        }));
};

/**
 * logs the user who's already registered. 
 * This method encrypts the email given in the request and controls if it is present 
 * in the Users collection, then checks if the password given matches the one assigned 
 * to the user in database. If correct, returns userId and a token.
 */
exports.login = (req, res, next) => {
    const emailEncrypted = encryptMail(req.body.email);
    User.findOne({
            email: emailEncrypted
        })
        .then((user) => {
            if (!user) {
                console.log(emailEncrypted)
                return res.status(401).json({
                    error: "User not found"
                });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: "Incorrect password"
                        });
                    };
                    res.cookie( 
                        'jwt', 
                        jwt.sign({ // creating a token for the new session; 
                            userId: user._id // the method takes two arguments : 
                        }, // a response object and
                        process.env.TOKEN_SECRET, { // a secret key
                            expiresIn: '24h'
                        }), {
                            httpOnly: true, 
                        maxAge
                        });
                    res.status(200).json({
                        userId: user._id,
                        User: user
                    });
                })
                .catch((error) => res.status(500).json({
                    error
                }));
        })
        .catch((error) => res.status(500).json({
            error
        }));
};
/**
 * logs out the user. His session is over and the token is invalidated.
 */
exports.logout = (req, res, next) => {

};
/**
 * reads the data for all users; accessible only for isAdmin.
 */
exports.readAllUsers = (req, res, next) => {
    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    error: new Error("User not found!")
                });
            } else if (!user.isAdmin) {
                res.status(403).json({
                    error: new Error("You're not authorized to access this data!")
                })
            } else {
                User.find()
                    .then((users) => {
                        users = users.map((user) => {
                            user.email = decryptMail(user.email); // decrypts user's email  
                            user.imageUrl = `${req.protocol}://${req.get("host")}${
            user.imageUrl
            }`;
                            return {
                                ...user._doc
                            };
                        });
                        res.status(200).json(users);
                    })
                    .catch((error) => res.status(400).json({
                        error
                    }));
            }
        })
        .catch((error) => res.status(404).json({
            error
        }));

}

/**
 * displays user's data. The email is decrypted before displaying. 
 * If the user's id does not match the one assigned to the user in Users Colection, 
 * the request is not authorized.
 */
exports.readUser = (req, res, next) => {
    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    error: new Error("User not found!")
                });
            } else {
                user.email = decryptMail(user.email); // decrypts user's email
                res.status(200).json(user);
            }
        })
        .catch((error) => res.status(404).json({
            error
        }));
}

/**
 * Exports the user's data. The email is decrypted before displaying. 
 * Returns the data as a text file attached to the response. 
 */
exports.exportData = (req, res, next) => {
    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    error: new Error("User not found!")
                });
            } else {
                user.email = decryptMail(user.email); // decrypts user's email
                const text = user.toString(); // returns the user object to string format
                res.attachment("user-data.txt");
                res.type("txt");
                return res.status(200).send(text);
            }
        })
        .catch((error) => res.status(404).json({
            error
        }));
}

/**
 * Updates the user data for an id given.
 * If userId from the request does not match the one stored in database, the request
 * is not authorized.
 */
exports.updateUser = (req, res, next) => {
    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    error: new Error("User not found!")
                });
            } else {
                User.findByIdAndUpdate({
                        _id: req.auth.userId
                    }, {
                        ...req.body,
                        email: encryptMail(req.body.email)
                    }, {
                        new: true,
                        upsert: true,
                        setDefaultsOnInsert: true
                    })
                    .then((userUpdated) => res.status(200).json(
                        userUpdated
                    ))
                    .catch((error) => {
                        res.status(400).json({
                            error: error
                        });
                    });
            }
        })
        .catch((error) => res.status(404).json({
            error
        }));
}

/**
 * deletes the user data for an id given.
 * If userId from the request does not match the one stored in database, the request
 * is not authorized.
 */
exports.deleteUser = (req, res, next) => {
    User.findById(req.auth.userId)
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    error: new Error("User not found!")
                });
            } else {
                User.deleteOne({
                        _id: req.auth.userId
                    })
                    .then(() => {
                        res.status(204).json({})
                    })
                    .catch((error) => {
                        res.status(400).json({
                            error: error
                        });
                    });
            }
        })
        .catch((error) => res.status(404).json({
            error
        }));
}

exports.follow = (req, res, next) => {}

exports.unfollow = (req, res, next) => {}

/**
 * Reports a user for an id given. 
 * The id of the user who reports is added to the usersWhoReported array 
 * and the value of reports is increased by 1. No change if the id of the user who reports
 * is already present in the usersWhoReported array.
 */
exports.reportUser = (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user.usersWhoReported.includes(req.auth.userId)) {
                User.findByIdAndUpdate({
                        _id: req.params.id
                    }, {
                        $inc: {
                            reports: 1
                        },
                        $push: {
                            usersWhoReported: req.auth.userId
                        }
                    }, {
                        new: true
                    })
                    .then((userUpdated) => res.status(200).json(
                        userUpdated
                    ))
                    .catch((error) => res.status(400).json({
                        error
                    }))
            } else {
                res
                    .status(200)
                    .json({
                        message: "User already reported"
                    });
            }
        })
        .catch()
}