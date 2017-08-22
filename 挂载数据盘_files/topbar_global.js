(function() {
  var ua = navigator.userAgent.toLowerCase(),
    isIE = ua.match(/msie ([\d.]+)/),
    isIE6 = isIE && isIE[1] && parseInt(isIE[1]) == 6 ? true : false,
    onDOMReady = function(fn){
      var isReady=false;
      var readyList= [];
      var timer;
      var ready = function(fn) {
        if (isReady)
          fn.call( document);
        else
          readyList.push( function() { return fn.call(this);});
          return this;
        };
        var onDOMReady=function(){
        for(var i=0;i<readyList.length;i++){
          readyList[i].apply(document);
        }
        readyList = null;
      };
      var bindReady = function(evt){
        if(isReady) return;
          isReady=true;
          onDOMReady.call(window);
        if(document.removeEventListener){
          document.removeEventListener("DOMContentLoaded", bindReady, false);
        }else if(document.attachEvent){
          document.detachEvent("onreadystatechange", bindReady);
          if(window == window.top){
            clearInterval(timer);
            timer = null;
          }
        }
      };
      if(document.addEventListener){
        document.addEventListener("DOMContentLoaded", bindReady, false);
      }else if(document.attachEvent){
        document.attachEvent("onreadystatechange", function(){
          if((/loaded|complete/).test(document.readyState)){
            bindReady();
          }
        });
        if(window == window.top){
          timer = setInterval(function(){
            try{
              isReady||document.documentElement.doScroll('left');
            }catch(e){
              return;
            }
            bindReady();
          },5);
        }
      }
      return ready;
    }(),

    suffix = function() {
      if(window.location.host.indexOf('aliyun.') == -1)return '.com';
      var output =  window.location.host.replace(/^.*\.aliyun/i,'');
      if(!output)output = '.com';
      return output;
    }(),

    getCookie = function() {
      var info = {};
      var values = document.cookie.split(';');
      var pair,key;
      for(var i=0,len = values.length;i < len;i++){
        values[i] = values[i].replace(/\s/,'');
        var pair = values[i].split('=');
        info[pair[0]] = pair[1];
      }
      return info;
    },

    addStyle = function(cssText){
      if(isIE){
        document.createStyleSheet().cssText = cssText;
      }else{
        var style = document.createElement("style");
        style.type = "text/css";
        style.textContent = cssText;
        document.getElementsByTagName("head").item(0).appendChild(style);
      }
    },

    findCls = function(cls,el) {
      if(!el) {el = document.body;}
      var elements = el.getElementsByTagName("*");
      var results = [];
      for(var i=0,len=elements.length;i<len;i++){
        if((" " + elements[i].className + " ").indexOf(" " + cls + " ") > -1){
          results.push(elements[i]);
        }
      }
      return results;
    },

    getRandom = function() {
      return parseInt( (Math.random() * 1000000000) ).toString();
    },

    addEvent = function( obj, type, fn ) {
      if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
        obj.attachEvent( 'on'+type, obj[type+fn] );
      } else
        obj.addEventListener( type, fn, false );
    },
    cookie = getCookie(),
    uid = cookie['login_aliyunid'];

    if(uid) {
      uid = decodeURIComponent( uid.replace(/"/g,'') );
    }

    html = '';

  var cssText =
    '.aly-topbar-wrap{height:26px; min-width:997px;}.aly-topbar{font-size:12px;font-family:"Microsoft Yahei";background-color:rgb(0, 162, 202);color:#ffffff;height:26px;line-height:24px;position:relative;z-index:302;width:100%;left:0;-webkit-transform:translateZ(0);text-align:left !important;}.aly-topbar a{color:#ffffff;}.aly-topbar a:hover{color:#ffffff;text-decoration:none;opacity:0.8;filter:alpha(opacity=80);}.aly-topbar .inner{margin:0 auto;width:997px}.aly-topbar .inner-left{float:left}.aly-topbar .inner-left a{}.aly-topbar .inner-left a.login-uname,.aysw-topbar-uname{color:#ffffff !important;}.aly-topbar .inner-left a.has-message{position:relative;background-color:#ff6600;color:#fff;padding:0px 4px 2px 6px;margin-left: 8px;_margin-left: 0;}.aly-topbar .inner-left a.has-message b{border-width:5px;border-color:transparent #ff6600 transparent transparent;border-style:solid;_border-style:dotted solid dotted dotted;position:absolute;left:-10px;top:50%;margin-top:-5px;width:0;height:0;font-size:0px;line-height:0;}.aly-topbar .inner-right{float:right}.aly-topbar i{display:-moz-inline-stack;display:inline-block;vertical-align:middle;*vertical-align:auto;zoom:1;*display:inline;width:1px;height:12px;margin:7px 0;background:#30aed6;margin:0 10px;vertical-align:middle}.aly-topbar .site_menu{display:-moz-inline-stack;display:inline-block;*vertical-align:auto;zoom:1;*display:inline;position:relative;z-index:2}.aly-topbar .site_menu a.menu-hd{width:62px;position:relative;display:inline-block}.aly-topbar .site_menu a.menu-hd b{position:absolute;right:0px;top:10px;width:0;height:0;border-width:4px 4px;border-style:solid;border-color: #ffffff #ff9900 #ff9900 #ff9900;font-size:0;line-height:0;}#J_site_menu:hover b{border-color: #ff9900 #ff9900 #fff #ff9900 !important;top: 6px;}.aly-topbar .site_menu .menu-bd{background-color:#ffffff;border:1px solid #999999;color:#666;display:none;position:absolute;top:20px;left:-22px;width:68px;font-size:12px;padding:10px 16px}.aly-topbar .site_menu .menu-bd b{position:absolute;border-width:6px;border-style:solid;width:0;height:0;border-color:#f5f5f5 #f5f5f5 #ff6600;left:47px;top:-14px}.aly-topbar .site_menu .menu-bd li{height:25px;line-height:25px}.aly-topbar .site_menu .menu-bd li a{color:#666;}.aly-topbar .site_menu .menu-bd li a:hover{color:#000;}.aly-topbar .site_menu:hover:hover .menu-bd,.aly-topbar .site_menu:hover:focus .menu-bd,.aly-topbar .site_menu:focus:hover .menu-bd,.aly-topbar .site_menu:focus:focus .menu-bd{display:block}';
  var callbackUrl=window.location.href.indexOf('account.aliyun'+suffix)<0?'?oauth_callback=' + encodeURIComponent(window.location.href):'';

  var topbarRightHTML = [
      '<div class="inner-right" data-spm="121">',
        '<a href="http://www.aliyun' + suffix + '">首页</a>',
        '<i></i>',
        '<a href="http://i.aliyun' + suffix + '">用户中心</a>',
        '<i></i>',
        '<a href="http://console.aliyun' + suffix + '" target="_blank">管理控制台</a>',
        // '<i></i>',
        // '<a href="http://help.aliyun' + suffix + '">帮助中心</a>',
        // '<i></i>',
        // '<div class="site_menu" id="J_site_menu">',
        //   '<a href="javascript:;" target="_top" aria-haspopup="J_site_menu_list" aria-label="右键弹出菜单，tab键导航，esc关闭当前菜单" class="menu-hd">',
        //     '网站导航 <b></b>',
        //   '</a>',
        //   '<div id="J_site_menu_list" class="menu-bd">',
        //     '<ul>',
        //       '<li><a href="http://www.aliyun.com/product/">产品 • 服务</a></li>',
        //       '<li><a href="http://market.aliyun.com/">云市场</a></li>',
        //       '<li><a href="http://awdc.aliyun.com/" target="_blank">开发者大会</a></li>',
        //       '<li><a href="http://partner.aliyun.com/">合作伙伴</a></li>',
        //       '<li><a href="http://www.aliyun.com/act/webbaindex.html">备案专区</a></li>',
        //       '<li><a href="http://www.aliyun.com/customer/">客户案例</a></li>',
        //       '<li><a href="http://bbs.aliyun.com/" target="_blank">论坛</a></li>',
        //     '</ul>',
        //   '</div>',
        // '</div>',
      '</div>',
  ].join('');


  var loggedHTML = [
    '<div class="aly-topbar-wrap" data-spm="120">',
    '<div class="aly-topbar">',
      '<div class="inner">',
        '<div class="inner-left">',
          '欢迎来到阿里云，',
          '<a href="http://i.aliyun' + suffix + '" class="login-uname aysw-topbar-uname" data-lingjian="/aliyun.22.2.8">'+ uid +'</a>',
          '<i id="J_message-line"></i>',
          '<a id="J_message" href="http://i.aliyun' + suffix + '/pm/">',
            '站内信<span class="aysw-topbar-message"></span><b></b>',
          '</a><i></i>',
          '<a href="http://mail.aliyun' + suffix + '">登录阿里云邮箱</a>',
          '<i></i>',
          '<a href="https://account.aliyun' + suffix + '/logout/logout.htm'+callbackUrl+'" class="register">退出</a>',
        '</div>',
        topbarRightHTML,
      '</div>',
      '</div>',
    '</div>'].join('');


  var unloggedHTML = [
    '<div class="aly-topbar-wrap" data-spm="119">',
      '<div class="aly-topbar">',
        '<div class="inner">',
          '<div class="inner-left">',
            '欢迎来到阿里云，',
            '<a href="https://account.aliyun' + suffix + '/login/login.htm'+callbackUrl+'" class="login">登录</a>',
            '<i></i>',
            '<a href="https://account.aliyun' + suffix + '/register/register.htm'+callbackUrl+'" class="register">免费注册</a>',
            '<i></i>',
            '<a href="http://mail.aliyun' + suffix + '">登录阿里云邮箱</a>',
          '</div>',
          topbarRightHTML,
        '</div>',
      '</div>',
      '</div>'].join('');


  if(uid){
    html = loggedHTML;
  }else{
    html = unloggedHTML;
  }
  //html = '<div class="aysw-topbar">' + html + '</div>';

  addStyle(cssText);
  document.writeln(html);

  window.topbarJsonpCallback = function(data){
    if(data.code == 200) {
      var umessageEl = findCls('aysw-topbar-message',document.body)[0];
      if(data.total && umessageEl) {
        umessageEl.innerHTML = data.total;
        document.getElementById('J_message-line').style.display = 'none';
        document.getElementById('J_message').className = 'has-message';
      }
    }
  };

  if(!window.isLock) {
    var url = 'http://message.aliyun'+ suffix +'/pm/getNewTotalJsonp?callback=topbarJsonpCallback&cache='+getRandom();
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", url);
    head.appendChild(script);
  }



  // 网站导航的下拉 for ie6
  if( isIE6 ) {
    var siteMenu = document.getElementById('J_site_menu'),
    siteMenuList = document.getElementById('J_site_menu_list');
    addEvent(siteMenu,'mouseover',function() {
      siteMenuList.style.display = 'block';
    });
    addEvent(siteMenu,'mouseout',function() {
      siteMenuList.style.display = 'none';
    });
  }

  //绑定黄金令箭的事件
  onDOMReady(function() {
    addEvent(document.body,'click',function(e) {
      e =  e || window.event;
      var target = e.target || e.srcElement;
      var targetData = target.getAttribute("data-lingjian");
      targetData = targetData || target.parentNode.getAttribute("data-lingjian");
      if (targetData) {
        var lingjianImg = window.lingjianImg = new Image();
        lingjianImg.src = "http://gm.mmstat.com/" + targetData + "?cache=" + new Date().getTime();
      }
    });
  });

})();
