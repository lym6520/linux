var the_wea=new Array("��","����|��ת����|����ת��|��ת����","��","����ת��,С��|����,С��|����,����|��,����|��,С��|��ת����,С��|��ת����,����","����,���������|����ת��,������|����ת��,����|����,����|����,������|����ת��,С����|��,������|����,С����|��,����|����ת��,����|��,С����|��ת����,С����|��ת����,����|��ת����,������","����ת��,����|����,����|��,����|��ת����,����","����ת��,����|��,����|����,������|����,����|��,������|��ת����,����");
var a_photo=new Array("qing.gif","duoyun.gif","yin.gif","xiaoyu.gif","zhenyu.gif","dayu.gif","leizhenyu.gif");
var refs=new Array(".265.com");
var slink='<li class="w2" onclick="go_to(\'www.265.com\');">265.com</li>';
var lc="-2";
var wp="8";
function get_wea_photo(the_weather) {
for(i=0;i<the_wea.length;i++) {
    a_wea = the_wea[i].split("|");
    for(j=0;j<a_wea.length;j++) {
        if (a_wea[j] == the_weather) return a_photo[i];
    }       
}
return a_photo[0];    
}
function show_weather(city_265, weather_265, area_file) {
var i=0;
var d=new Date();
var h=d.getHours();
if(h<11){
    var the_weather = new Array("����",weather_265[1],"����",weather_265[2],weather_265[0]);
} else if(h<18){
    var the_weather = new Array("����",weather_265[2],"����",weather_265[3],weather_265[0]);
}else{
    var the_weather = new Array("����",weather_265[3],"����",weather_265[5],weather_265[4]);
}
for(var i=0;i<refs.length;i++){
if (document.referrer.indexOf(refs[i])!=-1){slink="";lc="3";break;}
}
if(the_weather[1].replace(/[^\x00-\xff]/g,"**").length>=16||the_weather[3].replace(/[^\x00-\xff]/g,"**").length>=16) wp="2";
var wea_link="www.265.com/weather/"+area_file;



document.write('<style type="text/css">body{text-align:center;font-size:12px;margin:0;padding:0;cursor:pointer;}\n#wea{width:168px;height:50px;margin:0 auto;}\nul{margin:0;padding:0;list-style:none;}\nul#wl{float:left;width:40px;text-align:center;}\n.wi{margin:'+lc+'px 0 0 0;}\n.w2{margin-top:-10px;font-size:11px;font-family: Modern,"Arial Narrow",Verdana,Geneva;text-decoration:none;color:#0075EB;}\nul#wr{float:right;width:128px;}\nul#wr li{text-align:left;line-height:16px;padding:0 0 1px '+wp+'px;}\nul#wr li.lst{padding-bottom:0;}<\/style>');
document.write('<div id="wea" title="����鿴��3���������" onclick="go_to(\''+wea_link+'\');"><ul id="wl"><li class="wi"><img border="0" src="../img/'+get_wea_photo(the_weather[1])+'" alt="'+the_weather[1]+'" width="40"></li>'+slink+'</ul><ul id="wr"><li>'+city_265+':'+the_weather[4]+'</li><li>'+the_weather[0]+':'+the_weather[1]+'</li><li class="lst">'+the_weather[2]+':'+the_weather[3]+'</li></ul></div>');
}
function go_to(url){
window.open("http://"+url);
}
