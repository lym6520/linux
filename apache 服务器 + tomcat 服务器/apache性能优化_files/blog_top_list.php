
var start = 1;

var _html = '<div class="blogpopMain"><div class="l">'
          + '<a href="http://edu.51cto.com/course/course_id-3244.html" target="_blank"><img src="http://s3.51cto.com/wyfs02/M02/5B/8C/wKiom1ULj_2SBHKiAAAwDMGZ9w4025.jpg" width="105" height="105" /></a>'
          + '<p><a href="http://edu.51cto.com/course/course_id-3244.html" target="_blank">Java全系案例串讲</a></p></div>'
          + '<div class="r"><h4 style="text-align:left;"><a href="http://hcymysql.blog.51cto.com/5223301/1621218" target="_blank">Percona5.6自身已支持杀死慢SQL</a></h4>'
          + '<ul>'
          + '<li><a href="http://edu.51cto.com/course/course_id-3261.html" target="_blank">Cocos2d-Lua(quick)进阶篇教程</a></li>'
          + '<li><a href="http://wangchunhai.blog.51cto.com/225186/1620749" target="_blank"style="color:red;">为VMware ESXi主机添加本地存储</a></li>'
          + '<li><a href="http://dl528888.blog.51cto.com/2382721/1619631" target="_blank">Docker之智能添加与修改防火墙规则</a></li>'
          + '<li><a href="http://edu.51cto.com/course/course_id-3239.html " target="_blank"style="color:red;">C语言课程升华篇之打字游戏</a></li>'
          + '</ul>'
          + '</div></div>'
          + '';

jQuery('#showMessagerDim').show();

jQuery(function(){
//window.onload=function(){
   if(get_cookie('blog_top')==''&&start==1){
//	 show_pop();
	    jQuery.messager.showblogtop('', _html);
        var date=new Date();
	    var day = 1426953600000;//
	    date.setTime(day);
	    var test = date.getTime();
	    document.cookie="blog_top=yes;domain=.blog.51cto.com;expires="+date.toGMTString()+";path=/;";
    }
	jQuery("#showMessagerDim").click(function(){
		jQuery.messager.showblogtop('', _html);
		//removeIframe();
	});
//}
});


function get_cookie(Name) {
    var search = Name + "=";
    var returnvalue = "";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;

            end1 = document.cookie.indexOf(";", offset);

            if (end1 == -1)
            end1 = document.cookie.length;
            returnvalue=unescape(document.cookie.substring(offset, end1));
        }
    }
    return returnvalue;
}

