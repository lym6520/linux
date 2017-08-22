rm -rf php-5.3.10.tar.gz php-5.3.6
wget http://soft.phpwind.me/top/php-5.3.10.tar.gz
mv php-5.3.10.tar.gz php-5.3.6.tar.gz
tar zxvf php-5.3.6.tar.gz
mv php-5.3.10 php-5.3.6
cd php-5.3.6
./configure --prefix=/alidata/server/php --with-config-file-path=/alidata/server/php/etc  --with-apxs2=/alidata/server/httpd/bin/apxs --with-mysql=mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --enable-static --enable-maintainer-zts --enable-zend-multibyte --enable-inline-optimization --enable-sockets --enable-wddx --enable-zip --enable-calendar --enable-bcmath --enable-soap --with-zlib --with-iconv --with-gd --with-xmlrpc --enable-mbstring --without-sqlite --with-curl --enable-ftp --with-mcrypt  --with-freetype-dir=/usr/local/freetype.2.1.10 --with-jpeg-dir=/usr/local/jpeg.6 --with-png-dir=/usr/local/libpng.1.2.8 --disable-ipv6 --disable-debug --with-openssl
#make
make ZEND_EXTRA_LIBS='-liconv'
make install
cd ..
cp -f php-5.3.6.ini /alidata/server/php/etc/php.ini
/alidata/server/httpd/bin/apachectl restart
sleep 20
