var UserModel = require("./../utils/mongoose");
var User = require("./User");
var log4js = require("log4js");
var logger = log4js.getLogger();

function UserList() {
    this.getUser = function (searchObj, callback) {
        UserModel.findOne(searchObj, function (err, findUser) {
            if (err) return callback(null, err);
            callback(new User(findUser).toObject());
        });
    };
    this.getList = function (searchQuery, callback) {
        UserModel.find(+searchQuery
            ? { phone: new RegExp(+searchQuery + "", "i") }
            : {
                $or: [
                    {"firstName": {$regex: new RegExp(searchQuery, "i")}},
                    {"lastName": {$regex: new RegExp(searchQuery, "i")}}
                ]
            }, function (err, data) {
                if (err) return callback(null, err);
                var list = [];
                for (var i = 0; i < data.length; i++) list.push(new User(data[i]).toObject());
            callback(list);
        });
    };
}

module.exports = UserList;
logger.trace(__filename + " - connected");