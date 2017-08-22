var RH;
if (typeof RH == "undefined") {
    RH = {};
};

if (typeof RH.Util == "undefined") {
    RH.Util = {};
};

//cross-browser event handling for IE5+,  NS6 and Mozilla
//By Scott Andrew
if(typeof addEvent != 'function') function addEvent(elm, evType, fn, useCapture) {
	if (elm.addEventListener){
	elm.addEventListener(evType, fn, useCapture);
	return true;
	} else if (elm.attachEvent){
	var r = elm.attachEvent("on"+evType, fn);
	return r;
	} else if("load" == evType && elm == window && fn != window.onload ) {
	var oldonload = window.onload;
	 if (typeof window.onload != 'function') {
	   window.onload = fn;
	 } else {
	   window.onload = function() {
	     oldonload();
	     fn();
	   }
	 }  
	} else {
	  return false;
	//alert("Handler could not be added");
	}
}

RH.Util.Date = {};
if(!RH.Util.contextPath) {
    RH.Util.contextPath = '/';
}
if(!RH.Util.loadingImage) {
    RH.Util.loadingImage = '/images/common/loadingball.gif';
}
RH.Util.SECOND_IN_MS = 1000.0;
RH.Util.MINUTE_IN_MS = RH.Util.SECOND_IN_MS*60;
RH.Util.HOUR_IN_MS = RH.Util.MINUTE_IN_MS * 60;
RH.Util.DAY_IN_MS = RH.Util.HOUR_IN_MS * 24;
RH.Util.WEEK_IN_MS = 7 * RH.Util.DAY_IN_MS;

RH.Util.Date.s_users_tz_offset_ms = 0;

RH.Util.Date.formatDate = function(/**date */ date, /** String*/ format) {
  var addZero = function(vNumber){ 
    return ((vNumber < 10) ? "0" : "") + vNumber ;
  }
  date = RH.Util.Date.createDate(date);
  var localOffsetMS = new Date(date.getTime()).getTimezoneOffset()*60*1000;
  var tzOffset = date.users_tz_offset_ms ? date.users_tz_offset_ms +localOffsetMS: RH.Util.Date.s_users_tz_offset_ms ? RH.Util.Date.s_users_tz_offset_ms+localOffsetMS : 0; 
  var tzOffsetUsed = date.users_tz_offset_ms ? date.users_tz_offset_ms : RH.Util.Date.s_users_tz_offset_ms;
  var dateAdjusted = new Date(date.getTime() + tzOffset);
    var vDay                      = addZero(dateAdjusted.getDate()); 
    var vMonth            = addZero(dateAdjusted.getMonth()+1); 
    var vYearLong         = addZero(dateAdjusted.getFullYear()); 
    var vYearShort        = addZero(dateAdjusted.getFullYear().toString().substring(3,4)); 
    var vYear             = (format.indexOf("yyyy")>-1?vYearLong:vYearShort) 
    var vHour             = addZero(dateAdjusted.getHours()); 
    var vMinute           = addZero(dateAdjusted.getMinutes()); 
    var vSecond           = addZero(dateAdjusted.getSeconds());
    var vGMT           = "GMT" + (tzOffsetUsed>=0 ? "+" : "-") + Math.abs(Math.round(tzOffsetUsed / 3600 /1000));
    var vDayS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dateAdjusted.getDay()];
    var vDateString       = format.replace(/dd/g, vDay).replace(/MM/g, vMonth).replace(/y{1,4}/g, vYear).replace(/E{1,3}/g, vDayS);
    vDateString           = vDateString.replace(/HH/g, vHour).replace(/mm/g, vMinute).replace(/ss/g, vSecond);
    vDateString           = vDateString.replace(/Z/g, vGMT);
    return vDateString 
}

RH.Util.Date.formatSimple = function(date) {
    date = RH.Util.Date.createDate(date);
	if(RH.Util.Date.formatDate(date, "yyyy-MM-dd") == RH.Util.Date.formatDate(RH.Util.Date.createDate(new Date()), "yyyy-MM-dd")) {
		return RH.Util.Date.formatDate(date, "HH:mm");
	} else {
		return RH.Util.Date.formatDate(date, "yyyy-MM-dd HH:mm");
	}
}
RH.Util.Date.getTimestampStringFromDate = function(date) {
    date = RH.Util.Date.createDate(date);
	return RH.Util.Date.formatDate(date, "yyyy-MM-dd HH:mm Z");
}

