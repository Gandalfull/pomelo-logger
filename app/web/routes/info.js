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
        var begin = req.query.begin ? new Date(req.query.begin + " 00:00:00") : new Date(new Date().normalize());
        var end = req.query.end ? new Date(req.query.end + " 00:00:00") : begin.otherDay(1);
        if (end < begin) {
            end = begin.otherDay(1);
        }
        var select_instance = req.query.instance;
        var select_category = req.query.category;
        var select_level = req.query.level || "DEBUG";

        var limit = req.query.limit || 100;

        var viewData = {
            info_type: req.query.type,
            portlet: {
                titles: ["进程ID", "日志标记", "日志时间", "日志内容"],
                name: ["instance", "type", "createTime", "message"]
            },
            loggers: [],
            instances: [],
            select_instance: select_instance || "",
            select_categorys: select_category || "",
            select_level: select_level,
            levels: ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"],
            begin: begin.toLocaleDateString(),
            end: end.toLocaleDateString(),
            categorys: []
        };

        Async.auto({
            instance: function (cb) {
                var logger = Bearcat.getBean('application').getComponent('dao-logger').getConnection().model('logger');
                logger.aggregate().match({createTime: {$gte: begin, $lt: end}, level: log_levels[select_level]}).group({
                    _id: "$instance",
                    amount: {$sum: 1}
                }).exec(function (e, r) {
                    viewData.instances = r || [];
                    cb();
                });
            },
            type: function (cb) {
                var logger = Bearcat.getBean('application').getComponent('dao-logger').getConnection().model('logger');
                logger.aggregate().match({createTime: {$gte: begin, $lt: end}, level: log_levels[select_level]}).group({
                    _id: "$type",
                    amount: {$sum: 1}
                }).exec(function (e, r) {
                    viewData.categorys = r || [];
                    cb();
                });
            },
            loges: function (cb) {
                var logger = Bearcat.getBean('application').getComponent('dao-logger').getConnection().model('logger');
                var condition = {
                    createTime: {$gte: begin},
                    level: log_levels[select_level]
                };
                if (select_instance) {
                    condition.instance = select_instance;
                }
                if (select_category) {
                    condition.type = select_category;
                }
                logger.find(condition, {_id: 0, __v: 0}).lean().sort({createTime: -1}).limit(limit)
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
        }, function () {
            res.render('info', viewData);
        });
    }
};

