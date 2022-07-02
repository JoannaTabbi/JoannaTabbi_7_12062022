const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401);
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
                    expiresIn: 15 * 60 * 60
                }
            );
            res.json({
                accessToken
            });
        }
    } catch {
        res.status(403).json({
            error: new Error('Unauthorized request!')
        });
    }
}