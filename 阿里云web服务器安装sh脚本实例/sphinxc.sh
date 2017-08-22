/alidata/server/sphinx/bin/indexer addthreadsindex --config /alidata/server/sphinx/etc/sphinx.conf --rotate
sleep 2
/alidata/server/sphinx/bin/indexer --merge threadsindex addthreadsindex --config /alidata/server/sphinx/etc/sphinx.conf --rotate
sleep 2
/alidata/server/sphinx/bin/indexer addtmsgsindex --config /alidata/server/sphinx/etc/sphinx.conf --rotate
sleep 2
/alidata/server/sphinx/bin/indexer --merge tmsgsindex addtmsgsindex --config /alidata/server/sphinx/etc/sphinx.conf --rotate
sleep 2
/alidata/server/sphinx/bin/indexer addmembersindex --config /alidata/server/sphinx/etc/sphinx.conf --rotate
sleep 2
/alidata/server/sphinx/bin/indexer --merge membersindex addmembersindex --config /alidata/server/sphinx/etc/sphinx.conf --rotate
sleep 2
/alidata/server/sphinx/bin/searchd  --config /alidata/server/sphinx/etc/sphinx.conf --stop
sleep 2
/alidata/server/sphinx/bin/searchd --config /alidata/server/sphinx/etc/sphinx.conf