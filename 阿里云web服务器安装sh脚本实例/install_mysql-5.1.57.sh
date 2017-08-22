#! /bin/sh
rm -rf mysql-5.1.63.tar.gz mysql-5.1.57 mysql-5.1.63
if [ ! -f mysql-5.1.63.tar.gz ];then
	wget http://soft.phpwind.me/web/mysql-5.1.63.tar.gz
fi
rm -rf mysql-5.1.57
tar -xzvf mysql-5.1.63.tar.gz
mv mysql-5.1.63 mysql-5.1.57
cd mysql-5.1.57
./configure --prefix=/alidata/server/mysql \
--with-charset=utf8 \
--with-extra-charsets=all \
--enable-thread-safe-client \
--with-big-tables \
--with-ssl \
--with-embedded-server \
--enable-local-infile \
--enable-assembler \
--with-plugins=innobase,partition \
--with-mysqld-ldflags=-all-static \
--with-client-ldflags=-all-static
make
make install
groupadd mysql
useradd -g mysql -s /sbin/nologin mysql
mkdir -p /alidata/server/mysql/var/
./scripts/mysql_install_db --datadir=/alidata/server/mysql/var/ --user=mysql
chown -R root:root /alidata/server/mysql/
chown -R mysql:mysql /alidata/server/mysql/var/
chown -R mysql:mysql /alidata/log/mysql
cp ./support-files/mysql.server /etc/init.d/mysqld
cd ..
cp -f my.cnf /etc/my.cnf
chmod 755 /etc/init.d/mysqld
/etc/init.d/mysqld start