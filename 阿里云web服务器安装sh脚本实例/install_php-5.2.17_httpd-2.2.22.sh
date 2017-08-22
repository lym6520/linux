#! /bin/sh
rm -rf php-5.2.17.tar.gz php-5.2.17
wget http://soft.phpwind.me/web/php-5.2.17.tar.gz
tar zxvf php-5.2.17.tar.gz
patch -d php-5.2.17 -p1 < php-5.2.17-max-input-vars.patch
cd php-5.2.17
./configure --prefix=/alidata/server/php --with-config-file-path=/alidata/server/php/etc --with-mysql=/alidata/server/mysql --with-mysqli=/alidata/server/mysql/bin/mysql_config --with-pdo-mysql=/alidata/server/mysql/bin/mysql_config --with-apxs2=/alidata/server/httpd/bin/apxs --enable-static --enable-maintainer-zts --enable-zend-multibyte  --enable-sockets --enable-wddx --enable-zip --enable-calendar --enable-bcmath --enable-soap --with-zlib --with-iconv --with-gd --with-xmlrpc --enable-mbstring --without-sqlite --with-curl --enable-ftp --with-mcrypt  --with-freetype-dir=/usr/local/freetype.2.1.10 --with-jpeg-dir=/usr/local/jpeg.6 --with-png-dir=/usr/local/libpng.1.2.8 --disable-ipv6 --disable-debug --with-openssl

#make
make ZEND_EXTRA_LIBS='-liconv'
make install
cd ..
cp -f php-5.2.17.ini /alidata/server/php/etc/php.ini
/alidata/server/httpd/bin/apachectl restart
sleep 20
