#! /bin/bash

mkdir /alidata/server
mkdir /alidata/www
mkdir /alidata/www/phpwind
mkdir /alidata/log
mkdir /alidata/log/php
mkdir /alidata/log/mysql
mkdir /alidata/log/nginx
mkdir /alidata/log/nginx/access
chown -R www:www /alidata/log

mkdir /alidata/server/${mysql_dir}
ln -s /alidata/server/${mysql_dir} /alidata/server/mysql

mkdir /alidata/server/${php_dir}
ln -s /alidata/server/${php_dir} /alidata/server/php


mkdir /alidata/server/${web_dir}
if [ "$web" == 'n' ];then
mkdir /alidata/log/nginx
mkdir /alidata/log/nginx/access
ln -s /alidata/server/${web_dir} /alidata/server/nginx
else
mkdir /alidata/log/httpd
mkdir /alidata/log/httpd/access
ln -s /alidata/server/${web_dir} /alidata/server/httpd
fi
