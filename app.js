var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var multerUpload = require("./class/utils/multer");
var tools = require("./class/utils/tools");
var app = express();
var writeLog = require("./class/utils/logWriter");

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname, "/public")));
app.use("/bower_components", express.static(path.join(__dirname, "/bower_components")));

app.use("*", function(req, res, next) {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress ||
        req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var reg = /.*:/;
    if (req.method === "POST") {
        writeLog(req.method + " on " + req.baseUrl + " from " + ip.replace(reg, ""));
    }
    if (ip.replace(reg, "") === "192.168.0.169") {
        res.end("ИДИ НАХУЙ!");
        return
    } // Защита от бородача
    next();
}); // logging method, url and ip
app.get("/", express.static("public"));
app.route("/list")
    .get(function(req, res) {
        tools(req, res, "getList", "");
    })
    .post(function(req, res) {
        tools(req, res, "getList", req.body.search);
    });
app.route("/id*")
    .get(function(req, res) {
        tools(req, res, "getUser", "");
    })
    .post(function(req, res) {
        tools(req, res, req.body.operation, "");
    });
app.post("/new", function(req, res) {
    tools(req, res, req.body.operation, "");
});
app.post("/photo", function(req, res) {
    multerUpload(req, res);
});
app.get("/*", function(req, res) {
    res.redirect("/");
});

module.exports = app;