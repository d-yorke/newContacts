var fs = require("fs");
var User = require("./../impl/User");
var UserList = require("./../impl/UserList");
var userList = new UserList;
var validate = require("./validate");
var errorHandler = require("./errorHandler");

function doAction(req, res, operation, searchQuery) {
    var user = new User;
    var validation = validate(req.body);

    if (operation === "getList") {
        userList.getList(searchQuery, function(list, err) {
            if (err) {
                return errorHandler(res, err, 500);
            }
            res.send(list).end();
        });
        return
    }
    if (operation === "getUser") {
        userList.getUser({"_id": req.params[0]}, function(user, err) {
            if (err) {
                return errorHandler(res, err, 500);
            }
            res.send(user).end();
        });
        return
    }
    if (operation === "create/update") {
        if (!validation) {
            if (req.params[0]) {
                user.update(req.params[0], req.body, function(err) {
                    if (err) {
                        return errorHandler(res, err, 500);
                    }
                    res.status(202).send("User updated");
                });
            } else {
                new User(req.body).saveToDB(function(data, err) {
                    if (err) {
                        return errorHandler(res, err, 500);
                    }
                    res.send(data).end();
                });
            }
        } else {
            return errorHandler(res, new Error(validation), 500);
        }
        return
    }
    if (operation === "delete") {
        userList.getUser({"_id": req.params[0]}, function(foundUser, err) {
            if (err) {
                return errorHandler(res, err, 500);
            } else {
                if (fs.existsSync(foundUser.avatar)) {
                    fs.unlinkSync(foundUser.avatar);
                }
                user.deleteFromDB(req.params[0], function(err) {
                    if (err) {
                        return errorHandler(res, err, 500);
                    }
                    res.status(202).send("User deleted");
                });
            }
        });
        return
    }
    if (operation === "deletePhoto") {
        userList.getUser({"_id": req.body.user}, function(foundUser, err) {
            if (err) {
                return errorHandler(res, err, 500);
            } else {
                user.update(req.body.user, {avatar: ""}, function(err) {
                    if (err) {
                        return errorHandler(res, err, 500);
                    } else {
                        if (fs.existsSync(foundUser.avatar)) {
                            fs.unlinkSync(foundUser.avatar);
                        }
                        res.status(202).send("Avatar deleted");
                    }
                })
            }
        });
        return
    }

    return errorHandler(res, new Error("Tools error"), 500);
}

module.exports = doAction;