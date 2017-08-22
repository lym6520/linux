#! /bin/bash

#phpwind
wget -O phpwind85.zip 'http://soft.phpwind.me/web/phpwind_GBK_8.7.zip'
unzip phpwind85.zip
mv phpwind_GBK_8.7/upload/* /alidata/www/phpwind/
chmod -R 777 /alidata/www/phpwind/attachment
chmod -R 777 /alidata/www/phpwind/data
chmod -R 777 /alidata/www/phpwind/html
cd /alidata/www/phpwind/
find ./ -type f | xargs chmod 644
find ./ -type d | xargs chmod 755
chmod -R 777 attachment/ html/ data/
cd -

#phpmyadmin
wget http://soft.phpwind.me/web/phpmyadmin.zip
unzip phpmyadmin.zip
mv phpmyadmin /alidata/www/phpwind/phpmyadmin

chown -R www:www /alidata/www/phpwind/