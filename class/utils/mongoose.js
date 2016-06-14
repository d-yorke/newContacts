var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var log4js = require('log4js');
var logger = log4js.getLogger();

mongoose.connect("mongodb://localhost/newContacts");

var userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: String,
    birthDate: Date,
    avatar: String,
    phone: String,
    skype: String,
    vk: String
});

var UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
logger.trace(__filename + " - connected");