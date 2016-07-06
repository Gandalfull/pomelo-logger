/**
 * File: info
 *
 * Created by goofo
 * Time on: 16/7/6.
 */

'use strict';
var Bearcat = require('bearcat');
var Async = require('async');

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
    get: function (req, res) {

        var viewData = {
            info_type: req.query.type,
            portlet: {
                titles: ["日志数量", "日志内容"],
                name: ["amount", "_id"]
            },
            loggers: []
        };
        var begin = new Date(new Date().normalize());
        Async.auto({
            aggregate: function (cb) {
                var logger = Bearcat.getBean('application').getComponent('dao-logger').getConnection().model('logger');
                logger.aggregate().match({
                    createTime: {$gt: begin},
                    level: log_levels[req.query.type]
                }).group({_id: "$message", amount: {$sum: 1}}).exec(function (e, d) {
                    if (d) {
                        viewData.loggers = d;
                        console.log("聚合到的数据量为:" + d.length);
                    }
                    cb();
                });
            }
        }, function (e, r) {
            res.render('info', viewData);
        });
    }
};

