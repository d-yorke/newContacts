var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var multerUpload = require("./class/utils/multer");
var log4js = require("log4js");
var logger = log4js.getLogger();
var tools = require("./class/utils/tools");
var app = express();

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use("/bower_components", express.static(path.join(__dirname, "/bower_components")));
app.use("*",function(req, res, next) {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress ||
        req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var reg = /.*:/;
    logger.trace(req.method + " on " + req.baseUrl + " from " + ip.replace(reg, ""));
    next();
}); // logging method, url and ip

app.get('/', express.static("public"));
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
app.post("/new", function (req, res) {
    tools(req, res, req.body.operation, "");
});
app.post("/photo", function (req, res) {
    multerUpload(req, res);
});
app.get("/*", function(req, res) {
    res.redirect("/");
});

/*// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500).end();
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).end();
});*/


module.exports = app;
logger.trace(__filename + " - connected");