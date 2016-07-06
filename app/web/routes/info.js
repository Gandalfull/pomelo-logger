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
                titles: ["进程ID", "日志标记", "日志时间", "日志内容"],
                name: ["instance", "type", "createTime", "message"]
            },
            loggers: []
        };
        var begin = new Date(new Date().normalize());

        Async.waterfall([
            function (cb) {
                var logger = Bearcat.getBean('application').getComponent('dao-logger').getConnection().model('logger');
                logger.find({
                    createTime: {$gte: begin},
                    level: log_levels[req.query.type]
                }, {_id: 0, __v: 0}).lean().sort({createTime: -1}).limit(100)
                    .exec(function (e, d) {
                        if (d) {
                            for (var i = 0; i < d.length; i++) {
                                viewData.loggers.push({
                                    instance: d[i].instance,
                                    type: d[i].type,
                                    createTime: d[i].createTime.toLocaleString(),
                                    message: d[i].message
                                });
                            }
                        }
                        cb(e, d);
                    });
            }
        ], function (e) {
            res.render('info', viewData);
        });
    }
};

