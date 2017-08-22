#! /bin/bash

export nginx_version=1.0.4
export httpd_version=2.2.22
export mysql_version=5.1.57
export php2_version=5.2.17
export php3_version=5.3.6
export vsftpd_version=2.3.2
export sphinx_version=0.9.9

#read -p "php version 5.2 or 5.3, input 2 or 3: " php
read -p "apache or nginx, input a or n: " web

php=2

if [ "$php" != "2" ] && [ "$php" != "3" ];then
php=2
fi
if [ "$web" != "a" ] && [ "$web" != "n" ];then
web=n
fi

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

echo "system will install $web_dir and $php_dir"


ifredhat=$(cat /proc/version | grep redhat)
ifcentos=$(cat /proc/version | grep centos)
ifubuntu=$(cat /proc/version | grep ubuntu)
ifdebian=$(cat /proc/version | grep -i debian)




if [ "$ifcentos" != "" ] || [ "$machine" = "i386" ];then
rpm -e httpd-2.2.3-31.el5.centos gnome-user-share
yum -y install vsftpd
fi

if [ "$ifredhat" != "" ];then
rpm -e --allmatches mysql MySQL-python perl-DBD-MySQL dovecot exim qt-MySQL perl-DBD-MySQL dovecot qt-MySQL mysql-server mysql-connector-odbc php-mysql mysql-bench libdbi-dbd-mysql mysql-devel-5.0.77-3.el5 httpd php mod_auth_mysql mailman squirrelmail php-pdo php-common php-mbstring php-cli
fi


if [ "$ifredhat" != "" ];then
mv /etc/yum.repos.d/rhel-debuginfo.repo /etc/yum.repos.d/rhel-debuginfo.repo.bak
cp rhel-debuginfo.repo /etc/yum.repos.d/
yum makecache
yum -y install gcc gcc-c++ gcc-g77 make libtool vsftpd autoconf patch unzip automake fiex* libxml2 libxml2-devel ncurses ncurses-devel libtool-ltdl-devel libtool-ltdl libmcrypt libmcrypt-devel libpng libpng-devel libjpeg-devel openssl openssl-devel curl curl-devel libxml2 libxml2-devel ncurses ncurses-devel libtool-ltdl-devel libtool-ltdl autoconf automake
/etc/init.d/iptables stop
echo "/etc/init.d/iptables stop" >>/etc/rc.local
elif [ "$ifcentos" != "" ];then
sed -i 's/^exclude/#exclude/' /etc/yum.conf
yum makecache
yum -y install gcc gcc-c++ gcc-g77 make libtool vsftpd autoconf patch unzip automake libxml2 libxml2-devel ncurses ncurses-devel libtool-ltdl-devel libtool-ltdl libmcrypt libmcrypt-devel libpng libpng-devel libjpeg-devel openssl openssl-devel curl curl-devel libxml2 libxml2-devel ncurses ncurses-devel libtool-ltdl-devel libtool-ltdl autoconf automake
/etc/init.d/iptables stop
echo "/etc/init.d/iptables stop" >>/etc/rc.local
elif [ "$ifubuntu" != "" ];then
#mv /etc/apt/sources.list /etc/apt/sources.list.bak
#cp sources.list.maverick /etc/apt/sources.list
apt-get -y update
apt-get -y install unzip build-essential libncurses5-dev libfreetype6-dev libxml2-dev libssl-dev libcurl4-openssl-dev libjpeg62-dev libpng12-dev libfreetype6-dev libsasl2-dev libpcre3-dev autoconf libperl-dev libtool
elif [ "$ifdebian" != "" ];then
#mv /etc/apt/sources.list /etc/apt/sources.list.bak
#cp sources.list.squeeze /etc/apt/sources.list
apt-get -y update
apt-get -y install unzip psmisc build-essential libncurses5-dev libfreetype6-dev libxml2-dev libssl-dev libcurl4-openssl-dev libjpeg62-dev libpng12-dev libfreetype6-dev libsasl2-dev libpcre3-dev autoconf libperl-dev libtool
fi


touch tmp.log

if [ "$ifredhat" != "" ] || [ "$ifcentos" != "" ];then
./install_set_sysctl.sh
./install_set_ulimit.sh
fi

if [ -e /dev/xvdb ]
then
./install_disk.sh
echo "---------- add disk ok ----------" >> tmp.log
else
mkdir /alidata
fi
./install_env.sh
echo "---------- env ok ----------" >> tmp.log
./install_dir.sh
echo "---------- make dir ok ----------" >> tmp.log
./install_${mysql_dir}.sh
echo "---------- ${mysql_dir} ok ----------" >> tmp.log
./install_${web_dir}.sh
echo "---------- ${web_dir} ok ----------" >> tmp.log
./install_${php_dir}_${web_dir}.sh
echo "---------- ${php_dir} ok ----------" >> tmp.log
./install_php_extension.sh
echo "---------- php extension ok ----------" >> tmp.log
./install_${vsftpd_dir}.sh
echo "---------- ${vsftpd_dir} ok ----------" >> tmp.log
#echo "<?php phpinfo();" >> /alidata/www/phpwind/p.php
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
if [ "$web" == "n" ];then
echo "/alidata/server/nginx/sbin/nginx" >> /etc/rc.local
echo "/etc/init.d/php-fpm start" >> /etc/rc.local
else
echo "/alidata/server/httpd/bin/apachectl start" >> /etc/rc.local
fi
echo "/etc/init.d/vsftpd start" >> /etc/rc.local

if [ "$ifubuntu" != "" ] || [ "$ifdebian" != "" ];then
echo 'exit 0' >> /etc/rc.local
fi


if [ "$web" == "n" ];then
/alidata/server/php/sbin/php-fpm restart
sleep 10
/alidata/server/nginx/sbin/nginx -s reload
sleep 10
else
killall httpd
sleep 10
/alidata/server/httpd/bin/apachectl start
sleep 10
fi



if [ "$ifcentos" != "" ] && [ "$machine" == "x86_64" ];then
sed -i 's/^#exclude/exclude/' /etc/yum.conf
fi


if [ "$ifcentos" != "" ] && [ "$machine" == "i386" ];then
	cp -f ./rpm_ftp/vsftpdcentosi386.conf /etc/vsftpd/vsftpd.conf
	rm -rf /etc/vsftpd/vsftpdcentosi386.conf
	/etc/init.d/vsftpd restart
	sleep 10

else
	rm -rf /etc/vsftpd/vsftpdcentosi386.conf
	/etc/init.d/vsftpd restart
	sleep 10
fi

/etc/init.d/vsftpd restart
sleep 10

echo "---------- rc init ok ----------" >> tmp.log
/alidata/server/php/bin/php -f init_mysql.php
echo "---------- mysql init ok ----------" >> tmp.log

cp /etc/profile /etc/profilebak
echo 'export PATH=$PATH:/alidata/server/mysql/bin:/alidata/server/nginx/sbin:/alidata/server/php/sbin:/alidata/server/php/bin' >> /etc/profile
source /etc/profile