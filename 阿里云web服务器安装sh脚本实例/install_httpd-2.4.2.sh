#! /bin/sh
rm -rf httpd-2.4.2 httpd-2.4.2.tar.gz apr-1.4.6.tar.gz apr-util-1.4.1.tar.gz apr-1.4.6 apr-util-1.4.1
wget http://soft.phpwind.me/web/httpd-2.4.2.tar.gz
tar zxvf httpd-2.4.2.tar.gz

wget http://labs.mop.com/apache-mirror//apr/apr-1.4.6.tar.gz
tar -zxvf apr-1.4.6.tar.gz
cp -rf apr-1.4.6 httpd-2.4.2/srclib/apr

wget http://labs.mop.com/apache-mirror//apr/apr-util-1.4.1.tar.gz
tar -zxvf apr-util-1.4.1.tar.gz
cp -rf apr-util-1.4.1 httpd-2.4.2/srclib/apr-util

cd httpd-2.4.2
./configure --prefix=/alidata/server/httpd --with-mpm=worker --enable-so --enable-rewrite --enable-mods-shared=all --enable-nonportable-atomics=yes --disable-dav --enable-deflate --enable-cache --enable-disk-cache --enable-mem-cache --enable-file-cache --enable-ssl --with-included-apr --enable-modules=all  --enable-mods-shared=all
make
make install
cd ..
cp -Rf ./config-httpd-2.4.2/* /alidata/server/httpd/conf/
/alidata/server/httpd/bin/apachectl start