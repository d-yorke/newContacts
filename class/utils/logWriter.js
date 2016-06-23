var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file("./error.log"), "[log]");
var logger = log4js.getLogger("[log]");

function writeLog (message, err, res, status) {
    if (err) {
        if (res && status) {
            res.status(status).send(err.message);
        }
        logger.error(err.message + ". " + err.stack);
        return err;
    }
    logger.info(message);

}

module.exports = writeLog;