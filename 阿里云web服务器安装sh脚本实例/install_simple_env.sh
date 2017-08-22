#! /bin/sh

groupadd www
useradd -g www -M -d /alidata/www -s /sbin/nologin www


wget http://soft.phpwind.me/web/rpms/${machine}/libiconv-1.13.1-1.${machine}.rpm

rpm -ivh libiconv-1.13.1-1.${machine}.rpm

wget http://soft.phpwind.me/web/rpms/${machine}/libmcrypt-2.5.7-5.el5.${machine}.rpm

rpm -ivh libmcrypt-2.5.7-5.el5.${machine}.rpm