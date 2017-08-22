#! /bin/sh

groupadd www
useradd -g www -M -d /alidata/www -s /sbin/nologin www


wget http://soft.phpwind.me/web/rpms/${machine}/libiconv-1.13.1-1.${machine}.rpm

rpm -ivh libiconv-1.13.1-1.${machine}.rpm


if [ ! -f jpegsrc.v6b.tar.gz ];then
	wget http://soft.phpwind.me/web/jpegsrc.v6b.tar.gz
fi
rm -rf jpeg-6b
tar zxvf jpegsrc.v6b.tar.gz
cd jpeg-6b
./configure --prefix=/usr/local/jpeg.6 --enable-shared --enable-static
mkdir -p /usr/local/jpeg.6/include
mkdir /usr/local/jpeg.6/lib
mkdir /usr/local/jpeg.6/bin
mkdir -p /usr/local/jpeg.6/man/man1
make
make install-lib
make install
cd ..