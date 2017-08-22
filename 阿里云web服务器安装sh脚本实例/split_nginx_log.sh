#!/bin/bash
logs_path="/alidata/server/log/nginx/"
mv ${logs_path}access.log ${logs_path}access_$(date -d "yesterday" +"%Y%m%d").log
kill -USR1 `cat /alidata/server/nginx/logs/nginx.pid`

chmod +x /alidata/server/nginx/sbin/split_nginx_log.sh

crontab
0 1 * * * /alidata/server/nginx/sbin/split_nginx_log.sh