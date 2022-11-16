const { json } = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require("../models/user.model");

/****** handle refreshToken ******/

module.exports = async (req, res) => {
    
    const cookies = req.cookies;
    // if no cookie with refresh token, return unauthorized
    if (!cookies?.jwt) return res.sendStatus(401);
    
    const refreshToken = cookies.jwt;
    
    const userFound = await User.findOne({refreshToken}).exec();

    /****** handle if currently no such refreshToken in the database ******/

    if(!userFound) {
        //verify if such refresh token was emitted
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                //no refresh token emitted
                if (err) {
                    return res.sendStatus(403); }
                // it was emitted and therefore is used illegally;
                // we search who's the owner and clear its refreshToken array
                const userHacked = await User.findOne({
                    _id: decoded.userId
                }).exec();
                userHacked.refreshToken = "";
                const result = await userHacked.save();
            }
        )
        return res.sendStatus(401); 
    }

    /******  handle if refresh token found in the database   ******/
    
    console.log(`refresh token found: ${refreshToken}`);
    // evaluate jwt
    jwt.verify(
        refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {

                // if refresh token is expired
                if (err) {
                    userFound.refreshToken = "";
                    const result = userFound.save();
                }
                // rf expired or the decoded refresh token doesn't match
                if (err || userFound._id != decoded.userId) {
                  return res.sendStatus(401);
                }
                    
                // refresh token is valid
                const accessToken = jwt.sign(   // create new acces token
                    { userId: userFound._id, isAdmin: userFound.isAdmin },
                    process.env.TOKEN_SECRET,
                    { expiresIn: process.env.TOKEN_EXPIRATION }
                );

                res.status(200).json({ 
                    accessToken : accessToken
                });
            }
    )
} 