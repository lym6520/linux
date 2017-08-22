#! /bin/sh
wget http://soft.phpwind.me/web/sphinx-0.9.9.tar.gz
tar -zxvf sphinx-0.9.9.tar.gz
cd sphinx-0.9.9
./configure --prefix=/alidata/server/sphinx --with-mysql=/alidata/server/mysql --with-mysql-includes=/alidata/server/mysql/include/mysql --with-mysql-libs=/alidata/server/mysql/lib/mysql
sed -i "s/lexpat/lexpat \-liconv/g" src/Makefile
make
make install
cd ..
#���޸����е����ݿ� �˺� ���� ����Ϣ
cp -f sphinx.conf /alidata/server/sphinx/etc/sphinx.conf
cp -f sphinxc.sh /alidata/server/sphinx/bin/
cp -f ./init.d/sphinx /etc/init.d/
chmod 777 /alidata/server/sphinx/bin/sphinxc.sh
/alidata/server/sphinx/bin/indexer --all
/alidata/server/sphinx/bin/searchd
#��Ӽƻ�����
#crontab -e
#*/20 * * * * /alidata/server/sphinx/bin/sphinxc.sh


#CREATE TABLE IF NOT EXISTS `search_counter` (
#  `counterid` int(10) unsigned NOT NULL DEFAULT '0',
#  `max_doc_id` int(10) unsigned NOT NULL DEFAULT '0',
#  `min_doc_id` int(10) unsigned NOT NULL DEFAULT '0',
#  PRIMARY KEY (`counterid`)
#) ENGINE=MyISAM DEFAULT CHARSET=gbk;
