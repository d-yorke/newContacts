var express = require("express");
var router = express.Router();
var User = require("./../class/impl/User");
var UserList = require("./../class/impl/UserList");
var userList = new UserList;
var log4js = require("log4js");
var logger = log4js.getLogger();
var validate = require("./../class/utils/validate");
var tools = require("./../class/utils/tools");
var mime = require("mime");
var multer = require("multer");

/** multer settings */
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

/** routes */
router.get('/', express.static("public"));

router.route("/list")
    .get(function(req, res) {
        tools(req, res, "getList", "");
    })
    .post(function(req, res) {
        tools(req, res, "getList", req.body.search);
    });

router.route("/id*")
    .get(function(req, res) {
        userList.getUser({"_id": req.params[0]}, function (user) {
            res.send(user);
        });
    })
    .post(function(req, res) {
        upload(req, res, function (err) {
            if (err) logger.error(err);
            tools(req, res, req.body.operation);
        });
    });

router.post("/new", function (req, res) {
    upload(req, res, function (err) {
        if (err) logger.error(err);

    });
});

module.exports = router;
logger.trace(__filename + " - connected");