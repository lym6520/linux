set fileformat=unix
#!bin/bash
# 设置开机启动自动挂载 
# 1、修改mount_94to93.sh的密码
# 2、执行命令：
# $ echo /{绝对路径}/mount_94to93.sh >> /etc/rc.d/rc.local
mount -t nfs -o rw 192.168.80.94:/home/crm/LiveBOS_Tomcat/ABS_DOCUMENT/zzxh /home/csp/livebos_abs_document <<EOF
cssac2012!
EOF
