var UserModel = require("./../utils/mongoose");
var writeLog = require("./../utils/logWriter");

function User(userObject) {
    if (userObject) {
        var firstName = userObject.firstName,
            lastName = userObject.lastName,
            email = userObject.email,
            gender = userObject.gender,
            birthDate = userObject.birthDate,
            avatar = userObject.avatar,
            phone = userObject.phone,
            skype = userObject.skype,
            vk = userObject.vk,
            id = userObject._id;
    }

    this.getFirstName = function() {
        return firstName;
    };
    this.setFirstName = function(val) {
        firstName = val;
    };

    this.getLastName = function() {
        return lastName;
    };
    this.setlastName = function(val) {
        lastName = val;
    };

    this.getEmail = function() {
        return email;
    };
    this.setEmail = function(val) {
        email = val;
    };

    this.getGender = function() {
        return gender;
    };
    this.setGender = function(val) {
        gender = val;
    };

    this.getBirthDate = function() {
        return birthDate;
    };
    this.setBirthDate = function(val) {
        birthDate = val;
    };

    this.getAvatar = function() {
        return avatar;
    };
    this.setAvatar = function(val) {
        avatar = val;
    };

    this.getPhone = function() {
        return phone;
    };
    this.setPhone = function(val) {
        phone = val;
    };

    this.getSkype = function() {
        return skype;
    };
    this.setSkype = function(val) {
        skype = val;
    };

    this.getVk = function() {
        return vk;
    };
    this.setVk = function(val) {
        vk = val;
    };

    this.getId = function() {
        return id;
    };

    this.toObject = function() {
        return {
            firstName: this.getFirstName(),
            lastName: this.getLastName(),
            email: this.getEmail(),
            gender: this.getGender(),
            birthDate: this.getBirthDate(),
            avatar: this.getAvatar(),
            phone: this.getPhone(),
            skype: this.getSkype(),
            vk: this.getVk(),
            _id: this.getId()
        }
    };

    this.saveToDB = function(callback) {

        var thisUser = new UserModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: gender,
            birthDate: birthDate,
            avatar: avatar,
            phone: phone,
            skype: skype,
            vk: vk
        });

        thisUser.save(function(err, savedUser) {
            if (err) {
                return callback(savedUser, err);
            }
            writeLog(savedUser._id + " saved to DB");
            callback(savedUser);
        });
    }; // callback(savedUser, err)
    this.update = function(stringId, changesObj, callback) {
        UserModel.update({_id: stringId}, changesObj, function(err, updated) {
            if (err) {
                return callback(err);
            }
            if (updated.n) {
                writeLog(stringId + " updated");
            } else {
                return callback(new Error("Wrong update data or user not found"));
            }
            callback();
        });
    }; // callback(err)
    this.deleteFromDB = function(stringId, callback){
        UserModel.remove({_id: stringId}, function(err, deleted) {
            if (err) {
                return callback(err);
            }
            if (deleted.result.n) {
                writeLog(stringId + " deleted from DB");
            } else {
                return callback(new Error("User not found"));
            }
            callback();
        })
    }; // callback(err)
}

module.exports = User;