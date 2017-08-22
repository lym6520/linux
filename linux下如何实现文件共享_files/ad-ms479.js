//bbs 3.22
var cloudad_type = 'ms479';
var cloudad_urls = [
'http://ad.csdn.net/adsrc/ibm-ca-x3650m4-csdnhomepage-728-90-0311.swf'
];
var cloudad_clks = [
'http://e.cn.miaozhen.com/r.gif?k=1004484&p=3yEPR0&rt=2&ns=[M_ADIP]&ni=[M_IESID]&na=[M_MAC]&o=http://ad-apac.doubleclick.net/click;h=v2|403D|0|0|%2a|k;267136994;0-0;0;92961628;31-1|1;52295615|52255153|1;;%3fhttp://www.ibm.com/systems/cn/promotion/esg/xseries/newgeneration/banner.shtml?csr=apch_cfg1_20130111_1357872811182&ck=csdn&cmp=131ff&ct=131ff10w&cr=csdn&cm=b&csot=-&ccy=cn&cpb=-&cd=2013-01-10&cot=a&cpg=off&cn=x3650_m4_csdn_homepage&csz=728*90'
];

var can_swf = (function () {
    if (document.all) swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
    else if (navigator.plugins) swf = navigator.plugins["Shockwave Flash"];
    return !!swf;
})();

function cloudad_show() {
    var rd = Math.random();
    var ad_url, log_url;
    if (rd < 0.7 && can_swf) {
        ad_url = cloudad_urls[0];

        log_url = 'http://ad.csdn.net/log.ashx';
        log_url += '?t=view&adtype=' + cloudad_type + '&adurl=' + encodeURIComponent(ad_url);
        cloudad_doRequest(log_url, true);
    }
    if (rd < 0.002) {
        ad_url = cloudad_clks[0];

        log_url = 'http://ad.csdn.net/log.ashx';
        log_url += '?t=click&adtype=' + cloudad_type + '&adurl=' + encodeURIComponent(ad_url);
        cloudad_doRequest(log_url, true);
    }
}

function cloudad_doRequest(url, useFrm) {
    var e = document.createElement(useFrm ? "iframe" : "img");

    e.style.width = "1px";
    e.style.height = "1px";
    e.style.position = "absolute";
    e.style.visibility = "hidden";

    if (url.indexOf('?') > 0) url += '&r_m=';
    else url += '?r_m=';
    url += new Date().getMilliseconds();
    e.src = url;

    document.body.appendChild(e);
}

setTimeout(function () {
    cloudad_show();
}, 1000);
