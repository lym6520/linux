#! /bin/sh
rm -rf httpd-2.2.22 httpd-2.2.22.tar.gz
wget http://soft.phpwind.me/web/httpd-2.2.22.tar.gz
tar zxvf httpd-2.2.22.tar.gz
cd httpd-2.2.22
./configure --prefix=/alidata/server/httpd --with-mpm=worker --enable-so --enable-rewrite --enable-mods-shared=all --enable-nonportable-atomics=yes --disable-dav --enable-deflate --enable-cache --enable-disk-cache --enable-mem-cache --enable-file-cache
make
make install
cd ..
cp -Rf ./config-httpd-2.2.19/* /alidata/server/httpd/conf/
/alidata/server/httpd/bin/apachectl start