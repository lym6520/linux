#!/bin/sh
##���ö�ʱ����tomcat
##�༭crontab����
#crontab -u root -e 
##�����������ݣ�ÿ���賿3��ִ�б��ݲ�����
#0 3 * * * /startup-web-tomcat.sh
##��������������Ч
#/etc/init.d/crond restart

##�� ��ʱ����
#ÿ�����賿3��ִ��
#0 3 * * * SUN /startup-web-tomcat.sh
#ÿ�������һ���賿3��ִ��
#0 0 3 L * ? /startup-web-tomcat.sh

##root�û�ִ��
#ָ��tomcat binĿ¼
tomcat_bin=/home/fjgjs/server/apache-tomcat-gqzc/bin
#�л���web�û���ǿ�ƹر�tomcat
su - web -c "cd $tomcat_bin && ./shutdown-force.sh"
#�л���web�û�����tomcat
su - web -c "cd $tomcat_bin && ./startup.sh"

dateTime=`date "+%Y-%m-%d %T"`
echo "$dateTime restartup." >> run.log
