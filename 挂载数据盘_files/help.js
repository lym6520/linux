(function() {
	AYSW.help = new Object();
	//AYSW.help.searchTip = '请用一句话简要描述您的问题，如:忘记密码怎么办？';
	AYSW.help.searchTip = '请输入问题关键字';
	AYSW.help.searchBarTip = '请用一句话简要描述您的问题';
	AYSW.help.askTip = '请用一句话简要描述您的问题，如:忘记密码怎么办？';
	Alipw.getDoc().delegate('#help_searchbar input','focus',function(e){
		var $el = $(e.currentTarget);
		$el.addClass('aysw-searchbar-focused');
		if($el.val() == AYSW.help.searchBarTip) {
			$el.val('');
		}
	});
	
	Alipw.getDoc().delegate('#help_searchbar input','blur',function(e) {
		var $el = $(e.currentTarget);
		if(!$el.val() || $el.val() == AYSW.help.searchBarTip) {
			$el.removeClass('aysw-searchbar-focused');
			$el.val(AYSW.help.searchBarTip);
		}
	});
	
	Alipw.getDoc().delegate('#help_searchbar input','keyup',function(e){
		if(e.keyCode == '13') {
			var keyword = $('#help_searchbar input').val();
			if(keyword && keyword != AYSW.help.searchBarTip){
				AYSW.help.searchKeyword(keyword);
			}
		};
	});
	
	Alipw.getDoc().delegate('#help_searchbar a','click',function(e){
		e.preventDefault();
		var $el = $(e.currentTarget);
		var keyword = $('#help_searchbar input').val();
		if(keyword && keyword != AYSW.help.searchBarTip) {
			AYSW.help.searchKeyword(keyword);
		}
	});
	
	AYSW.help.searchInputFocusHandler = function(e,el){
		var $el = $(el);
		$el.addClass('focused');
		if($el.val() == AYSW.help.searchTip) {
			$el.val('');
		}
	}
	
	AYSW.help.searchInputBlurHandler = function(e,el){
		var $el = $(el);
		if(!$el.val() || $el.val() == AYSW.help.searchTip) {
			$el.removeClass('focused');
			$el.val(AYSW.help.searchTip);
		}
	}
	
	AYSW.help.searchKeyword = function(keyword){
		if(!keyword){
			keyword = $('#help_search').val();
		}
		window.location.href = 'http://help.aliyun.com/search?keyword=' + encodeURIComponent(keyword);
	}
	
	AYSW.help.setIdIntoCookie = function() {
		if(AYSW.help.articleId) {
			var existingIds = getCookie()['aydotcom_help_existing_id'];
			var existingKeywords = getCookie()['aydotcom_help_existing_keyword'];
			if(existingIds){
				document.cookie = 'aydotcom_help_existing_id=' + existingIds + ',' + AYSW.help.articleId;
			}else{
				document.cookie = 'aydotcom_help_existing_id=' + AYSW.help.articleId;
			}
		}
		
		if(AYSW.help.keyword) {
			if(existingKeywords) {
				document.cookie = 'aydotcom_help_existing_keyword=' + existingKeywords + ',' + AYSW.help.keyword;
			}else{
				document.cookie = 'aydotcom_help_existing_keyword=' + AYSW.help.keyword;
			}
		}
	}
	
	AYSW.help.submitY = function(el) {
		if($(el).hasClass('disabled'))return;
		$('input[name=option]')[0].checked = true;
		$('#save').submit(); 
		AYSW.help.setIdIntoCookie();
	}
	
	AYSW.help.submitN = function(el) {
		if($(el).hasClass('disabled'))return;
		$('#save').submit();
		AYSW.help.setIdIntoCookie();
	}
	
	Alipw.getDoc().delegate('#help_search','keyup',function(e){
		if(e.keyCode == '13'){
			AYSW.help.searchKeyword();
		};
	});
	
	Alipw.getDoc().delegate('.treeview-node','click',function(e){
		var $el = $(e.currentTarget);
		if($el.find('i').length > 0){
			e.preventDefault();
			$el.parent().toggleClass('treeview-collapsed');
		}
	});
	
	Alipw.getDoc().delegate('.help-show-reason','click',function(e){
		e.preventDefault();
		if($(e.currentTarget).hasClass('disabled'))return;
		$(e.currentTarget).parent().parent().find('.help-message').toggleClass('c-hidden');
	});
	
	$(function(){
		var existingIds = getCookie()['aydotcom_help_existing_id'];
		var existingKeywords = getCookie()['aydotcom_help_existing_keyword'];
		var isIdExisting = false;
		var suffix = window.location.host.replace(/^.*\.aliyun/i,'');
		if(AYSW.help.articleId && existingIds){
			existingIds = existingIds.split(',');
			for(i=0,len=existingIds.length;i<len;i++){
				if(AYSW.help.articleId == existingIds[i]){
					isIdExisting = true;
					break;
				}
			}
		}else if(AYSW.help.keyword && existingKeywords){
			existingKeywords = existingKeywords.split(',');
			for(i=0,len=existingKeywords.length;i<len;i++){
				if(AYSW.help.keyword == existingKeywords[i]){
					isIdExisting = true;
					break;
				}
			}
		}
		
		if(isIdExisting){
			$('.section-y .cue,.section-n .cue').addClass('disabled');
		}
		
		var searchInput = $('#help_search');
		if(searchInput[0] && !searchInput.val()){
			searchInput.val(AYSW.help.searchTip);
		}
		
		var searchBarInput = $('#help_searchbar input');
		if(searchBarInput[0] && !searchBarInput.val()){
			searchBarInput.val(AYSW.help.searchBarTip);
		}
		
		$('.help-detail img').each(function(index,el){
			var $el = $(el);
			if($el.width() > 700){
				$el.width(700);
			}else{
				$el.bind('load',function(){
					if($el.width() > 700){
						$el.width(700);
					}
				});
			}
		});

		//机器人提问 by ransiwei 20121226
		//ComponentRenderer.renderAll(); 
		//Alipw.importClass('Alipw.Window');
		var panelDropdown = $("#panelDropdown");
		var panelDropdownList = panelDropdown.find("ul");
		var searchAsk = $('#help_ask');
		var askBtn = $('#ask-btn');
		var active = -1;
		var _dialog;

	if(searchAsk[0] && !searchAsk.val()){
			searchAsk.val(AYSW.help.askTip);
	}

	//点击提问的url
	if(!window.__askUrl){
			Alipw.loadScript({
				url:"http://help.aliyun"+suffix+"/robot/init",
				success:function(){
					if(window.__retConfig){
						var _initConfigObj = window.__retConfig.after_sales;
						window.__askUrl = _initConfigObj.robotUrl;
					}
				}
			})
	}

	var sendAsk = function(val) {
		panelDropdown.hide();
		var _windowScreen = window.screen;	
		if(window.__askUrl){
			if(val != AYSW.help.askTip){
				var _url = window.__askUrl+"&question="+encodeURIComponent(val);
			}else{
				var _url = window.__askUrl;
			}
			var winWidth = 950;
			var winHeight = 500;
			var left = parseInt((_windowScreen.width - winWidth)/2);
			var top = parseInt((_windowScreen.height - winHeight)/2);
			window.open(_url,'阿里云机器人','height=' + winHeight + ',width=' + winWidth + ',left=' + left + ',top=' + top + ',toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
		}
	};
	var suggestCallback = function(param) {
		var _html ="";
		if(param.apiIsSuccess){
		 	if(param.questions.length > 0){
				panelDropdown.show();
				$.each(param.questions,
				function(i, question){
					_html += "<li>"+question+"</li>";
				});
				panelDropdownList.html(_html); 	
			}
			else{
				panelDropdown.hide();
			}
			panelDropdownList.find('li').hover(
			function() { 
				$("li", panelDropdownList).removeClass("ac_over");
			 	$(this).addClass("ac_over"); 
				 active = $(this).index()},
			function() { 
				$(this).removeClass("ac_over");
				 }
			).click(function(e) { 
				e.preventDefault(); 
				e.stopPropagation();
				sendAsk($(this).html());
			});				
		}
	};
	var destroyCallback = function(){

	};

	var moveSelect = function(step) {
		var lis = $("li", panelDropdown);
		if (!lis) return;
		active += step;
		if (active < 0) {
			active = 0;
		} else if (active >= lis.size()) {
			active = lis.size() - 1;
		}
		lis.removeClass("ac_over");
		$(lis[active]).addClass("ac_over");
        var li = $("li.ac_over", panelDropdown)[0]; 
		var v = $.trim(li.innerHTML);
		searchAsk.val(v);
	};
	//检查字符
	var checkLengh = function(ele,maxChars){
		var maxChars = 30;
		var _em = $('.c-panel-funcarea').find("em"); 
	    if (ele.val().length > maxChars){
	        return false;
	    }else{
	        var curr = maxChars - ele.val().length; 
	        _em.html(curr.toString());
	        return true;
	    }
	}

	Alipw.getDoc().delegate('#help_ask','keyup',function(e){
		var _this = $(this);
		var _val = _this.val();
		var timer;
		checkLengh(_this,30);
			switch(e.keyCode) {
				case 38: // up
					e.preventDefault();
					moveSelect(-1);
				break;
				case 40: // down
					e.preventDefault();
					moveSelect(1);
				break;
				case 13: // return
					e.preventDefault();
					//searchAsk.val(_val);
					sendAsk(_val);
				break;
				default:
					active = -1;
					if(timer){
						clearTimeout();
					}else{
						var _mjParams = {question:_val,callback:suggestCallback};
						timer = setTimeout(function(){MJRAPI.suggest(_mjParams)},200);
					}
				break;
			}
	});
	Alipw.getDoc().delegate('#help_ask','focus',function(){
		if($(this).val() == AYSW.help.askTip){
			$(this).val('');
		}
		//foucs的时候去发起一个会话
		//if(!window.__retConfig){
		Alipw.loadScript({
			url:"http://help.aliyun"+suffix+"/robot/init",
			success:function(){
				if(window.__retConfig){
					var _initConfigObj = window.__retConfig.after_sales;
					window.__askUrl = _initConfigObj.robotUrl;
					var _initConfig = {
						robotDomain		: _initConfigObj.robotDomain,
						instanceCode	: _initConfigObj.instanceCode,
						sceneCode		: _initConfigObj.scenceCode,
						siteId			: _initConfigObj.siteId,
						contextParams	: decodeURIComponent(_initConfigObj.contextParams),
						digest			: _initConfigObj.digest
					}
		 			MJRAPI.init(_initConfig);
		 			//window.__preSales = window.__retConfig.pre_sales.robotUrl;
				}
			}
		})
		//}
	});
	Alipw.getDoc().delegate('#help_ask','blur',function(){
		if(!$(this).val() || $(this).val() == AYSW.help.askTip){
			//$el.removeClass('focused');
			$(this).val(AYSW.help.askTip);
		}
	});

	//点击提问
	askBtn.bind('click',function(e){
		//关闭连接
		//MJRAPI.destroy({callback:destroyCallback});
		e.preventDefault();
		var _val = searchAsk.val();
		sendAsk(_val);
	})
//
	});
	
	function getCookie(){
		var info = new Object();
		var values = document.cookie.split(';');
		var pair;
		var key;
		for(var i=0,len=values.length;i<len;i++){
			values[i] = values[i].replace(/\s/,'');
			var pair = values[i].split('=');
			info[pair[0]] = pair[1];
		}
		return info;
	}
})();