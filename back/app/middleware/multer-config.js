const multer = require("multer");
const path = require('path');

/**
 * defines the media types supported for the uploaded images files
 */
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

//setting up the path (destination) and the filename for the avatar images
const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/profile'));
    },
    filename: function (req, file, cb) {
        const name = req.body.user;
        console.log(name);
        cb(null, file.originalname);
    }
});

exports.uploadAvatar = multer({
    storage: avatarStorage
}).single("file");