RH.Util.Date.getTimestampStringFromDateWithContext = function(date, /** Date */ context) {
    date = RH.Util.Date.createDate(date);
    context = RH.Util.Date.createDate(context);
	if(RH.Util.Date.formatDate(date, "yyyy-MM-dd") == RH.Util.Date.formatDate(context, "yyyy-MM-dd")) {
		return RH.Util.Date.formatDate(date, "HH:mm");
	} else {
		return RH.Util.Date.formatDate(date, "yyyy-MM-dd HH:mm");
	}
}
/*
RH.createISODate = function(date){
    var datestring = new Date();
    setISO8601datestring.setISO8601(date);
    return datestring;
}

RH.Util.Date.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    date.
    return date;
}
*/
RH.Util.getHumanReadableBandwdithUsage = function(bytes) {
	bytes = new Number(bytes);
	if (bytes < new Number(1024 * 1024)) {
	    return "" + Math.round(bytes / 1024) + " KB";
	}
	if (bytes < new Number(1024 * 1024 * 1024 * 100)) {
	    return "" + Math.round(bytes / 1024 / 1024) + " MB";
	}
	return "" + Math.round(bytes / 1024 / 1024 / 1024) + " GB";
}
RH.Util.getHumanReadableDuration = function(/** long */ originalDurationMS, /** int */ accuracy) {
		var isProperCaseNotLowerCase = true;
        var val = 0;
        var foundMatch = false;
        var result = "" + originalDurationMS + ' ' + (isProperCaseNotLowerCase ? "M" : "m") +"illisecond"
                + (originalDurationMS != 1 ? "s" : "");
        var info = [
                // multiplier, name, cutoff for max value to use unit
                [ 1, (isProperCaseNotLowerCase ? "M" : "m") + "illisecond",
                        RH.Util.SECOND_IN_MS * accuracy , 1],
                [ RH.Util.SECOND_IN_MS, (isProperCaseNotLowerCase ? "S" : "s") + "econd",
                        RH.Util.MINUTE_IN_MS * accuracy , 1],
                [ RH.Util.MINUTE_IN_MS, (isProperCaseNotLowerCase ? "M" : "m") + "inute",
                        RH.Util.HOUR_IN_MS * accuracy , RH.Util.SECOND_IN_MS ],
                // hour
                [ RH.Util.HOUR_IN_MS, (isProperCaseNotLowerCase ? "H" : "h") + "our",
                        RH.Util.DAY_IN_MS * accuracy  , RH.Util.MINUTE_IN_MS],
                // day
                [ RH.Util.DAY_IN_MS, (isProperCaseNotLowerCase ? "D" : "d") + "ay",
                        RH.Util.WEEK_IN_MS * accuracy , RH.Util.MINUTE_IN_MS],
                // week
                [ RH.Util.WEEK_IN_MS, (isProperCaseNotLowerCase ? "W" : "w") + "eek",
                        9999999999 , RH.Util.HOUR_IN_MS] ];
        for (var i = 0; i < info.length; i++) {
            var intervalMS = info[i][0];
            var cutOffMS = info[i][2];
            var toleranceMS = info[i][3];
            var durationMS = Math.round(originalDurationMS / new Number(toleranceMS)) * toleranceMS;
            if ((i == info.length - 1 || Math.abs(durationMS) < cutOffMS) && !foundMatch) {
                val = Math.round(new Number(durationMS) / new Number(intervalMS));
                foundMatch = true;
                result = "" + val + " " + info[i][1]
                        + (val != 1 ? "s" : "");
            }
            // exact multiplier match. e.g. on previous iteration we may have
            // settled on 180 minutes
            // but we'll go for 3 hours in preferences. 181 minutes would stay
            // 181 minutes
            if (Math.round(durationMS / intervalMS) == new Number(durationMS) / new Number(intervalMS)
            		&& durationMS > intervalMS
                    && intervalMS > 1 && durationMS > 0) {
                val = Math.round(new Number(durationMS) / new Number(intervalMS));
                if(val<1 && i>0) {
                	continue;
                }
                result = "" + val + " " + info[i][1]
                        + (val != 1 ? "s" : "");
            }
        }
        return result;
};

//RH.createDate() takes the json object we return for dates and converts it to a date.  the date object it return works with 
//Date.prototype.format which overrides the default date object formatting.  so that the date can be rendered by the 
//javascript to correctly reflect the user's time per their setting in our app (vs. their PCs timezone).
RH.Util.Date.createDate = function(date_obj){
  //if(date_obj.ms_since_epoch || date.users_tz_offset_ms) {
      //return date_obj;
  //}
  var date;
  if(!date_obj) {
      return null;
  }
  if(date_obj.ms_since_epoch){
      date = new Date(date_obj.ms_since_epoch);
  } else {
      date = new Date(date_obj);
  }
  if(date_obj.users_tz_offset_ms) { 
      date.users_tz_offset_ms = date_obj.users_tz_offset_ms;
  }
  return date;
}

