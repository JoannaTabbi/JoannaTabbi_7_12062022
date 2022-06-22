const multer = require("multer");

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
    destination: (req, file, callback) => {
        callback(null, "profile");
    },
    filename: (req, file, callback) => {
        //const name = req.body.user.userName;
        callback(null, file.originalname);
    }
});

exports.uploadAvatar = multer({
    storage: avatarStorage
}).single("file");