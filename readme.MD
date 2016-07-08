# Pomelo 日志服务器
这是一个用来收集和查看pomelo服务器运行期产生的日志的服务代码.
本项目是为了解决Pomelo使用log4产生的日志难以查看和分析的难题.
基本思路为 使用log4提供的udp appender,发送udp数据包到指定的udp服务器,本项目内建一个udp服务连接到mongodb,
把收到的日志批量存储到数据库内.然后提供一个web服务用来查看日志.

## Install

        git clone
## Usage

>1 本项目默认的配置文件在 config/services.json

>* web 是配置前端页面的web服务 可以修改对应的host和port来设置自己需要的监听服务 默认localhost:65000
>* dao-logger 是数据库配置 这里是mongodb
>* logger 是一个udp服务 可修改对应的host和port来设置自己需要的监听端口.

>2 启动mongodb配置完成对应的配置文件 即可启动,
    这里使用的是pm2启动,对应的pm2配置文件在根目录内的app.json
>* 安装pm2

        npm install pm2 -g
>* 启动项目

        pm2 start app.json

>3 修改pomelo的log4日志配置

        {
              "type": "logstashUDP",
              "host": "localhost",
              "port": 60090,
              "layout": {
                "type": "messagePassThrough"
              },
              "fields": {
                "sid": "${opts:serverId}"
              },
              "category": "pomelo"
        }


>* type 使用 logstashUDP 就是使用udp
>* host 就是本服务的logger组件监听的地址
>* port 就是本服务的logger组件监听的端口号
>* layout 使用 messagePassThrough 是使用更简化的日志格式
>* fields 填充一个 服务器的 serverId 为 sid
>* category 日志分类 *如果自定义添加了这个 需要到本项目的 app/logger/handler内添加对应的文件逻辑*

>4 启动pomelo

        pomelo start -D --env production
>5 使用浏览器打开 http://localhost:6500 即可使用

