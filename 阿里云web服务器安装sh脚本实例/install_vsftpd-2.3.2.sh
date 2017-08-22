#! /bin/bash

ifrpm=$(cat /proc/version | grep -E "redhat|centos")
ifdpkg=$(cat /proc/version | grep -Ei "ubuntu|debian")

if [ "$ifrpm" != "" ];then
	yum -y install vsftpd
	cp -f ./rpm_ftp/* /etc/vsftpd/
else
apt-get install vsftpd
echo /sbin/nologin >> /etc/shells
cp -fR ./apt_ftp/* /etc/
fi
/etc/init.d/vsftpd start

chown -R www:www /alidata/www

MATRIX="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
LENGTH="9"
while [ "${n:=1}" -le "$LENGTH" ]
do
	PASS="$PASS${MATRIX:$(($RANDOM%${#MATRIX})):1}"
	let n+=1
done
echo $PASS | passwd --stdin www
sed -i s/'ftp_password'/${PASS}/g account.log