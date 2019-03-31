const config = require('./config');
const fs = require('fs');

module.exports = (text) => {
    fs.appendFileSync(config.log.path, text + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });
}