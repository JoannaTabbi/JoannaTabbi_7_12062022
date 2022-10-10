const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cryptoJS = require('crypto-js');
require('dotenv').config();
const fs = require('fs');
const validator = require('validator');

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
    // validates the email format
    const emailValidated = validator.isEmail(req.body.email);
    if (!emailValidated) {
        return res.status(400).json({
            error: "Invalid email format"
        });
    }
    //encrypts password
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                userName: req.body.userName,
                email: encryptMail(req.body.email),
                password: hash,
                isAdmin: req.body.isAdmin // see front
            });
            user
                .save()
                .then((user) => res.status(201).json(
                    user
                ))
                .catch((error) => res.status(400).json(error));
        })
        .catch((error) => res.status(500).json(error));
};

/**
 * logs the user who's already registered. 
 */
exports.login = (req, res, next) => {
    
    const cookies = res.cookies;

    //encrypts the email given in the request and controls if it is present 
    //in the Users collection
    const emailEncrypted = encryptMail(req.body.email);
    User.findOne({
            email: emailEncrypted
        })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    error: "User not found"
                });
            };
            user.imageUrl = `${req.protocol}://${req.get("host")}${user.imageUrl}`;
            user.email = decryptMail(user.email);
            //checks if the password given matches the one assigned 
            //to the user in database. If correct, returns userId and a token.
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: "Incorrect password"
                        });
                    };
                    // creating a refresh token stored in cookie, that will allow us to regenerate the token once expired; 
                    const newRefreshToken = jwt.sign({
                            userId: user._id // the method takes two arguments : 
                        }, // a response object and
                        process.env.REFRESH_TOKEN_SECRET, { // a secret key
                            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
                        }
                    )
                    User.findByIdAndUpdate(
                        user._id, {
                            $push: {
                                refreshToken: newRefreshToken
                            }
                        }, {
                            new: true,
                            upsert: true,
                            setDefaultsOnInsert: true
                        }
                    )
                    .then(() => {
                        if (cookies?.jwt) {
                            res.clearCookie('jwt', { //removes the potential expired refresh token
                            httpOnly: true
                        })}; 
                        res.cookie('jwt', newRefreshToken, {
                            httpOnly: true,
                            maxAge: 1000 * 60 * 60 * 8760
                        });
                        res.status(200).json({
                                userId: user._id,
                                // creating a token for a new session
                                token: jwt.sign({
                                        userId: user._id // the method takes two arguments : 
                                    }, // a response object and
                                    process.env.TOKEN_SECRET, { // a secret key
                                        expiresIn: process.env.TOKEN_EXPIRATION 
                                    }
                                ),
                                newRefreshToken,
                                User: user
                            },
                            hateoasLinks(req, user._id));  
                    })
                      
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
 * Logs out the user. His refresh token is invalidated and withdrown from the database.
 * The user is redirected to the home page.
 * !!! the client should also delete the access token !!!
 */
exports.logout = (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    User.findOne({refreshToken: cookies.jwt})
        .then((userFound) => {
            //delete refresh token from datatbase
            
            User.findByIdAndUpdate(
                userFound._id, {
                    $pull: {
                        refreshToken: cookies.jwt
                    }
                }, {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                })
                .then(() => {
                    res.clearCookie('jwt', { //removes refresh token
                        httpOnly: true
                    });
                    //res.redirect('/'); // warning: returns error!
                    res.status(200).json({
                        message: "user logged out successfully"
                    }); 
                })
                .catch((error) => res.status(400).json(error))
            
            
        })
        .catch((error) => {
            res.clearCookie('jwt', { //removes refresh token
                httpOnly: true
            });
            res.status(404).json(error)});
}

/**
 * displays other user's non sensible data : unserName, aboutMe, avatar... 
 */
exports.readUser = (req, res, next) => {
    User.findById(req.params.id)
        .populate(['following', 'followers'])
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    error: "User not found!"
                });
            } else {
                const userFound = {
                    _id: user._id,
                    userName: user.userName,
                    aboutMe: user.aboutMe,
                    imageUrl: `${req.protocol}://${req.get("host")}${user.imageUrl}`,
                    followers: user.followers,
                    following: user.following,
                    createdAt: user.createdAt
                }

                res.status(200).json(userFound,
                    hateoasLinks(req, userFound._id));
            }
        })
        .catch((error) => res.status(404).json(error));
}


/**
 * displays user's data. The email is decrypted before displaying. 
 * If the user's id does not match the one assigned to the user in Users Colection, 
 * the request is not authorized.
 */
