var App = require('newbeely-nodejs');
var Bearcat = require('bearcat');
var Express = require('express');
var Path = require('path');
var BodyParser = require('body-parser');
var CookieParser = require('cookie-parser');
var Session = require('express-session');
var MorganLogger = require('morgan');

App.start(function () {
    /// 加载配置文件
    App.configure("development|production", function () {
        var expressComponent = Bearcat.getBean("application").getComponent("web");
        var express = expressComponent.express;

        /// 固定使用views为 工作目录+"/views"
        express.set('views', Path.join(expressComponent.opts.path, 'views'));

        express.set('view engine', "ejs");
        express.use(MorganLogger('dev'));
        express.use(BodyParser.json());
        express.use(BodyParser.urlencoded({extended: false}));
        express.use(CookieParser());
        // express.use(Session(expressComponent.opts.session || {
        //         secret: 'miniwar-cms',
        //         cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // 30 days
        //         name: 'miniwarcms'
        //     }));

        express.use(Express.static(Path.join(expressComponent.opts.path, 'public')));

        express.use(function (req, res, next) {
            var url = req.originalUrl;
            if (url == "" || url == "/") {
                return res.redirect('/dashboard');
            }
            next(null);
        });

        expressComponent.loader('/', 'routes', expressComponent.opts.path);
        express.use(function (req, res) {
            res.statusCode = 404;
            res.end();
        });
    });
});