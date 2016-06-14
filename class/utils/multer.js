var User = require("../impl/User");
var UserList = require("../impl/UserList");
var userList = new UserList;
var fs = require("fs");
var mime = require("mime");
var multer = require("multer");
var tools = require("./tools");
var log4js = require("log4js");
var logger = log4js.getLogger();

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/images");
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "." + mime.extension(file.mimetype));
    }
});
var upload = multer({
    storage : storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, callback) {
        if (file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/gif") {
            callback(null, true);
            return
        }
        logger.error(new Error("File not allowed by multer filter"));
        callback(true);
    }
}).single("file");


function multerUpload(req, res) {
    upload(req, res, function (err) {
        if (err) {
            logger.warn(err.message);
            res.status(400).send(err.message);
        } else if (req.body.operation === "uploadPhoto") {
            userList.getUser({_id: req.body.user}, function (foundUser, err) {
                if (err) {
                    logger.warn(err.message);
                    res.status(400).send(err.message);
                } else {
                    new User().update(req.body.user, {avatar: req.file.path}, function (err) {
                        if (err) {
                            logger.warn(err.message);
                            res.status(400).send(err.message);
                        } else {
                            res.end();
                            if (fs.existsSync(foundUser.avatar)) fs.unlinkSync(foundUser.avatar);
                        }
                    })
                }
            });
        } else if (req.body.operation === "deletePhoto") {
            tools(req, res, req.body.operation, "");
        }
    })
}

module.exports = multerUpload;