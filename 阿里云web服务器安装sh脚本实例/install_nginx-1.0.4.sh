#! /bin/sh
wget http://soft.phpwind.me/top/nginx-1.0.12.tar.gz
mv nginx-1.0.12.tar.gz nginx-1.0.4.tar.gz
tar zxvf nginx-1.0.4.tar.gz
mv nginx-1.0.12 nginx-1.0.4
cd nginx-1.0.4
./configure --user=www --group=www --prefix=/alidata/server/nginx --with-http_stub_status_module --without-http-cache --with-http_ssl_module
make
make install
chmod 775 /alidata/server/nginx/logs
chown -R www:www /alidata/server/nginx/logs
chmod -R 775 /alidata/www
chown -R www:www /alidata/www
cd ..
cp -fR ./config-nginx-1.0.4/* /alidata/server/nginx/conf/
chmod 755 /alidata/server/nginx/sbin/nginx
/alidata/server/nginx/sbin/nginx

