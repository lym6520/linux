#!/bin/sh
##设置定时重启tomcat
##编辑crontab任务
#crontab -u root -e 
##输入如下内容（每天凌晨3点执行备份操作）
#0 3 * * * /startup-web-tomcat.sh
##重启，让命令生效
#/etc/init.d/crond restart

##附 定时命令
#每周日凌晨3点执行
#0 3 * * * SUN /startup-web-tomcat.sh
#每个月最后一天凌晨3点执行
#0 0 3 L * ? /startup-web-tomcat.sh

##root用户执行
#指定tomcat bin目录
tomcat_bin=/home/fjgjs/server/apache-tomcat-gqzc/bin
#切换到web用户先强制关闭tomcat
su - web -c "cd $tomcat_bin && ./shutdown-force.sh"
#切换到web用户启动tomcat
su - web -c "cd $tomcat_bin && ./startup.sh"

dateTime=`date "+%Y-%m-%d %T"`
echo "$dateTime restartup." >> run.log
