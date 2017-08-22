#!/bin/bash
fdisk /dev/xvdb << EOF
n
p
1


wq
EOF


mkfs.ext3 /dev/xvdb1
if [ -e /alidata ]
then
exit;
fi
mkdir /alidata

echo '/dev/xvdb1             /alidata                 ext3    defaults        1 2' >> /etc/fstab
mount -a
