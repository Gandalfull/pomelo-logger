/**
 * File: dashboard
 *
 * Created by goofo
 * Time on: 16/7/5.
 */

'use strict';
var Bearcat = require('bearcat');
var Async = require('async');

module.exports = {
    get: function (request, response) {

        var viewData = {};

        var logger = Bearcat.getBean('application').getComponent('dao-logger').getConnection().model('logger');
        var Begin = new Date(new Date().normalize());
        var End = Begin.otherDay(1);
        Async.auto({
            _debug: function (cb) {
                logger.count({createTime: {$gte: Begin, $lt: End}, level: 10000}, cb);
            },
            _info: function (cb) {
                logger.count({createTime: {$gte: Begin, $lt: End}, level: 20000}, cb);
            },
            _warn: function (cb) {
                logger.count({createTime: {$gte: Begin, $lt: End}, level: 30000}, cb);
            },
            _error: function (cb) {
                logger.count({createTime: {$gte: Begin, $lt: End}, level: 40000}, cb);
            },
            _fatal: function (cb) {
                logger.count({createTime: {$gte: Begin, $lt: End}, level: 50000}, cb);
            }
        }, function (e, r) {
            viewData = {
                _debug: r._debug,
                _info: r._info,
                _warn: r._warn,
                _error: r._error,
                _fatal: r._fatal
            };
            response.render('dashboard',viewData);
        });
    }
};

