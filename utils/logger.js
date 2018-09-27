const bunyan = require('bunyan');
const log = bunyan.createLogger({
    name: 'Han Restaurant',
    serializers: bunyan.stdSerializers
});

module.exports = log;