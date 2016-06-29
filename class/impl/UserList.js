var UserModel = require("./../utils/mongoose");
var User = require("./User");

function UserList() {
    this.getUser = function (searchObj, callback) {
        UserModel.findOne(searchObj, function (err, findUser) {
            if (err) {
                return callback(null, err);
            }
            callback(new User(findUser).toObject());
        });
    };
    this.getList = function (searchQuery, callback) {

        UserModel.find(+searchQuery.search
            ? { phone: new RegExp(+searchQuery.search + "", "i") }
            : {
                $or: [
                    {"firstName": {$regex: new RegExp(searchQuery.search, "i")}},
                    {"lastName": {$regex: new RegExp(searchQuery.search, "i")}}
                ]
            })
            .sort({lastName: 1})
            .skip(+searchQuery.page * 15)
            .limit(15)
            .exec(function (err, data) {
                if (err) {
                    return callback(null, err);
                }
                var list = [];
                for (var i = 0; i < data.length; i++) {
                    var newUser = new User(data[i]);
                    list.push({
                        _id: newUser.getId(),
                        firstName: newUser.getFirstName(),
                        lastName: newUser.getLastName()
                    });
                }
                callback(list);
            });
    };
}

module.exports = UserList;