//registering our error logging with onException event on ajax calls
if (typeof(Ajax) == 'object' && typeof(Ajax.Responders) == 'object' && typeof(Ajax.Responders.register) == 'function' && typeof(Ajax) == 'object' && typeof(Ajax.Request) == 'function') {
    Ajax.Responders.register({
        onException: function(request, exception) {
            var requestDetails = (typeof(request) == 'undefined' ? "" : ((typeof(request.url) == 'undefined' ? "" : " AjaxRequest - url: " + request.url + ", ") + (typeof(request.method) == 'undefined' ? "" : "method: " + request.method + ", ") + (typeof(request.body) == 'undefined' ? "" : "body: " + request.body)));
            if (typeof(exception) == 'undefined') {
                exception = {};
            }
            window.onerror((typeof(exception.message) == 'undefined' ? "" : exception.message) + requestDetails, (typeof(exception.fileName) == 'undefined' ? "" : exception.fileName), (typeof(exception.lineNumber) == 'undefined' ? "" : exception.lineNumber));
       }
    });
}

if("undefined" == typeof RH.isErrorHandlerRegistered) {
    RH.isErrorHandlerRegistered = false;
}
//binding onError event to our listener, putting logs to RH.Util.errorReportingURL
RH.lastJSErrorLogged = -1;
if("undefined" == typeof RH.originalErrorHandler) {
    RH.originalErrorHandler = null;
}

RH.stackInfo = "";
RH.addToErrorInfo = function(errorMessage) {
	if(RH.stackInfo == null || typeof RH.stackInfo == 'undefined') {
		RH.stackInfo = "";
	}
	RH.stackInfo += errorMessage + "\n";
}

RH.newErrorInfo = function(errorMessage) {
	RH.stackInfo = errorMessage + "\n";
}

RH.clearErrorInfo = function() {
	RH.stackInfo = "";
}

RH.stackInfoListObjectProperties = function(object) {
	if (object == null) {
        return " arguments[0] was null. \n";
    }
	if (typeof object != 'object') {
		return " arguments[0] was not an Object it was typeof: " + typeof object + " \n ";
	}
	var list = "";
    for ( var i in $(object)) {
		list += "<br/>" + i;
	}
    if (list == "") {
		return " No Properties found for arguments[0]. \n";
	}
    return "<a href=\"javascript:window.open('','name','height=400,width=800,scrollbars=yes').document.write(\'"+ list + "\');\">properties</a> \n";
}

if("undefined" == typeof RH.onErrorHandler) {
RH.onErrorHandler = function(message, url, lineNumber) {
    try {
        if ($ != $preserved || $$ != $$preserved) {
            message = "!!! key prototype functions missing ... !!! " + message;
        }
    } catch(e) {}
    try {
        var diff = new Date().getTime() - RH.lastJSErrorLogged;
        var stack = typeof(printStackTrace) == 'function' ? printStackTrace() : [];
        if(RH.stackInfo != null && typeof RH.stackInfo != 'undefined' && RH.stackInfo.length > 0) {
        	stack.push("\n\n-->>Extra stack info:\n " + RH.stackInfo);
        }
        var interval = 1000 * 60 * 2; //2minutes
        if (((RH.lastJSErrorLogged == -1) || (RH.lastJSErrorLogged > 0 && diff > interval)) && typeof(Ajax) != 'undefined' && typeof(Ajax.Request) != 'undefined' && typeof(RH) != 'undefined' && typeof(RH.Util) != 'undefined' && typeof(RH.Util.errorReportingURL) != 'undefined') {
            RH.lastJSErrorLogged = new Date().getTime();
            new Ajax.Request(RH.Util.errorReportingURL, {
                method: 'PUT',
                parameters : {log: message, url: url == null ? url : url.replace("#", "-hash-"), line_number: lineNumber, user_agent: navigator.userAgent, stack_trace: stack.join("\n\n").replace("#", "-hash-"), location: window.location.href.replace("#", "-hash-")},
                onSuccess : function(xhr) {
                },
                onFailure : function(xhr) {
                }
            });
        }
        if (typeof(console) !== 'undefined' && console != null && typeof(console.log) == 'function') {
            console.log('js error: message - ' + message + ", url - " + url + ", line - " + lineNumber + ", stack - " + stack);
        }
        //clears extra stackinfo
        RH.clearErrorInfo();
        if (RH.originalErrorHandler) {
            return RH.originalErrorHandler(message, url, lineNumber);
        }
    } catch(e) {
        var i=0;
    }
    return false; //to invoke browser default error handler
};
}

//binding onError event to our listener
if (!RH.isErrorHandlerRegistered && typeof(window.onerror) != 'undefined' && window.onerror != null && typeof(Ajax) == 'object' && typeof(Ajax.Request) == 'function' && RH.onErrorHandler != window.onerror) {
    RH.isErrorHandlerRegistered = true;
    RH.originalErrorHandler = window.onerror;
    window.onerror = RH.onErrorHandler;
}
