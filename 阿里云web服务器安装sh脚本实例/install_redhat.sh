#! /bin/sh

export nginx_version=1.0.4
export httpd_version=2.2.19
export mysql_version=5.1.57
export php2_version=5.2.17
export php3_version=5.3.6
export vsftpd_version=2.3.2
export sphinx_version=0.9.9


php=2
web=n
build_version=1


if [ "$web" == "n" ];then
web_dir=nginx-${nginx_version}
else
web_dir=httpd-${httpd_version}
fi

if [ "$php" == "3" ];then
php_dir=php-${php3_version}
else
php_dir=php-${php2_version}
fi

if [ `uname -m` == "x86_64" ];then
machine=x86_64
else
machine=i386
fi

export web
export web_dir
export php_dir
export mysql_dir=mysql-${mysql_version}
export vsftpd_dir=vsftpd-${vsftpd_version}
export sphinx_dir=sphinx-${sphinx_version}
export machine

rpm -e --allmatches mysql MySQL-python perl-DBD-MySQL dovecot exim qt-MySQL perl-DBD-MySQL dovecot qt-MySQL mysql-server mysql-connector-odbc php-mysql mysql-bench libdbi-dbd-mysql mysql-devel-5.0.77-3.el5 httpd php mod_auth_mysql mailman squirrelmail php-pdo php-common php-mbstring php-cli



echo "system will install $web_dir and $php_dir"

if [ ! -f /etc/yum.repos.d/rhel-debuginfo.repo.bak ];then
mv /etc/yum.repos.d/rhel-debuginfo.repo /etc/yum.repos.d/rhel-debuginfo.repo.bak
cp rhel-debuginfo.repo /etc/yum.repos.d/
fi

yum makecache
yum -y install gcc gcc-c++ gcc-g77 autoconf automake fiex* libxml2 libxml2-devel ncurses ncurses-devel libtool-ltdl-devel libtool-ltdl






touch tmp.log

./install_set_sysctl.sh
./install_set_ulimit.sh

./install_disk.sh
echo "---------- add disk ok ----------" >> tmp.log

./install_simple_env.sh
echo "---------- env ok ----------" >> tmp.log

./install_dir.sh
echo "---------- make dir ok ----------" >> tmp.log


wget http://soft.phpwind.me/web/${mysql_dir}-${build_version}.${machine}.rpm
rpm -ivh ${mysql_dir}-${build_version}.${machine}.rpm --nodeps --force
echo "---------- ${mysql_dir} ok ----------" >> tmp.log


wget http://soft.phpwind.me/web/${web_dir}-${build_version}.${machine}.rpm
rpm -ivh ${web_dir}-${build_version}.${machine}.rpm
echo "---------- ${web_dir} ok ----------" >> tmp.log


wget http://soft.phpwind.me/web/${php_dir}_${web_dir}-${build_version}.${machine}.rpm
rpm -ivh ${php_dir}_${web_dir}-${build_version}.${machine}.rpm
echo "---------- ${php_dir} ok ----------" >> tmp.log


./install_${vsftpd_dir}.sh
echo "---------- ${vsftpd_dir} ok ----------" >> tmp.log

./install_soft.sh
echo "---------- phpwind & phpmyadmin ok ----------" >> tmp.log
echo "---------- web init ok ----------" >> tmp.log
echo "web installed successfully.view mysql/vsftp account from tmp.log"

cp /etc/rc.local /etc/rc.local.bak
if [ "$ifubuntu" != "" ] || [ "$ifdebian" != "" ];then
echo '#!/bin/sh -e' > /etc/rc.local
else
echo '#!/bin/sh' > /etc/rc.local
echo "touch /var/lock/subsys/local" >> /etc/rc.local
fi
echo "/etc/init.d/mysqld start" >> /etc/rc.local
echo "/etc/init.d/php-fpm start" >> /etc/rc.local
if [ "$web" == "n" ];then
echo "/etc/init.d/nginx start" >> /etc/rc.local
else
echo "/etc/init.d/httpd start" >> /etc/rc.local
fi
echo "/etc/init.d/vsftpd start" >> /etc/rc.local

if [ "$ifubuntu" != "" ] || [ "$ifdebian" != "" ];then
echo 'exit 0' >> /etc/rc.local
fi


rm -rf /etc/vsftpd/vsftpdcentosi386.conf
/etc/init.d/vsftpd restart


echo "---------- rc init ok ----------" >> tmp.log
/alidata/server/php/bin/php -f init_mysql.php
echo "---------- mysql init ok ----------" >> tmp.log