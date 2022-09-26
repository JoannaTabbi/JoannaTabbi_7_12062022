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
   
    //delete the current jwt cookie in order to replace it with the new one
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' })
    
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
                userHacked.refreshToken = [];
                const result = await userHacked.save();
            }
        )
        return res.sendStatus(403); 
    }

    /******  handle if refresh token found in the database   ******/
    
    // isolate other potential refresh tokens of the user 
    const newRefreshTokenArray = userFound.refreshToken.filter(rt => rt !== refreshToken)
    
    console.log(`refresh token found: ${refreshToken}`);
    // evaluate jwt
    jwt.verify(
        refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {

                // if refresh token is expired
                if (err) {
                    userFound.refreshToken = [...newRefreshTokenArray];
                    const result = userFound.save();
                }
                // rf expired or the decoded refresh token doesn't match
                if (err || userFound._id != decoded.userId) {
                  return res.sendStatus(403);
                }
                    
                // refresh token is valid
                const accessToken = jwt.sign(   // create new acces token
                    { userId: userFound._id },
                    process.env.TOKEN_SECRET,
                    { expiresIn: process.env.TOKEN_EXPIRATION }
                );

                const newRefreshToken = jwt.sign(   // create new refresh token
                    { userId: userFound._id },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
                );

                // save the new refresh token with current user
                userFound.refreshToken = [...newRefreshTokenArray, newRefreshToken];
                const result = await userFound.save();
                
                // provide responses
                res.cookie('jwt', newRefreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60
                });

                res.status(200).json({ 
                    accessToken : accessToken,
                    refreshToken : newRefreshToken
                });
            }
    )
} 



/* 
module.exports = (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });

        const decodedRefreshToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const userId = decodedRefreshToken.userId;
        req.auth = {
            userId
        };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            //replace the refreshToken in dataBase


            //create new access token
            const accessToken = jwt.sign({
                userId: decodedRefreshToken.userId
                },
                process.env.TOKEN_SECRET, {
                expiresIn: process.env.TOKEN_EXPIRATION
                }
            );

            // create new refresh token
            const newRefreshToken = jwt.sign(   
                { userId: decodedRefreshToken.userId },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
            );

            //send new refresh token in cookies
            res.cookie('jwt', newRefreshToken, {
                httpOnly: true,
                sameSite: "None"
            });

            res.json({
                accessToken, newRefreshToken
            });
        }
    } catch {
        res.status(403).json({
            error: new Error('Unauthorized request!')
        });
    }
} */