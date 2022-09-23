const { json } = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401).send({ message: "pas de cookie dans le four" });
        const refreshToken = cookies.jwt;
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
            const accessToken = jwt.sign({
                    userId: decodedRefreshToken.userId
                },
                process.env.TOKEN_SECRET, {
                    expiresIn: process.env.TOKEN_EXPIRATION
                }
            );
            res.json({
                accessToken, refreshToken
            });
        }
    } catch {
        res.status(403).json({
            error: new Error('Unauthorized request!')
        });
    }
}