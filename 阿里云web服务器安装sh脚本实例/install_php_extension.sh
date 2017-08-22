#! /bin/sh

#memcache
if [ ! -f memcache-3.0.6.tgz ];then
	wget http://soft.phpwind.me/web/memcache-3.0.6.tgz
fi
rm -rf memcache-3.0.6
tar -xzvf memcache-3.0.6.tgz
cd memcache-3.0.6
/alidata/server/php/bin/phpize
./configure --enable-memcache --with-php-config=/alidata/server/php/bin/php-config
make
make install
cd ..


#zend_optimizer3.3.3
if [ ! -f ZendOptimizer-3.3.3-linux-glibc23-${machine}-package.tar.gz ];then
	wget http://soft.phpwind.me/web/ZendOptimizer-3.3.3-linux-glibc23-${machine}-package.tar.gz
fi
rm -rf ZendOptimizer-3.3.3-linux-glibc23-${machine}-package
tar -xzvf ZendOptimizer-3.3.3-linux-glibc23-${machine}-package.tar.gz
mv Zend /alidata/server
mv /alidata/server/php/etc/php.ini /alidata/server/php/etc/php.ini-zend_optimizer.bak
cp -f php-5.2.17.ini /alidata/server/Zend/etc/php.ini
ln -s /alidata/server/Zend/etc/php.ini /alidata/server/php/etc/php.ini
