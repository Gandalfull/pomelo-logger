/**
 * File: loggerTable
 *
 * Created by goofo
 * Time on: 16/7/5.
 */

'use strict';

var Mongoose = require('mongoose');

var Table = {
    createTime: {type: Date, index: -1},
    instance: {type: String, default: ""},
    level: {type: Number, index: -1},
    type: {type: String, index: true},
    message: {type: String, default: ""}
};

var SchemaOption = {};

var Schema = new Mongoose.Schema(Table, SchemaOption);
Schema.set('redisCache', 'loggerSchema');
Schema.set('expire', 60000);

module.exports = {
    "name": "logger",
    "schema": Schema
};


