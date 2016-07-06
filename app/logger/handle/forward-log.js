/**
 * File: forward-log
 *
 * Created by goofo
 * Time on: 16/7/6.
 */

'use strict';

var Bearcat = require('bearcat');
var log_levels = {
    ALL: Number.MIN_VALUE,
    TRACE: 5000,
    DEBUG: 10000,
    INFO: 20000,
    WARN: 30000,
    ERROR: 40000,
    FATAL: 50000,
    OFF: Number.MAX_VALUE
};

module.exports = {
    handle: function (msg, rinfo) {
        var logger = Bearcat.getBean('application').getComponent('dao-logger').getConnection().model('logger');
        logger.collection.insert({
            createTime: new Date(msg["@timestamp"]),
            instance: msg.fields.sid,
            level: log_levels[msg.fields.level],
            type: msg.type,
            message: msg.message
        });
    }
};

