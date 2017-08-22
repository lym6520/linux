set fileformat=unix
#!/bin/bash
#by lym6520 2014-11-08
#force shutdown tomcat,copy this sh file to tomcat/bin dir

path=${PWD}

ps -ef|grep $path|grep java|awk '{print $2}'

echo "exec $path/shutdown.sh"
$path/shutdown.sh

sleep 3s

#kill -9 pid
ps -ef|grep $path|grep java|awk '{print $2}'|xargs kill -9

#success msg
echo "shutdown success"

ps -ef|grep $path|grep java|awk '{print $2}'


