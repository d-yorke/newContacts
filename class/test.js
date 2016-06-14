var log4js = require('log4js');
var logger = log4js.getLogger();
var User = require("./impl/User"),
    UserModel = require("./utils/mongoose"),
    UserList = require("./impl/UserList");
var path = require("path");



/*var user = new User;

user.update("56c1d0108dc89bb005a92bce", {firstNames: "Rose"}, function(status, message) {
    logger.trace(status + " " + message)
});*/
/*
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');*/

