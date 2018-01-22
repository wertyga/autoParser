import fs from 'fs';

import config from '../common/config';

function getLogger(module) {

    let pathName = module.filename.split('/').slice(-2).join('/');
    const logFile = config.logFilePath;

    return {
        error(msg) {
            const errorMsg = `Type: ERROR; Time: ${new Date()}; File: ${pathName}; Message: ${msg}\n\n`;
            fs.appendFileSync(logFile, errorMsg);
        },
        info(msg) {
            const errorMsg = `Type: INFO; Time: ${new Date()}; File: ${pathName}; Message: ${msg}\n\n`;
            fs.appendFileSync(logFile, errorMsg);
        }
    }
}

module.exports = getLogger;