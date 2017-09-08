
查看yum安装版本
rpm -qa|grep yum
卸载已安装的yum
rpm -qa|grep yum|xargs rpm -e --nodeps


安装软件包。
rpm -ivh python-iniparse-0.3.1-2.1.el6.noarch.rpm
rpm -ivh python-urlgrabber-3.9.1-11.el6.noarch.rpm
rpm -ivh yum-metadata-parser-1.1.2-16.el6.x86_64.rpm
rpm -ivh yum-plugin-fastestmirror-1.1.30-40.el6.noarch.rpm yum-3.2.29-81.el6.centos.noarch.rpm

*注释yum-plugin-fastestmirror和yum-3.2.29要一起安装。

更改yum源
cd /etc/yum.repos.d/
下载配置文件
wget http://mirrors.163.com/.help/CentOS6-Base-163.repo
将此配置文件替换/etc/yum.repos.d同名文件
修改文件中$releasever的对应版本，这里修改为6
sed -i "s;\$releasever;6;g" CentOS6-Base-163.repo



清理yum缓存
#yum clean all
将服务器软件包信息缓存至本地，提高搜索安装效率
#yum makecache

测试
#yum seach vim