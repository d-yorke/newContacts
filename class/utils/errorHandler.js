var log4js = require("log4js");
var logger = log4js.getLogger();

function handleError (res, err, errStatus) {
    res.status(errStatus).send(err.message);
    logger.error(err.message + ". " + err.stack);
    return err;
}

module.exports = handleError;