exports.readOneself = (req, res, next) => {
    User.findById(req.auth.userId)
        .populate(['following', 'followers'])
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    error: "User not found!"
                });
            } else {
                user.email = decryptMail(user.email); // decrypts user's email
                user.imageUrl = `${req.protocol}://${req.get("host")}${user.imageUrl}`;
                res.status(200).json(user,
                    hateoasLinks(req, user._id));
            }
        })
        .catch((error) => res.status(404).json(error));
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
                    error: "User not found!"
                });
            } else {
                console.log(user);
                const userToExport = {
                    userName: user.userName,
                    email: decryptMail(user.email),
                    aboutMe: user.aboutMe
                }
                //user.email = decryptMail(user.email); // decrypts user's email
                const text = userToExport.toString(); // returns the user object to string format
                res.attachment("user-data.txt");
                res.type("txt");
                res.status(200).send(userToExport);
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
        .then(async (user) => {
            if (!user) {
                res.status(404).json(error);
            } else {
                const update = req.file ?
                    req.body.user : req.body;
                // the password is updated
                if (update.password) {
                    const hash = await bcrypt.hash(update.password, 10); // the password is crypted
                    update.password = hash;
                };
                // the email is updated
                if (update.email) {
                    // validates the email format
                    const emailValidated = validator.isEmail(update.email);
                    if (!emailValidated) {
                        return res.status(400).json({
                            error: "Invalid email format"
                        });
                    } else {
                        update.email = encryptMail(update.email); // the email is crypted
                        console.log(update.email);
                    }
                }
                // check if image file is present
                const userObject = req.file ? 
                 {
                    ...update,
                    imageUrl: `/images/${req.file.filename}`
                } 
                  : {
                    ...update
                };
                const filename = user.imageUrl.split("/images/")[1];
                try {
                    if (userObject.imageUrl && userObject.imageUrl !== "/images/avatar-200.png") {
                        fs.unlinkSync(`images/${filename}`);
                    }
                } catch (error) {
                    console.log(error);
                }
                User.findByIdAndUpdate({
                            _id: req.auth.userId
                        },
                        userObject, {
                            new: true,
                            upsert: true,
                            setDefaultsOnInsert: true
                        })
                    .then((userUpdated) => {
                        userUpdated.imageUrl = `${req.protocol}://${req.get("host")}${user.imageUrl}`;
                        userUpdated.email = decryptMail(userUpdated.email); // decrypts user's email
                        res.status(200).json(
                            userUpdated,
                            hateoasLinks(req, userUpdated._id)
                        )
                    })
                    .catch((error) => {
                        res.status(400).json(error);
                    });
            }
        })
        .catch((error) => res.status(404).json(
            error
        ));
}

/**
 * deletes the user data for an id given.
 * If userId from the request does not match the one stored in database, the request
 * is not authorized.
 */
exports.deleteUser = (req, res, next) => {
    User.findByIdAndDelete(req.auth.userId)
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    error: new Error("User not found!")
                });
            } else {
                console.log(user.imageUrl);
                if (user.imageUrl !== "/images/avatar-200.png") {
                    const filename = user.imageUrl.split("/images/")[1];
                    fs.unlinkSync(`images/${filename}`);
                }

                // if no error, file has been deleted successfully 
                res.sendStatus(204);
            }
        })
        .catch((error) => res.status(404).json({
            error
        }));
}

/**
 * follow a user for an id given in params. 
 */
exports.follow = (req, res, next) => {
    User.findById(req.params.id)
        .then((userToFollow) => {
            if (!userToFollow.followers.includes(req.auth.userId)) {
                User.findByIdAndUpdate(
                        req.params.id, {
                            $push: {
                                followers: req.auth.userId
                            }
                        }, {
                            new: true,
                            upsert: true,
                            setDefaultsOnInsert: true
                        })
                    .then((userFollowed) => {
                        User.findByIdAndUpdate(req.auth.userId, {
                                $push: {
                                    following: req.params.id
                                }
                            }, {
                                new: true,
                                upsert: true,
                                setDefaultsOnInsert: true
                            })
                            .then((userFollowing) => res.status(200).json({
                                userFollowing,
                                userFollowed
                            },
                                hateoasLinks(req, userFollowing._id)))
                            .catch((error) => res.status({
                                error
                            }))
                    })
                    .catch((error) => res.status(400).json({
                        error
                    }))
            } else {
                res
                    .status(200)
                    .json({
                        message: "You already follow this user"
                    });
            }
        })
        .catch((error) => res.status(400).json({
            error
        }))
}

exports.unfollow = (req, res, next) => {
    User.findById(req.params.id)
        .then((userToUnfollow) => {
            if (userToUnfollow.followers.includes(req.auth.userId)) {
                User.findByIdAndUpdate(
                        req.params.id, {
                            $pull: {
                                followers: req.auth.userId
                            }
                        }, {
                            new: true,
                            upsert: true,
                            setDefaultsOnInsert: true
                        })
                    .then((userUnfollowed) => {
                        User.findByIdAndUpdate(req.auth.userId, {
                                $pull: {
                                    following: req.params.id
                                }
                            }, {
                                new: true,
                                upsert: true,
                                setDefaultsOnInsert: true
                            })
                            .then((userUnfollowing) => res.status(200).json({
                                userUnfollowing,
                                userUnfollowed
                            },
                                hateoasLinks(req, userUnfollowing._id)))
                            .catch((error) => res.status(400).json(error))
                    })
                    .catch((error) => res.status(400).json(
                        error
                    ))
            } else {
                res
                    .status(200)
                    .json({
                        message: "You do not follow this user"
                    });
            }
        })
        .catch((error) => res.status(400).json(error))
}

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
                        new: true,
                        upsert: true,
                        setDefaultsOnInsert: true
                    })
                    .then((userUpdated) => res.status(200).json(
                        userUpdated,
                        hateoasLinks(req, req.auth.userId)
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
        .catch((error) => res.status(400).json(error))
}


/**
 * create hateoas links 
 */
const hateoasLinks = (req, id) => {
    const URI = `${req.protocol}://${req.get("host") + "/api/auth/"}`;
    return [{
            rel: "signup",
            title: "Signup",
            href: URI + "signup",
            method: "POST"
        },
        {
            rel: "login",
            title: "Login",
            href: URI + "login",
            method: "POST"
        },
        {
            rel: "read",
            title: "Read",
            href: URI,
            method: "GET"
        },
        {
            rel: "export",
            title: "Export",
            href: URI + "export",
            method: "GET"
        },
        {
            rel: "update",
            title: "Update",
            href: URI,
            method: "PUT"
        },
        {
            rel: "delete",
            title: "Delete",
            href: URI,
            method: "DELETE"
        },
        {
            rel: "report",
            title: "Report",
            href: URI + id + "/report",
            method: "POST"
        }
    ]
}