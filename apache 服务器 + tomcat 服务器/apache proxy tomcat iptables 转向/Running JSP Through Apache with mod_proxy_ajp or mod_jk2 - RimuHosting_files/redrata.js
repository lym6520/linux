if (typeof redrata == "undefined") {
    redrata = {};
}

if (typeof redrata.logging == "undefined") {
    log_enabled = false;
    // if logging is not setup, then define a no-op, do nothing logger

    redrata.logging = {
        showLogs : function() {
        },
        
        hideLogs : function() {
        },
            
        log : function(divId, logMessage, groupById, separator) {
        },

        outputLogs : function() {
        },

        outputLog : function(divId, logMessage, groupById, separator) {
        }
    };    
}

//redrata.logging.log("redrataJsStart", "Logs from initial processing of redrata.js - START", false, true);

redrata.sid = Math.floor(Math.random() * 1000000);

//bogus value for stupid ie as document.getElementById("") throws exception
redrata.focus = "dull_focus";

redrata.constants = (function() {
    var list = {
        'MAIL_TEXT_AREA_MIN_ROWS': 7,
        'MAIL_TEXT_AREA_MIN_COLS': 50,
        'MAIL_TEXT_AREA_MAX_ROWS': 20,
        'MAIL_TEXT_AREA_MAX_COLS': 150,
        'MAIL_TEXT_AREA_STEP' : 0
    };

    return {
       get: function(name) { return list[name]; }
   };
})();

redrata.util = {
/**
 * bunch of utility logging functions, always use redrata.util.(log||info||warn||error) instead console.(log||info||warn||error)
 */ 
isConsolePresent : function() {
    return (typeof(console) !== 'undefined' && console != null);
},
    
log : function(str) {
    if (redrata.util.isConsolePresent() && typeof(console.log) == 'function') {
        console.log(str);
    }
},

warn : function(str) {
    if (redrata.util.isConsolePresent() && typeof(console.warn) == 'function') {
        console.warn(str);
    }
},

info : function(str) {
    if (redrata.util.isConsolePresent() && typeof(console.info) == 'function') {
        console.info(str);
    }
},

error : function(str) {
    if (redrata.util.isConsolePresent() && typeof(console.error) == 'function') {
        console.error(str);
    }
},

/**
 * function to trim CDATA from string
 */ 
trimCDATA : function(str) {
    str = str.replace("<!--[CDATA[", "");
    str = str.replace("]]-->", "");
    str = str.replace("<![CDATA[", "");
    str = str.replace("]]>", "");
    return str;
},

/**
 * function to trim ja script tag from string
 */ 
trimJSScriptTag : function(str) {
    str = str.replace("<script type='text/javascript'>", "");
    str = str.replace('<script type="text/javascript">', "");
    str = str.replace("</script>", "");
    //ie speciality, it uppercases script tag and gets rid on quotes ...
    str = str.replace('<SCRIPT type=text/javascript>', "");
    str = str.replace("</SCRIPT>", "");
    return str;
},

/**
 * functions to get appropriate value from matrix params from url
 */ 
getValueFromMatrixParam : function(paramName) {
    if (window.location.href.match(paramName + "=")) {
        var urlFromParamValueTillTheEnd = window.location.href.split(paramName + "=")[1];
        var urlFromParamValueWithoutHash = urlFromParamValueTillTheEnd.split("#")[0];
        return decodeURIComponent(urlFromParamValueWithoutHash.substring(0, urlFromParamValueWithoutHash.indexOf(";") == -1?urlFromParamValueWithoutHash.length: urlFromParamValueWithoutHash.indexOf(";")));
    } else return "";
},

getCheckedFromMatrixParam : function(paramName, value) {
    if (value != null && window.location.href.match(paramName + "=" + value)) {
        return true;
    } else if (value == null && window.location.href.match(paramName + "=")) {
        return true
    } else {
        return false;
    } 
},

getCheckedIdFromMatrixParam : function(paramName, fieldIdPrefix, fieldIdPostfix) {
    if (window.location.href.match(paramName + "=")) {
        if (window.location.href.match(paramName + "=Y")) {
            return (fieldIdPrefix + 'Y' + fieldIdPostfix);
        } else if (window.location.href.match(paramName + "=N")) {
            return (fieldIdPrefix + 'N' + fieldIdPostfix);
        }
    } else {
        return (fieldIdPrefix + 'NULL' + fieldIdPostfix);
    }
},

/**
 * functions to create matrix params based on values
 */ 
createMatrixParamFromValue : function(paramName, fieldId, value) {
    if (fieldId != null && $(fieldId) != null && $(fieldId).value != null && $(fieldId).value.length != 0) {
        return (';' + paramName + '=' + encodeURIComponent($(fieldId).value));
    } else if (value != null && value.length != 0) {
        return (';' + paramName + '=' + encodeURIComponent(value));
    } else return "";
},

createMatrixParamFromCheckBox : function(paramName, fieldId, value) {
    if (fieldId != null && $(fieldId) != null && $(fieldId).checked) {
        return (';' + paramName + '=' + encodeURIComponent((value != null)?value:"Y"));
    } else return "";
},

createMatrixParamFromRadio : function(paramName, fieldIdPrefix, fieldIdPostfix) {
    var val;
    if ($(fieldIdPrefix + 'N' + fieldIdPostfix) && $(fieldIdPrefix + 'N' + fieldIdPostfix).checked) {
        val = 'N';
    } else if ($(fieldIdPrefix + 'Y' + fieldIdPostfix) && $(fieldIdPrefix + 'Y' + fieldIdPostfix).checked) {
        val = 'Y';
    } else return "";
    return (';' + paramName + '=' + val);
},

/**
 * function to set hash, if desired, stays on page position before changing the hash
 */ 
setHash : function(newHash, keepYScroll) {
    var scrOfY = redrata.util.getScrollOfElement(document.body);
    if (newHash == "") {
        newHash = "#";
    }
    window.location.hash = newHash;
    if (keepYScroll) {
        window.scroll(0, scrOfY);
    }
},

getScrollOfElement : function(el) {
    if (el == null) {
        return 0;
    }
    var scrOfY = 0;
    if( typeof( window.pageYOffset ) == 'number' ) {
        //Netscape compliant
        scrOfY = window.pageYOffset;
    } else if(el && (el.scrollLeft || el.scrollTop)) {
        //DOM compliant
        scrOfY = el.scrollTop;
    } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
        //IE6 standards compliant mode
        scrOfY = document.documentElement.scrollTop;
    }
    return scrOfY;
},

/**
 * adds subview to hash, separated by comma, gets rid of all subviews from hash containing expression from subviewToGedRidOf field items, keeps scroll
 */ 
addSubviewToHash : function (subview, subviewsToGetRidOf) {
    var hash = window.location.hash;
    if (subviewsToGetRidOf) {
        if (!Object.isArray(subviewsToGetRidOf)) {
            subviewsToGetRidOf = [ subviewsToGetRidOf ];
        }
        var subviews = hash.split(',');
        subviews && subviews.each(function(s) {
            subviewsToGetRidOf && subviewsToGetRidOf.each(function(sToDel) {
                if (s.match(sToDel)) {
                    if (hash.match(s + ',') != null) s = s + ',';
                    hash = hash.replace(s, '');
                    if (hash.charAt(hash.length - 1) == ',') {
                        hash = hash.substring(0, hash.length - 1);
                    }
                }
            });
        });
    }
    if (hash == '' || hash == '#') {
        redrata.util.setHash('#' + subview);
        return;
    }
    if (hash.match(subview) == null) {
        redrata.util.setHash(hash + ',' + subview, true);
    } else {
        redrata.util.setHash(hash, true);
    }
},

/**
 * deletes subview from hash, separated by comma, gets rid of all subviews from hash containing expression from subviewToGedRidOf field items, keeps scroll
 */
deleteSubviewFromHash : function(subview, subviewsToGetRidOf) {
    redrata.util.setHash(redrata.util.deleteSubviewFromString(window.location.hash, subview, subviewsToGetRidOf), true);
},

/**
 * deletes subview string, subview are separated by comma, gets rid of all subviews from hash containing expression from subviewToGedRidOf field items, returns modified string
 */
deleteSubviewFromString : function(string, subview, subviewsToGetRidOf) {
    var hash = string;
    if (subview != "" && hash.match(subview + ',') != null) subview = subview + ',';
    hash = hash.replace(subview, '');
    if (hash.charAt(hash.length - 1) == ',') {
        hash = hash.substring(0, hash.length - 1);
    }
    if (subviewsToGetRidOf) {
        if (!Object.isArray(subviewsToGetRidOf)) {
            subviewsToGetRidOf = [ subviewsToGetRidOf ];
        }
        var subviews = hash.split(',');
        subviews && subviews.each(function(s) {
            subviewsToGetRidOf && subviewsToGetRidOf.each(function(sToDel) {
                if (s.match(sToDel)) {
                    if (hash.match(s + ',') != null) s = s + ',';
                    hash = hash.replace(s, '');
                    if (hash.charAt(hash.length - 1) == ',') {
                        hash = hash.substring(0, hash.length - 1);
                    }
                }
            });
        });
    }
    return hash;
},

/**
 * scrolls into node view, currently usin default js implementation ...
 * @Peter replace with whatever implementation u wanna have ...
 */
scrollIntoView : function(node) {
    node.scrollIntoView();
},

/**
 * highlights element identified by id by applying given class for given period
 * if scrollIntoView set to true, also scrolls into view of element identified by id
 */
highlightId : function(id, scrollIntoView, clzzz, period) {
    if (!id || !$(id)) {
        redrata.util.error("No such id " + id);
        return;
    }
    if (!clzzz) {
        clzzz = 'rr-subview-manager-highlight';
    }
    if (!period) {
        period = 1000;
    }
    $(id).addClassName(clzzz);
    setTimeout(function() {$(id).removeClassName(clzzz)}, period);
    if (scrollIntoView) {
        redrata.util.scrollIntoView($(id));
    }
},

/**
 * return if element is visible
 */
isElementVisible : function(el) {
    return !(el.className.indexOf('rr-is-hidden') > 0 || el.style.display == 'none' || el.style.visibility == 'hidden');
},

/**
 * creates array from object and returns it
 */
createArrayFromObject : function(object) {
    if (object == null) {
        return [];
    } else
    if (!Object.isArray(object)) {
        return [object];
    } else {
        return object;
    }
},

/**
 * replaces every occurence of key by value in string or field of strings
 */
replaceAttribute : function(str, key, value) {
    if (str == null) {
        return null;
    }
    var regexp = new RegExp(key,"g");
    if (!Object.isArray(str)) {
        return str.replace(regexp, value);
    } else {
    	var a = [];
    	str && str.each(function(s, index, array) {
            a[index] = s.replace(regexp, value);
        });
        return a;
    }
},

/**
* returns caret position of focused element
*/ 
getCaretPosition : function(focusedEl) {
	var caretPos = {};
	caretPos['sel_start'] = 0;
	caretPos['sel_end'] = 0;
	try {
    	if (focusedEl != null) {
    		if (document.selection) {// IE Support
    			focusedEl.focus();
    			var sel = document.selection.createRange();
    			var offset = sel.text.length;
    			sel.moveStart ('character', -focusedEl.value.length);
    			caretPos['sel_start'] = sel.text.length;
    			caretPos['sel_end'] = caretPos['sel_start'] + offset;
    		}
    		else if (focusedEl.selectionStart || focusedEl.selectionStart == '0') { // Firefox support
    			caretPos['sel_start'] = focusedEl.selectionStart;
    			caretPos['sel_end'] = focusedEl.selectionEnd;
    		}
    	}
	} catch(err) {}
	return caretPos;
},

/**
* sets caret position of focused element
*/ 
setCaretPosition : function(focusedEl, pos){
	if (focusedEl != null) {
	    try {
    		if(focusedEl.setSelectionRange)
    		{
    			focusedEl.focus();
    			focusedEl.setSelectionRange(pos['sel_start'],pos['sel_end']);
    		}
    		else if (focusedEl.createTextRange) {
    			var range = focusedEl.createTextRange();
    			range.collapse(true);
    			range.moveEnd('character', pos['sel_start']);
    			range.moveStart('character', pos['sel_end']);
    			range.select();
    		}
	    } catch(err) {}
	}
},

// utility method to comapare pressed key with given key
isKeyCode : function(evt, code) {
    var key;
    if (window.event) {
        key = window.event.keyCode; //IE
    } else if (evt) { //Netspace, Firefox, Opera
        key = evt.which;
    } else {
        return true;
    }
    var keychar = String.fromCharCode(key);
    if (key == code) {
        return true;
    } else {
        return false;
    }   
},

//sets redrata.focus to currently focused element 
setRedrataFocusFromEvt : function(evt) {
    if (document.selection) { //ie
        try { //try catch as srcElement value will not always be there ...
            redrata.focus = window.event.srcElement.id;
        }
        catch(err) {}
    } else {
        redrata.focus = evt.target.id;
    }
    if (redrata.focus == "" || redrata.focus == "undefined") { //bogus value for stupid ie as document.getElementById("") throws exception
        redrata.focus = "dull_focus";
    }
    //redrata.util.log(redrata.focus);
},

/**
 * sometimes after we submit form, we want it to go away and display message, this function hides the form identified by formId, clears its values (if desired) and displays message
 */
formToMessage : function(formId, messageId, messageHTML, clearForm, idsToExclude) {
	var form = $(formId);
	var message = $(messageId);
	if (!form || !message) {
	    redrata.util.log('There is no element with ' + formId + ' id.');
		return;
	}
	if (clearForm) {
		redrata.util.clearFormFields(formId, idsToExclude);
	}
	if (messageHTML) {
	    message.innerHTML = messageHTML;
	}
	form.addClassName('rr-is-hidden');
	message.removeClassName('rr-is-hidden');
},

/**
 * if you call dojo.behavior.add multiple times using the same selector, you get multiple events. this can happen, e.g. if we add behaviors when the document changes. This method helps us adding the event handlers more than once. by us passing in a unique key. We will only add the event handlers if we have not seen this unique key before on this page. Using dojo.behavior.add? chance that the dojo.behavior.add code can be called more than once? e.g. after a doc refresh or in a rr-on-resource-load-js block? Then use redrata.util.addBehavior instead. That will just check we have not already added the behavior yet (quick return) else call dojo.behavior.add
 */
addBehavior2 : function(uniqueKey, /** array of selector to actions. same as per dojo.behavior.add */
mappedValues) {
    /*if (!redrata.behaviorSingleton) {
        redrata.behaviorSingleton = {};
    }
    if (redrata.behaviorSingleton[uniqueKey]) {
        //redrata.logging.log(uniqueKey, "ALREADY IN", true);
        return;
    }
    redrata.behaviorSingleton[uniqueKey] = uniqueKey;
    dojo.behavior.add(mappedValues);
    var a = dojo.behavior.apply();
    //redrata.logging.log(uniqueKey, "ADDED BEHAVIOR", true);
    return a;
    */
},


addBehavior : function(uniqueKey, /** array of selector to actions. same as per dojo.behavior.add */
    mappedValues) {
    if (!redrata.behaviorSingleton) {
        redrata.behaviorSingleton = {};
    }
    
    for (var x in mappedValues) {
        var selector = x;
        for (var y in mappedValues[x]) {
            var fn = y.replace('on', '');
            if (redrata.behaviorSingleton[uniqueKey + selector + fn]) {
                redrata.util.log(uniqueKey + selector + fn, "ALREADY IN");
                continue;
            }
            redrata.behaviorSingleton[uniqueKey + selector + fn] = uniqueKey + selector + fn;
            //redrata.util.log(selector + " " + fn + " " + mappedValues[selector][y]);
            if (fn == 'focus' || fn == 'blur') {
                if (selector.charAt(0) == '#') {
                    $$(selector)[0].on(fn, mappedValues[selector][y]);
                } else {
                    redrata.util.log("focus and blur behavior can be binded only to id");
                }
            } else {
               new Event.on($(document), fn, selector, mappedValues[selector][y]);
            }
        }
    }
},

/**
 * executes js contents of query for selector + .rr-on-resource-load-js
 */
executeOnResourceLoadJS : function(underThisSelector) {
    var scripts = $$((underThisSelector ? underThisSelector : "") + " .rr-on-resource-load-js");
    if (scripts.length == 0) {
        return;
    }
    scripts && scripts.each(function(script) {
    	// commented , maybe try if we have some problems? for now works fine in all browsers ...
    	//if (window.execScript) { //ie
    	// window.execScript(redrata.util.trimCDATA(redrata.util.trimJSScriptTag(script.innerHTML)));
    	// return;
    	// }
        if (script == null || script.length == 0 || !script.innerHTML) {
            return;
        }
		var somejavascript = eval(redrata.util.trimCDATA(redrata.util.trimJSScriptTag(script.innerHTML)));
		if (somejavascript && typeof (somejavascript) == "function") {
			somejavascript();
		}
		if (somejavascript && somejavascript.init && typeof (somejavascript.init) == "function") {
			somejavascript.init();
		}
    });
}, 

/**
 * executes js contents of query for selector + .rr-on-resource-load-js and applies behavior
 */
onPageContentHasChanged : function(underThisSelector) {
    redrata.util.executeOnResourceLoadJS(underThisSelector);
    //dojo.behavior.apply();
},

/**
 *  searches up the dom tree from an element node and finds the correct parent element
 */
getParentNode : function(itemNode, parentclass) {
    if (itemNode == null || itemNode.parentNode == null) {
         return null;
    } else if ($(itemNode).hasClassName(parentclass)) {
        return itemNode;
    } else {
        return redrata.util.getParentNode(itemNode.parentNode, parentclass);
    }
},

/**
 * sends a ajax request, if sucessful fires AjaxSuccessEvent, method successCallBack can be used for optional handling 
 */
doAjaxRequest : function(url, method, requestOptions, responseHandlingOptions) {
    requestOptions = Object.extend({
        formId /* optional (if submit of a form) */ : null,
        formParams : null,
        acceptType : "application/json",
        isSync : false,
        contentType : "application/x-www-form-urlencoded"
        
    }, requestOptions);
    if(responseHandlingOptions == null) {
        responseHandlingOptions = new redrata.responseHandlingOptions();
    }
    if(responseHandlingOptions.formidprefix ==null && requestOptions.formId!=null && requestOptions.formId.match('rrid-ajax-form-') != null) {
        responseHandlingOptions.formidprefix = requestOptions.formId.substring('rrid-ajax-form-'.length);
    }
    if(responseHandlingOptions.messageDivSelector==null && requestOptions.formId!=null) {
        var selector = "#"+requestOptions.formId + " .rr-feedback-message";
        var ele = $$(selector);
        if(ele && ele[0]) {
            responseHandlingOptions.messageDivSelector = selector;
        }
    }

    // preliminary checks
    if (typeof url !== 'string' || typeof method !== 'string') {
        redrata.util.warn('Ajax Call Aborted: At least one of the required paramters url and method has not been supplied or is of a wrong type.');
        return;
    }
    
    /*if (!responseHandlingOptions.keepErrors) {
    	$$('.rr-error-placeholder, .rr-error-message').each(function(item){item.childElements().each(function(child){child.remove();});});
    }*/

    var html_headers = {
    "Accept" : requestOptions.acceptType,
    "Content-Type" : requestOptions.contentType,
    // rob->bry this is intended to address the double-message problem (message from local and the same message from server).
    // The RR-Id is sent as an html header to the server and gets returned as a response header in the dwr sent onajaxsuccessmessage.
    // It would be helpful of all ajax requests could go through a single method (there are currently several places).
    "RR-Id" : redrata.sid
    };
    
    var parameters = '';
    // make it a form submit, otherwise a regular ajax call
    if (requestOptions.formParams) {
        parameters = requestOptions.formParams;
    } else if (requestOptions.formId) {
        parameters = Form.serialize(requestOptions.formId);
    }

    new Ajax.Request(url, {
        method: method,
        requestHeaders: html_headers, 
        parameters : parameters,
        asynchronous : !requestOptions.isSync,
        onSuccess : function(xhr) {
            /*if (!responseHandlingOptions.keepErrors) {
                $$('.rr-error').each(function(item){item.removeClassName('rr-error');});
            }*/
            redrata.messagebus.fireAjaxSuccessEvent(new redrata.onajaxsuccessmessage( {
            formSelector : requestOptions.formId ? '#' + requestOptions.formId : null,
            method : method.toUpperCase(),
            messageDivSelector : responseHandlingOptions.messageDivSelector,
            resourceURL : url,
            xhr : xhr
            }));
            if (responseHandlingOptions.successCallBack) {
                responseHandlingOptions.successCallBack(xhr.responseText);
            }
        },
        onFailure : function(xhr) {
            if (xhr.status == 0) {
                return;
            }
            if (responseHandlingOptions.isErrorPublished) {
                redrata.messagebus.fireAjaxSuccessEvent(new redrata.onajaxsuccessmessage( {
                    method : method.toUpperCase(),
                    resourceURL : url
                    }));
            }
            if (redrata.util.parseXHRAndHandleJaxRSResponse(xhr, responseHandlingOptions)) {
                return;
            }
            if (responseHandlingOptions.errorCallBack) {
                responseHandlingOptions.errorCallBack(xhr);
                return;
            }
            new redrata.feedBackLayer( {  
                message : "There was an error while performing this operation.",
                isError : true 
            });
        }
    });
},

/**
 * sends a ajax request via doAjaxRequest, useful when submitting a form
 */
doFormAjax : function(formId, method, requestOptions, responseHandlingOptions) {
    var form = $(formId);

    if (!form) {
        redrata.util.warn('Ajax Call Aborted: There is no form with the given id.');
        return;
    }
    if(responseHandlingOptions == null) {
        responseHandlingOptions = new redrata.responseHandlingOptions();
    }
    if(responseHandlingOptions.messageDivSelector==null) {
        var selector = "#"+formId + " .rr-feedback-message";
        var ele = $$(selector);
        if(ele && ele[0]) {
            responseHandlingOptions.messageDivSelector = selector;
        }
    }

    // delegate
    redrata.util.doAjaxRequest(form.action, method, requestOptions, responseHandlingOptions);
},

/**
 * parses xhr and creates and return jaxrs_response
 */
getJaxRSResponseFromXHR : function(xhr) {
    if (!xhr) {
        redrata.util.warn('error, no xhr');
        return null;
    }
    if (xhr.xhr) {
        // e.g. if we passed in 'data' from load then we really want data.xhr
        xhr = xhr.xhr;
    }
    var ct = xhr.getResponseHeader("Content-Type");
    if (!xhr.responseText || !(ct && ct.indexOf("application/json") != -1)) {
        return null;
    }
    var response = xhr.responseJSON ? xhr.responseJSON : xhr.responseText.evalJSON();
    var key;
    for (var k in response) {
        key = response[k];
        if(key.extended_error_infos || key.human_readable_message || key.response_created_time || key.status_code) {
            return key;
        }
        break;
    }
    /*if (response[key].extended_error_infos) {
        response.jaxrs_response = {
        response_type : "ERROR",
        human_readable_message : "There were validation errors.",
        payload : {
            validation_errors : response[key].extended_error_infos
        }
        };
    }*/
    if (response.jaxrs_response) {
        return response.jaxrs_response;
    }
    return null;
},

/**
 * does exactly those things after which it was named :)
 */
parseXHRAndHandleJaxRSResponse : function(xhr, responseHandlingOptions) {
    var jaxrsResponse = redrata.util.getJaxRSResponseFromXHR(xhr);
    if (!jaxrsResponse)
        return false;
    if(responseHandlingOptions == null) {
        responseHandlingOptions = new redrata.responseHandlingOptions();
    }
    redrata.util.handleJaxRSResponse(jaxrsResponse, responseHandlingOptions);
    return true;
},

/**
 * handles jaxrs response
 */
handleJaxRSResponse : function(/** jaxrsresponse json object */
jaxr, /** string */
responseHandlingOptions
) {
    if(responseHandlingOptions == null) {
        responseHandlingOptions = new redrata.responseHandlingOptions();
    }
    var msg = jaxr.human_readable_message ? jaxr.human_readable_message : "ERROR" == jaxr.response_type ? "Error" : "OK";
    /*
    if (responseHandlingOptions.feedbackmessage == null) {
        responseHandlingOptions.feedbackmessage = new redrata.feedbackmessage( {messageDivSelector : responseHandlingOptions.messageDivSelector});
    }*/
    var strangeErrors = "";
    $$('.rr-error').each(function(item){item.removeClassName('rr-error');});
    if (jaxr.extended_error_infos && jaxr.extended_error_infos.length>0) {   
    	var submitMessageDuplicated = false;
        	jaxr.extended_error_infos.each(function(item) {
                var errMsgEle = $(responseHandlingOptions.formidprefix + "errif" + item.field_name);
                if (errMsgEle) {
    				//responseHandlingOptions.inputId = responseHandlingOptions.formidprefix + "if" + item.field_name;
    				// dojo.addClass(errMsgEle,
    				// 'rr-error-message');
    				var inputWhole = redrata.util.getParentNode(errMsgEle, 'rr-input-whole');
    				if (inputWhole != null) {
    					inputWhole.addClassName('rr-error');
    				}
    				new redrata.formValidationMessage( {
    					message : item.human_readable_message,
    					inputId : responseHandlingOptions.formidprefix + "---midfix---"+ item.field_name
    				});
    				if(!submitMessageDuplicated && item.human_readable_message == jaxr.human_readable_message) {
    					submitMessageDuplicated = true;
    				}
    				// dojo.attr(errMsgEle, "innerHTML",
    				// item.human_readable_message);
                } else {
                    // for fields where we can't find an input element, add to overall form message.
                	
                    // test cases: msg + full => what
                    // "" + foo => foo
                    // foo    + "" => foo
                    // foo    + cc_number: foo => cc_number: foo
                    // foo     + cc_number: bah  => "foo   cc_number: bah"
    
                    msg = item.human_readable_message;
                    //we dont have full error message, nothing we can do
                	if (!item.full_error_message) {
                	    // foo    + "" => foo
                	    msg = item.human_readable_message;
                	} else if (!item.human_readable_message) {
                	    // "" + foo => foo
                	    msg = item.full_error_message;
                	} else if (item.full_error_message.match(msg)) {
                	    // foo    + cc_number: foo => cc_number: foo
                	    msg = item.full_error_message;
                	}
                	else {
                	    // foo     + cc_number: bah  => "foo   cc_number: bah"
                		msg = item.human_readable_message + " " + item.full_error_message;
                	}
                    if(msg != jaxr.human_readable_message) {
                        strangeErrors += msg + " ";
                    }
                }
            });
        strangeErrors = (strangeErrors.length > 0 ? " " + strangeErrors : "");
        // set focus to the field with the first validation error
        if(
            //jaxr.extended_error_infos && jaxr.extended_error_infos.length > 0 
            (responseHandlingOptions.setFocusOnErrorField==null || responseHandlingOptions.setFocusOnErrorField)) {
            // e.g. on err mesg span id='v2order-errifserver_label'
            // e.g. on whole input id='rrid-input-whole-v2order-server_label
            var field_name = jaxr.extended_error_infos[0].field_name;
            field_name = '#rrid-input-whole-'+responseHandlingOptions.formidprefix+ field_name+" * .rr-input-edit-controls";
            var els = $$(field_name);
            if(els && els.length > 0 ) {
                els[0].focus();
                // no preference?  Then we'll say, no don't scroll into view, keep it on the focussed element
                if(responseHandlingOptions.scrollFeedbackMessageIntoView ==null) {
                    responseHandlingOptions.scrollFeedbackMessageIntoView = false;
                }
            }
        }
            // wobble the submit button [and give timed error message]
            var ajxfrmid = '#rrid-ajax-form-' + responseHandlingOptions.formidprefix;
            var el = $$(ajxfrmid + " .rr-ajax-submit-op");
            if(el.length>0) {
                el = el[0];
            } else {
                el = null;
            }
            var errorNoteId = ajxfrmid.replace('#', '') + '-submit-ajax-form-error-note';
        	if (responseHandlingOptions.shakeSubmitButtonAndDisplaySubmitMessage && el != null) {    		
        		var queue = Effect.Queues.get(errorNoteId);
        		queue && queue.each(function(effect) { effect.cancel(); });
        		new Effect.Shake(el, 
        			{ 
        				duration: 0.5,
        				distance: 8,
        				queue: { position: 'end', scope: errorNoteId}
        			});   
        	}
        		if(!submitMessageDuplicated || (el && el.hasClassName('rr-show-message-upon-error'))) {
	        		if(!$(errorNoteId)) {
	        			/*dojo.create('span', 
	        				{ 
	        					'class': 'rr-preserve-content-on-ajax-reload rr-error-message',
	        					innerHTML: jaxr.human_readable_message + strangeErrors,
	        					id: errorNoteId 
	        				},
	        				dojo.query(ajxfrmid + " .rr-ajax-submit-op")[0],
	        				'after'
	        			);*/ 
	        			
	        			var node = new Element('span', { 
                                'class': 'rr-preserve-content-on-ajax-reload rr-error-message',
                                id: errorNoteId 
                                }
	        			).update(jaxr.human_readable_message + strangeErrors);
	        			$$(ajxfrmid + " .rr-ajax-submit-op")[0].insert({'after' : node});
	        			
	        		} else {
	        			$(errorNoteId).innerHTML = jaxr.human_readable_message + strangeErrors;
	        		}        		
	        		$(errorNoteId).setStyle({display: 'inline'});
	        		$(errorNoteId).setOpacity(1);     
	        		if(!el.hasClassName('rr-retain-messages')) {
		        		var fadedelay = 4 + Math.floor(jaxr.human_readable_message.length / 20); 
		        		new Effect.Fade($(errorNoteId), 
		        			{ 
		        				duration: 1.5,
		        				queue: { position: 'end', scope: errorNoteId },
		        		 		delay: fadedelay
		        			});
	        		}
        		}
    }
    
    if (responseHandlingOptions.isHumanReadableMessageDisplayed 
        //&& responseHandlingOptions.feedbackmessage != null
        ) {
        new redrata.feedBackLayer({  
            message : jaxr.human_readable_message + strangeErrors,
            isError : "ERROR" == jaxr.response_type ,
            isPerm : strangeErrors && "ERROR" == jaxr.response_type
        });
    	/*if("ERROR" == jaxr.response_type){
			new redrata.feedBackLayer({  message : jaxr.human_readable_message + strangeErrors ,isError : true});
		}*/
		
    	//redrata.util.log(responseHandlingOptions);
        //responseHandlingOptions.feedbackmessage.setMessage(msg, "ERROR" == jaxr.response_type, jaxr.response_display_duration_type, {scrollFeedbackMessageIntoView : responseHandlingOptions.scrollFeedbackMessageIntoView});
    }
    
    if (responseHandlingOptions.isRedirectingASAP && jaxr && jaxr.redirect_uri) {
        window.location.assign(jaxr.redirect_uri);
        return;
    }
},

/**
 * called when page is loaded/reloaded, shows/hides things based on the hash ... this handles when we have subview open, that it stays open after reload
 */
initViewToggle : function() {
    if (window.location.hash.match('edit-view') != null) {
        $$('.rr-read-only-view').each(function(item){item.addClassName('rr-is-hidden');});
        $$('.rr-edit-view').each(function(item){item.removeClassName('rr-is-hidden');});
    } else {
        $$('.rr-edit-view').each(function(item){item.addClassName('rr-is-hidden');});
        $$('.rr-read-only-view').each(function(item){item.removeClassName('rr-is-hidden');});
    }
    var subviewName = window.location.hash.replace("edit-view","");
    subviewName = subviewName.replace("#","");
    var subviews = subviewName.split(',');
    subviews && subviews.each(function(subview) {
          //general handling
          $$('.rr-' + subview + '-subview-div').each(function(item){item.removeClassName('rr-is-hidden');});
          $$('.rr-' + subview + '-subview-hide-div').each(function(item){item.addClassName('rr-is-hidden');});
          //special handlings 4 subviews, only the case when we use class other that rr-is-hidden in switchers
          if ((window.location.href.match("needing-work") || window.location.href.match("inbox") ||  
        		  window.location.href.match("conversation-items") ||  
        		  window.location.href.match("-in-progress-items") || window.location.href.match("-finished-items") ||
        		  window.location.href.match("in-progress")  || window.location.href.match("my-tasks") || 
        		  window.location.href.match("unassigned")) 
        		  && subview.match("edit-attribs-")) { //hackie hack
              if ($('rrcaid-attribs-for-' + subview.split("-")[2])) {
                  $('rrcaid-attribs-for-' + subview.split("-")[2]).addClassName('rrca-item-attribs');
              }
          } 
          if (subview.match("no-filter-view")) { //hackie hack 2
              $('rrcaid-conversation-display').removeClassName('grid_9');
              $('rrcaid-conversation-display').addClassName('grid_12');
              $('rrcaid-widget-bar-attribs-conversation').removeClassName('grid_9');
              $('rrcaid-widget-bar-attribs-conversation').addClassName('grid_12');
          }
          if (subview.match("details")) {
              var id = subview.split('-')[1];
              if ($('rrcaid-to-flow-over-' + id)) {
                  $('rrcaid-to-flow-over-' + id).removeClassName('rrca-message-size-changer');
              }
          }
          //special case for manage subview
          if (subview.match("^m-\\d+")) {
              var id = subview.split('-')[1];
              if ($('rrcaid-am-item-' + (id) + '-main-container')) {
                  $('rrcaid-am-item-' + (id) + '-main-container').addClassName('rrca-manage-item');
                  $('rrcaid-manage-toggler-' + id).checked = true;
              }
          }
          //function handling, when we have appropriate function for subview, we call it
          var functionName = subview.split('-')[0] + "SubviewFunction";
          var functionParam = subview.split('-').length > 1 ? subview.split('-')[1] : "no param";
          if (typeof window[functionName] == "function") {
              window[functionName](functionParam);
          }
    });
    if (window.location.hash.match('newMessage-fullscreen')) {
        $$('.rrca-new-resource-creator').each(function(item){item.addClassName('rr-is-fullscreen');});
        $$('body')[0].addClassName('rrca-remove-scroll');
    }
},

/**
 * uploads a file from input type file
 */
uploadFile : function(formId, url, url2) {
    var form = $(formId);

    // Create the iframe...
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id","upload_iframe");
    iframe.setAttribute("name","upload_iframe");
    iframe.setAttribute("width","0");
    iframe.setAttribute("height","0");
    iframe.setAttribute("border","0");
    iframe.setAttribute("style","width: 0; height: 0; border: none;");
     
    // Add to document...
    form.parentNode.appendChild(iframe);
    window.frames['upload_iframe'].name="upload_iframe";
     
    iframeId = document.getElementById("upload_iframe");
     
    // Add event...
    var eventHandler = function()  {
        if (iframeId.detachEvent) {
            iframeId.detachEvent("onload", eventHandler);
        }
        else {
            iframeId.removeEventListener("load", eventHandler, false);
        }
         
        // Message from server...
        if (iframeId.contentDocument) {
            var content = iframeId.contentDocument.documentElement;
        } else if (iframeId.contentWindow) {
            var content = iframeId.contentWindow.document;
        } else if (iframeId.document) {
            var content = iframeId.document;
        }
        
        var response = null;
        try {
            if (typeof(content.textContent) != 'undefined') {
                response = content.textContent.evalJSON();
            } else {
                response = content.innerText.replace("<textarea>", "").replace("</textarea>", "").evalJSON(); //IE
            }
        } catch(e) {
            new redrata.feedBackLayer( {  
                message : "There was an error while performing this operation.",
                isError : true 
            });
            setTimeout('iframeId.parentNode.removeChild(iframeId)', 250);
            return;
        }
        
        redrata.util.handleJaxRSResponse(response.jaxrs_response, new redrata.responseHandlingOptions({ feedbackmessage : new redrata.feedbackmessage( {
            messageDivSelector : '#rrid-ajax-form-feedback-message-image'
        }), formidprefix : formId.split('rrid-ajax-form-')[1]}));
        
        if (response.jaxrs_response.response_type == "OK") {
            if (window.location.hash.indexOf('attrib-image') > 0) {
                redrata.util.deleteSubviewFromHash("attrib-image", null);
                window.location.reload();
            }
            if (window.location.hash.indexOf('attrib-photo') > 0) {
                redrata.util.doAjaxRequest(url2, 'GET',
                    { acceptType : 'text/vnd.redrata.detail+html'}, new redrata.responseHandlingOptions({successCallBack : function(payload) {
                        redrata.util.insertPayloadForSubview('#rrid-identities', payload);
                        redrata.util.deleteSubviewFromHash(null, "attrib-photo");
                        new redrata.feedBackLayer( {  
                            message : response.jaxrs_response.human_readable_message,
                            isError : false  
                        });
                }}));
            }
        }
         
        // Del the iframe...
        setTimeout('iframeId.parentNode.removeChild(iframeId)', 250);
    }
     
    if (iframeId.addEventListener) {
        iframeId.addEventListener("load", eventHandler, true);
    }
    if (iframeId.attachEvent) {
        iframeId.attachEvent("onload", eventHandler);
    }
     
    // Set properties of form...
    form.setAttribute("target","upload_iframe");
    form.setAttribute("action", url);
    form.setAttribute("method","post");
    form.setAttribute("enctype","multipart/form-data");
    form.setAttribute("encoding","multipart/form-data");
    
    // Submit the form...
    form.submit();
    
    /*dojo.io.iframe.send( {
    contentType : "multipart/form-data",
    url : url,
    form : formId,
    handleAs : "json",
    handle : function(response, ioArgs) {
        redrata.util.handleJaxRSResponse(response.jaxrs_response, new redrata.responseHandlingOptions({ feedbackmessage : new redrata.feedbackmessage( {
            messageDivSelector : '#rrid-ajax-form-feedback-message-image'
        }), formidprefix : formId.split('rrid-ajax-form-')[1]}));
        if (response.jaxrs_response.response_type == "OK") {
            if (window.location.hash.indexOf('attrib-image') > 0) {
                redrata.util.deleteSubviewFromHash("attrib-image", null);
                window.location.reload();
            }
            if (window.location.hash.indexOf('attrib-photo') > 0) {
                redrata.util.doAjaxRequest(url2, 'GET',
                    { acceptType : 'text/vnd.redrata.detail+html'}, new redrata.responseHandlingOptions({successCallBack : function(payload) {
                        redrata.util.insertPayloadForSubview('#rrid-identities', payload);
                        redrata.util.deleteSubviewFromHash(null, "attrib-photo");
                        new redrata.feedBackLayer( {  
                            message : response.jaxrs_response.human_readable_message,
                            isError : false  
                        });
                }}));
            }
        }
    }
    });*/
},

/**
 *  clears a form's input fields as well as its associated error messages.
 */
clearFormFields : function(formId, idsToExclude) {
    if (!(typeof formId === 'string' && formId.length != 0)) {
        redrata.util.warn('parameter has to be a non-empty string!')
        return;
    }
    if (formId.indexOf('#') == 0 && formId.length > 1) {
        formId = formId.substring(1);
    }
    var form = $(formId);
    if (!form) {
        redrata.util.warn('Form with id ' + formId + ' not found.');
        return;
    }
    $$('#' + formId + ' input, #' + formId + ' textarea').each(function(node) {
        var isExcluded = false;
        idsToExclude && idsToExclude.each(function(idToExclude) {
            if (node.id == idToExclude) {
                isExcluded = true;
            }
        });
        if (!isExcluded && node.type != 'hidden' && node.type != 'button') {
            node.value = "";
        }
    });
    $$('#' + formId + ' .rr-error-placeholder, #' + formId + ' .rr-error-message').each(function(item){item.childElements().each(function(child){child.remove();});});
    $$('#' + formId + ' .rr-feedback-message.rr-error-message').each(function(node) {
        //node.className = "rr-error-message rr-is-hidden";
        node.removeClassName('rr-error-message');
        node.innerHTML = "";
    });
},

/**
 *  adjusts text area by redrata constants
 */
adjustTextAreaByRedrataConstants: function(textarea) {
    redrata.util.adjustTextArea(textarea, redrata.constants.get('MAIL_TEXT_AREA_MIN_ROWS'), 
                redrata.constants.get('MAIL_TEXT_AREA_MIN_COLS'), 
                redrata.constants.get('MAIL_TEXT_AREA_MAX_ROWS'),
                redrata.constants.get('MAIL_TEXT_AREA_MAX_COLS'),
                redrata.constants.get('MAIL_TEXT_AREA_STEP'));
},

/**
 *  adjusts text area by function parameters
 */
adjustTextArea: function(textarea, minRows, minCols, maxRows, maxCols, step) {
    var lines = textarea.value.split("\n");
    var linesCount = lines.length;
    var maxChars = 0;
    lines && lines.each(function(line) {
        maxChars = line.length> maxChars? line.length: maxChars;
    });

    if (linesCount > minRows - step) {
        textarea.rows = (linesCount > maxRows - step)? maxRows : linesCount + step;
    } else {
        textarea.rows = minRows;
    }

    if (maxChars > minCols - step) {
        textarea.cols = (maxChars > maxCols - step)? maxCols : maxChars + step;
    } else {
        textarea.cols = minCols;
    }
},

/**
 *  enables form
 */
enableForm : function(ajaxform) {
    if (ajaxform != null) {
        //dojo.query(ajaxform.formSelector).removeClass('rr-request-being-processed');
        ajaxform.setFormEnabled(true);
        ajaxform.isSaving = false;
        ajaxform.isDeleting = false;
        var id = '';
        if (redrata.ajaxformSingleton[ajaxform.formSelector.replace('#', '')]) {
            id = ajaxform.formSelector.replace('#', '');
        } else if (redrata.ajaxformSingleton[ajaxform.formSelector.replace('#', '').replace('rrid-inline-edit-widget', 'rrid-ajax-form')]) {
            id = ajaxform.formSelector.replace('#', '').replace('rrid-inline-edit-widget', 'rrid-ajax-form');
        }
        if (id != '') {   
            redrata.ajaxformSingleton[id].isSaving = false;
            redrata.ajaxformSingleton[id].isDeleting = false;
        }
    }
},

/**
 *  inserts payload to element, preserves values, focus and caret if possible, outputs feedback message
 */
insertPayload : function(elementInWhichToInsertResultSelector, payload, onajaxsuccessmessage, ajaxform) {
    if (!onajaxsuccessmessage) {
        onajaxsuccessmessage = {};
    }
    var myValues = {};
    if(!elementInWhichToInsertResultSelector) {
        return;
    }
    var items = $$(elementInWhichToInsertResultSelector);
    var element = items && items[0] ? items[0] : null;
    if(items && items.length>1) {
        redrata.util.error("got multiple elements for " + elementInWhichToInsertResultSelector);
        return;
    }
    if (!element) {
        redrata.util.error("no such element as " + elementInWhichToInsertResultSelector);
        return;
    }

    for (var index in redrata.defaultValues) {
        if ($(index)) { 
            if ($$(elementInWhichToInsertResultSelector + ' #' + index).length == 0) continue;
            var v = redrata.defaultValues[index].attrib == "value"? $(index).value : $(index).checked;
            myValues[index] = new redrata.defaultValue({attrib: redrata.defaultValues[index].attrib, value : v});
        }
    }
    var caretPos = 0;
    var focusedEl = $(redrata.focus);
    if (focusedEl != null) {
        caretPos = redrata.util.getCaretPosition(focusedEl);
    }
    
    var preservedElements = {};
    $$(elementInWhichToInsertResultSelector  + ' .rr-preserve-content-on-ajax-reload').each(function(item) {
        if (item.hasClassName('rr-error-message') && !redrata.util.isElementVisible(item)) {
          //we dont preserve stuff that has rr-error-message class and is not visible
        } else {
            preservedElements[item.id] = item.innerHTML;
        }
    });
    
    var preservedScrolls = {};
    $$(elementInWhichToInsertResultSelector  + ' textarea').each(function(item) {
    	var scroll = redrata.util.getScrollOfElement(item);
        if (scroll > 0) {
            preservedScrolls[item.id] = scroll;
        }
    });
    
    element.innerHTML = payload;
    
    for (var index in preservedElements) {
        if ($(index) == null) {
            continue;
        }
        if (index.indexOf('-submit-ajax-form-error-note') > 0) { //special case for submit error spans
            var sumbitButton = $$(elementInWhichToInsertResultSelector + " .rr-ajax-submit-op");
            if (sumbitButton == null || sumbitButton.length != 1) {
                break;
            } else {
                sumbitButton = $$(elementInWhichToInsertResultSelector + " .rr-ajax-submit-op")[0];
            }
            /*dojo.create('span', 
                { 
                    'class': 'rr-preserve-content-on-ajax-reload rr-error-message',
                    innerHTML: preservedElements[index],
                    id: index 
                },
                sumbitButton,
                'after'
            );*/
            
            var node = new Element('span', { 
                'class': 'rr-preserve-content-on-ajax-reload rr-error-message',
                id: index 
                }
            ).update(preservedElements[index]);
            sumbitButton.insert({'after' : node});
            
            $(index).setStyle({display: 'inline'});
            $(index).setOpacity(1);
            var queue = Effect.Queues.get(index);
            queue && queue.each(function(effect) { effect.cancel(); });
            new Effect.Fade($(index), 
                { 
                    duration: 1.5,
                    queue: { position: 'end', scope: index },
                    delay: 6
                });
        } else {
            $(index).innerHTML = preservedElements[index];
        }
        /*for (var id in redrata.defaultValues) {
            if (dojo.query('#' + index + ' #' + id).length == 0) continue;
            redrata.defaultValues[id].attrib == "value"? (dojo.byId(id).value = redrata.defaultValues[id].value) : (dojo.byId(id).checked = redrata.defaultValues[id].value);
        }*/
    }

    for (var index in myValues) {
        var el = $(index);
        if (el == null) {
            continue;
        }
        var newValue = myValues[index].attrib == "value"? el.value : el.checked;
        if (!onajaxsuccessmessage.isLocal && newValue != redrata.defaultValues[index].value && redrata.util.getParentNode(el, 'rr-preserve-content-on-ajax-reload') == null && $(index.replace('if', 'errif')) != null) { 
            //new value came (by someone else) for field which we were modifiing and its different from previous value and its not encapsulated in element havin rr-preserve-content-on-ajax-reload class
            $(index.replace('if', 'errif')).innerHTML = "Value of this field changed to '" + newValue + "'";
            $(index.replace('if', 'errif')).addClassName("rr-error-message");
            redrata.defaultValues[index] = new redrata.defaultValue({attrib: myValues[index].attrib, value : newValue});
        }
        if (onajaxsuccessmessage.isLocal && (newValue == myValues[index].value || el.hasClassName('rr-clean-after-success'))) {//dojo.query('#' + onajaxsuccessmessage.formSelector + " .rr-clean-after-success").length > 0)) { 
        	// this check finds out if we keep the value from server - we delete value from default values or we replace the value from default values - we keep the default value
        	// we keep value from server if reload was initiated locally and server value is same after reload or field has rr-clean-after-success class on it
        	//alert('deleting default value for ' + index + " on formselector" + onajaxsuccessmessage.formSelector);
            delete redrata.defaultValues[index]; //we delete default value of element in case of locally initiated reload and submitting the value
        }
        if (redrata.defaultValues[index] != null) { //only in case it still is in default values (touched fields)
            (myValues[index].attrib == "value") ? (el.value = myValues[index].value) : (el.checked = myValues[index].value);  //setting the value of field to the value before reload
        }
        if (el.type.match('textarea') != null) { //adjusting size of text area (if any)
            redrata.util.adjustTextAreaByRedrataConstants(el);
        }
    }

    redrata.util.onPageContentHasChanged(elementInWhichToInsertResultSelector);
    redrata.util.initViewToggle();
    var toFocus = $(redrata.focus);
    if (toFocus != null && redrata.util.getParentNode(toFocus, 'rr-is-hidden') == null) {
        toFocus.focus();
        if ((toFocus.tagName == 'INPUT' || toFocus.tagName == 'TEXTAREA') && toFocus.innerHTML != focusedEl.innerHTML) { // if elements changed, we refresh just caret, not selection
        	caretPos['sel_end'] = caretPos['sel_start'];
        }
        redrata.util.setCaretPosition(toFocus, caretPos);
    }
    
    for (var index in preservedScrolls) {
        var el = $(index);
        if (el == null || !redrata.util.isElementVisible(el)) {
            continue;
        }
        el.scrollTop = preservedScrolls[index];
    }

    if (onajaxsuccessmessage.jaxRSResponse) {
        var feedbackmessage = new redrata.feedbackmessage( {
            messageDivSelector : onajaxsuccessmessage.messageDivSelector
        });
        redrata.util.handleJaxRSResponse(onajaxsuccessmessage.jaxRSResponse, new redrata.responseHandlingOptions({feedbackmessage : feedbackmessage}));
    }
    //if(ajaxform) {
      //  redrata.util.enableForm(ajaxform);
    //}
},

/**
 *  inserts payload to element, preserves values, focus and caret if possible
 */
insertPayloadForSubview : function(elementInWhichToInsertResultSelector, payload) {
    if(!elementInWhichToInsertResultSelector) {
        return;
    }
    var items = $$(elementInWhichToInsertResultSelector);
    var element = items && items[0] ? items[0] : null;
    if(items && items.length>1) {
        redrata.util.error("got multiple elements for " + elementInWhichToInsertResultSelector);
        return;
    }
    if (!element) {
        redrata.util.error("no such element as " + elementInWhichToInsertResultSelector);
        return;
    }
    
    var caretPos = 0;
    var focusedEl = $(redrata.focus);
    if (focusedEl != null) {
        caretPos = redrata.util.getCaretPosition(focusedEl);
    }
    
    element.innerHTML = payload;
    
    var toFocus = $(redrata.focus);
    if (toFocus != null && redrata.util.getParentNode(toFocus, 'rr-is-hidden') == null) {
        toFocus.focus();
        if ((toFocus.tagName == 'INPUT' || toFocus.tagName == 'TEXTAREA') && toFocus.innerHTML != focusedEl.innerHTML) { // if elements changed, we refresh just caret, not selection
        	caretPos['sel_end'] = caretPos['sel_start'];
        }
        redrata.util.setCaretPosition(toFocus, caretPos);
    }
    
    redrata.util.onPageContentHasChanged(elementInWhichToInsertResultSelector);
    //redrata.util.initViewToggle();
},

//utility method, gets id, creates inline edit, return id
initInplaceEdit : function(evt) {
    var node = evt.target;
    while (true) {
        node = node.parentNode; 
        if (node.id && (node.id.match('rrid-inline-edit-widget') != null)) {
            break; 
        }
    }
    var id = node.id;
    if (!redrata.inplaceceditSingleton[id]) {
        redrata.inplaceceditSingleton[id] = new redrata.inplaceedit( {
            widgetSelector : "#" + id
        });
    }
    return id;
},

//utility method, gets id, creates ajaxForm, return id
initAjaxForm : function(evt, shakeSubmitButtonAndDisplaySubmitMessage) {
    var node = evt.target;
    while (true) {
        node = node.parentNode;
        if(node == null) {
            if(evt)
                Event.stop(evt);
            redrata.util.warn('source of the event ' + evt.target.id + " does not appear to be an ajax form.  Ignoring.");            
            return;
        }
        if (node.id && (node.id.match('rrid-ajax-form') != null || node.id.match('rrid-inline-edit-widget') != null)) {
            break; 
        }
    }
    var formId = node.id;
    var isSaving = false;
    var isDeleting = false;
    if (redrata.ajaxformSingleton[formId]) {
        isSaving = redrata.ajaxformSingleton[formId].isSaving;
        isDeleting = redrata.ajaxformSingleton[formId].isDeleting;
    }
    // bry->fed TODO is this comment yours?  dont we need to leave it in to prevent mem leaks
        redrata.ajaxformSingleton[formId] = new redrata.ajaxform( {
            formSelector : "#" + formId,
            shakeSubmitButtonAndDisplaySubmitMessage : true,
            isSaving : isSaving,
            isDeleting : isDeleting
        });
    //}
    if (evt)
        Event.stop(evt);
    return formId;
},

// basic feedback layer message redrata.util.feedBackMsg("hello :-)");
feedBackMsg : function(arg){
	new redrata.feedBackLayer( {  
		message : arg
	});
}
};

/** ************ADD ON LOAD **************************** */

document.observe("dom:loaded", function() {
    redrata.util.initViewToggle();
});

Event.observe(window, "load", function() {
    if (typeof dwr != "undefined") {
        //dwr's reverse ajax is used to receive events from other pages via the server
        dwr.engine.setActiveReverseAjax(true);
        dwr.engine.setErrorHandler(function(message) {
            redrata.util.warn( message);
        });

    }
    //redrata.util.onPageContentHasChanged();
	//redrata.util.initViewToggle();
    var elementsToBeFocused = $$(".rrca-focus-on-load");
    if (elementsToBeFocused && elementsToBeFocused.length > 0) {
        elementsToBeFocused[0].focus();
    }
});

/** *****************INPLACEEDIT*********************** */

redrata.inplaceedit = Class.create({
initialize : function(arguments) {
    Object.extend(this, arguments);
    var inlineedit = this;

    var mappedValues = {};
    var s = inlineedit.widgetSelector + ' .rr-inline-edit-initiate-edit-op';
    var elems = $$(s);
    
    if (!elems || elems.length == 0) {
        redrata.util.info("could not find the initiate edit link " + s + ". the inline editor may have been set to read only on purpose.");
    }
    
    /* not used anymore, now inplace edits are created dynamically
    mappedValues[s] = {
        onclick : function(evt) {
            inlineedit.showEditView(evt);
        }
    };
    
    mappedValues[inlineedit.widgetSelector + ' .rr-cancel-op'] = {
        onclick : function(evt) {
            inlineedit.showDisplayView(evt);
        }
    };

    redrata.util.addBehavior(inlineedit.widgetSelector + " inline edit widget", mappedValues);
    */
    inlineedit.showDisplayView();
},
showEditView : function(evt) {
    var inlineedit = this;
    if (evt) {
        Event.stop(evt);
    }
    redrata.util.addSubviewToHash(inlineedit.widgetSelector.replace("#rrid-inline-edit-widget-", ""), "attrib-");
    $$(".rr-inline-edit-widget .rr-inline-edit-edit-view").each(function(item){item.addClassName('rr-is-hidden');});
    $$(".rr-inline-edit-widget .rr-inline-edit-readonly-view").each(function(item){item.removeClassName('rr-is-hidden');});
    $$(inlineedit.widgetSelector + ' .rr-inline-edit-readonly-view').each(function(item){item.addClassName('rr-is-hidden');});
    $$(inlineedit.widgetSelector + ' .rr-inline-edit-edit-view').each(function(item){item.removeClassName('rr-is-hidden');});
    var inputs = $$(inlineedit.widgetSelector + " .rr-input-edit-controls");
    if (inputs != null && inputs.length != 0) {
        inputs[0].focus();
    }
    // stop # being changed
    //dojo.focus(inlineedit.widgetForm);
},
showDisplayView : function(evt) {
    // stop # being changed
    if (evt) {
        Event.stop(evt);
    }
    var inlineedit = this;
    /*dojo.query(inlineedit.widgetSelector + ' .rr-error-placeholder').each(function(item) {
        item.innerHTML = "";
        dojo.removeClass(item, "rr-error-message");
    });
    var inputField = dojo.byId(redrata.util.getParentNode(evt.target, 'rr-ajax-form').id + " .rr-input-edit-controls");
    if (redrata.defaultValues[inputField.id] != null) {
        inputField.value = redrata.defaultValues[inputField.id];
        redrata.defaultValues[inputField.id] = null;
    } */
    redrata.util.deleteSubviewFromHash(inlineedit.widgetSelector.replace("#rrid-inline-edit-widget-", ""), null);
    $$(inlineedit.widgetSelector + ' .rr-inline-edit-edit-view').each(function(item){item.addClassName('rr-is-hidden');});
    $$(inlineedit.widgetSelector + ' .rr-inline-edit-readonly-view').each(function(item){item.removeClassName('rr-is-hidden');});
},
doCancel : function(evt) {
    var inlineedit = this;
    inlineedit.showDisplayView();
}
}); // InPlaceEdit class definition

/* auto-create inplaceedit objects for each .rr-inline-edit-widget */
/* not used anymore, now inplace edits are created dynamically
dojo.behavior.add( {
    '.rr-inline-edit-widget.rr-auto-instantiate' : {
        found : function(evt) {
            var id = evt.id; //FED:singleton added
            if (!redrata.inplaceceditSingleton) {
                redrata.inplaceceditSingleton = {};
            }
            if (redrata.inplaceceditSingleton[id]) {
                return;
            }
            redrata.inplaceceditSingleton[id] = id;
            new redrata.inplaceedit( {
                widgetSelector : "#" + id
            });
        }
    }
}); */

if (!redrata.inplaceceditSingleton) {
    redrata.inplaceceditSingleton = {};
}

redrata.util.addBehavior('inplace edit - initiate edit op', {
    '.rr-inline-edit-initiate-edit-op' : {
        onclick : function(evt) {
            redrata.inplaceceditSingleton[redrata.util.initInplaceEdit(evt)].showEditView(evt);
            }
        }
});

redrata.util.addBehavior('inplace edit - cancel edit op', {
    '.rr-inline-edit-initiate-cancel-op' : {
        onclick : function(evt) {
            redrata.inplaceceditSingleton[redrata.util.initInplaceEdit(evt)].showDisplayView(evt);
            }
        }
});

redrata.formValidationMessage = Class.create({
	message : "",
	fadeOut : null,
	inputId : null,
	event : null,
	initialize : function(args) {
		Object.extend(this, args);
		var obj = this;
		var ifId = obj.inputId.replace("---midfix---", "if");
		var errifId = obj.inputId.replace("---midfix---", "errif");
		if ($(ifId + "-error-span")) {
			$(ifId + "-error-span").remove();
		}
		var positioningNode = $(errifId);
        var errorSpan = new Element('span', { 
            id: ifId + "-error-span"
            }
        ).update(obj.message);
        if (!positioningNode) {
            positioningNode = $(ifId);
            positioningNode.insert({'after' : errorSpan});
        } else {
            positioningNode.update("");
            positioningNode.insert(errorSpan);
            positioningNode.removeClassName('rr-is-hidden');
        }
		errorSpan.addClassName("rr-error-message");
			Event.on($(ifId), 'keyup',function(e) {
				var errSpan =  $(e.target.id + "-error-span");
					if (errSpan) {
						$(e.target.id).focus();
						var inputWhole = redrata.util.getParentNode(errSpan, 'rr-input-whole');
						if (inputWhole != null) {
							inputWhole.removeClassName('rr-error');
						}
						var queue = Effect.Queues.get(errSpan.id);
						queue && queue.each(function(effect) { effect.cancel(); });
						
				        new Effect.Opacity(errSpan, { from: 1.0, to: 0, duration: 0.5,afterFinish: function(){
	                    	 var o = $(e.target.id + "-error-span");
	                         if (o) {
	                             o.remove();
	                         }
	                    }});
					}
				Event.stopObserving($(ifId), 'keyup');
			});
		}
});



redrata.feedbackmessage = Class.create({
messageDivSelector : '.rr-feedback-message',
initialize : function(arguments) {
    var feedbackmessage = this;
    Object.extend(this, arguments);
    if (!feedbackmessage.messageDivSelector) {
        feedbackmessage.messageDivSelector = '.rr-feedback-message';
    }
},
setReloadMessage : function(msg, reloadIconDivId) {
    if (typeof(msg) !== 'string' || msg == null) {
        msg = 'The content of this page has changed. Please refresh the page to see the updated content.';
    }
    if (typeof(reloadIconDivId) === 'string' && reloadIconDivId.length > 0) {
        $(reloadIconDivId).removeClassName('rr-is-hidden');
    }
    this.setMessage(msg, false);
},
setInfoMessage : function(msg) {
    this.setMessage(msg, false);
},
setErrorMessage : function(msg) {
    this.setMessage(msg, true);
},
setMessage : function(msg, isError, response_display_duration_type, responseHandlingOptions) {
    var fm = this;
    if (!response_display_duration_type) {
        response_display_duration_type = 'PERMANENT';
    }
    fm.item = $$(fm.messageDivSelector);
    if (!fm.item || !fm.item[0])
    	fm.item = $$("rr-feedback-message");
    if (!fm.item || !fm.item[0])
    	return;
    
    fm.item[0].update(msg);
    fm.item[0].addClassName(isError?'rr-error-message':'rr-info-message');
    fm.item[0].removeClassName(isError?'rr-info-message':'rr-error-message');
    fm.item[0].removeClassName('rr-is-hidden');
    
    if(response_display_duration_type != 'PERMANENT'){
    	new Effect.Opacity(fm.item[0], { delay:7,from: 1.0, to: 0, duration: 0.7,afterFinish: function(){
    		fm.item[0].addClassName("rr-is-hidden");
            }
       })
    }
    if(!responseHandlingOptions || responseHandlingOptions.scrollFeedbackMessageIntoView ==null || responseHandlingOptions.scrollFeedbackMessageIntoView) { 
        redrata.util.scrollIntoView(fm.item[0]);
    }}
});

/** *******************AJAX FORM********************************** */
redrata.ajaxform = Class.create({
/* one of PUT, DELETE, POST, etc */
httpMethod : null,
headers : {
"Accept" : "application/json",
"Content-Type" : "application/x-www-form-urlencoded",
"RR-Id" : redrata.sid
},
initialize : function(arguments) {
    Object.extend(this, arguments);
    var ajaxform = this;

    ajaxform.formSelector = ajaxform.formSelector || '#rrid-ajax-form-' + ajaxform.prefix;
    {
        var elems = $$(ajaxform.formSelector + " .rr-form-selector");
        if (elems && elems[0] && elems[0].value) {
            ajaxform.formSelector = elems[0].value;
        }
    }

    if (!ajaxform.httpMethod) {
        var elems = $$(ajaxform.formSelector + " .rr-http-method");
        if (elems && elems[0] && elems[0].value) {
            ajaxform.httpMethod = elems[0].value;
        }
    }
    ajaxform.httpMethod = ajaxform.httpMethod || 'PUT';
    if (!ajaxform.url) {
        var elems = $$(ajaxform.formSelector + " .rr-rest-url");
        if (elems && elems[0] && elems[0].value) {
            ajaxform.url = elems[0].value;
        }
    }
    if (!ajaxform.isRedirectingASAP) {
        var elems = $$(ajaxform.formSelector + " .rr-is-redirecting-asap");
        if (elems && elems[0] && elems[0].value) {
            ajaxform.isRedirectingASAP = elems[0].value;
        }
    }
    if (!ajaxform.prefix) {
        var elems = $$(ajaxform.formSelector + " .rr-form-fieldid-prefix");
        if (elems && elems[0] && elems[0].value) {
            ajaxform.prefix = elems[0].value;
        }
    }
    if (!ajaxform.messageDivSelector) {
        var elems = $$(ajaxform.formSelector + " .rr-feedback-message-selector");
        if (elems && elems[0] && elems[0].value) {
            ajaxform.messageDivSelector = elems[0].value;
        }
    }
    ajaxform.messageDivSelector = ajaxform.messageDivSelector || '#rrid-ajax-form-feedback-message-' + ajaxform.prefix;
    /*do { //FED: commented out as no longer needed (likely)
        var mappedValues = {};
        mappedValues[ajaxform.formSelector + " .rr-ajax-submit-op"] = {
            onclick : function(evt) {
                if (evt)
                    dojo.stopEvent(evt);
                ajaxform.doSave(evt);
            }
        };
        mappedValues[ajaxform.formSelector] = {
        onsubmit : function(evt) {
            if (evt)
                dojo.stopEvent(evt);
            ajaxform.doSave(evt);
        },
        onkeypress : function(evt) {
            ajaxform.onFormKeyPress(evt);
        }
        };
        mappedValues[ajaxform.formSelector + " .rr-delete-op"] = {
            onclick : function(evt) {
                if (evt)
                    dojo.stopEvent(evt);
                ajaxform.doDelete(evt);
            }
        };
        redrata.util.addBehavior(ajaxform.formSelector + " ajax form", mappedValues);
    } while (false); */
    ajaxform.feedbackmessage = new redrata.feedbackmessage( {
        messageDivSelector : ajaxform.messageDivSelector
    });
},
setFormEnabled : function(isEnabled) {
    var ajaxform = this;
    var vals = $$(ajaxform.formSelector + " .rr-ajax-submit-op");
    vals.each(function(item) {
        item.disabled = !isEnabled;
    });
},
getForm : function() {
    // using this getForm rather than storing the actual dom element, since the actual dom element 
    // that a given selector will return may change between document reloads.  (since we are re-inserting html).
    // and the symptom you'd see/saw was no form variables passed to the server side.  form contents ignored.
    var ajaxform = this;
    // #foobar form
    var elems = $$(ajaxform.formSelector + ' form');
    if (elems && elems.length == 1) {
        return elems[0];
    }
    // form#foobar
    var elems = $$('form' + ajaxform.formSelector);
    if (elems && elems.length == 1) {
        return elems[0];
    }
    redrata.util.error( "could not figure out the form element for " + ajaxform.formSelector);
    return null;
},
/*onFormKeyPress : function(evt) {
    switch (evt.keyCode) {
    case dojo.keys.ENTER:
        // prevent an enter key doing an actual form post resulting in page changing.
        // rather we want the js handlers to handle things (with the only exception of text areas to be hable to have multiple lines)
        if (evt.target.type == 'textarea') {
            return;
        }
        dojo.stopEvent(evt);
        return false;
    }
},*/

onSuccessHandler : function(xhr, subviewName) {
    redrata.logging.log("onSuccess " + new Date().getTime(), "onSuccess", false, false);
    
    $$('.rr-error').each(function(item){item.removeClassName('rr-error');});
    $$(this.formSelector).each(function(item){item.removeClassName('rr-request-being-processed');});
    $$(this.formSelector + ' .rr-error-placeholder').each(function(child){child.update("");});
    $$(this.formSelector + ' .rr-error-placeholder').each(function(item){item.removeClassName('rr-error-message');});
    
    var jaxrs_response = redrata.util.getJaxRSResponseFromXHR(xhr);

    if (subviewName != null) {
        redrata.util.deleteSubviewFromHash(subviewName); 
    }
    
    if (!jaxrs_response || !jaxrs_response.redirect_uri || jaxrs_response.redirect_uri.length <= 0) {
        // if we are about to redirect away, keep the form disabled.
        redrata.util.enableForm(this);
    }
    
    new redrata.feedBackLayer( {  
        message : jaxrs_response.human_readable_message,
        isError : false  
    });
    
    if (redrata.util.parseXHRAndHandleJaxRSResponse(xhr, new redrata.responseHandlingOptions({ formidprefix : this.prefix, feedbackmessage : this.feedbackmessage, shakeSubmitButtonAndDisplaySubmitMessage : this.shakeSubmitButtonAndDisplaySubmitMessage, isRedirectingASAP : this.isRedirectingASAP}))) {
    } else {
        this.feedbackmessage.setInfoMessage("Saved");
    }
    
    redrata.messagebus.fireAjaxSuccessEvent(new redrata.onajaxsuccessmessage( {
    formSelector : this.formSelector,
    method : this.httpMethod,
    messageDivSelector : this.feedbackmessage.messageDivSelector,
    resourceURL : this.url,
    xhr : xhr
    }), this);
},

onFailureHandler : function (xhr) {
    redrata.logging.log("onFailure " + new Date().getTime(), "onFailure", false, false);

    $$('.rr-error').each(function(item){item.removeClassName('rr-error');});
    $$(this.formSelector).each(function(item){item.removeClassName('rr-request-being-processed');});
    $$(this.formSelector + ' .rr-error-placeholder').each(function(child){child.update("");});
    $$(this.formSelector + ' .rr-error-placeholder').each(function(item){item.removeClassName('rr-error-message');});
    
    var jaxrs_response = redrata.util.getJaxRSResponseFromXHR(xhr);

    for (var i in redrata.messagebus.connections) {
        var isMatch = redrata.messagebus.connections[i].isMatch;

        if (isMatch(null, this.url, this.httpMethod)) {
            var err = redrata.messagebus.connections[i].error;
            err(this.url, this.httpMethod);
        }
    }
    if (redrata.util.parseXHRAndHandleJaxRSResponse(xhr, new redrata.responseHandlingOptions({formidprefix: this.prefix, feedbackmessage : this.feedbackmessage, shakeSubmitButtonAndDisplaySubmitMessage : this.shakeSubmitButtonAndDisplaySubmitMessage, isRedirectingASAP : this.isRedirectingASAP}))) {
        // then the message will be fine.  nothing extra needed.
    } else {
        // else some random response.
        new redrata.feedBackLayer( {  
            message : "There was an error while performing this operation.",
            isError : true 
        });
    }
    
    if (!jaxrs_response || !jaxrs_response.redirect_uri || jaxrs_response.redirect_uri.length <= 0) {
        // if we are about to redirect away, keep the form disabled.
        redrata.util.enableForm(this);
    }
},

onCompleteHandler : function(xhr) {
    var message = "";
    switch (xhr.status) {
    case 200:
        message = "Good request.";
        break;
    case 404:
        message = "The requested page was not found";
        break;
    case 406:
        message = "Not acceptable.";
        break;
    case 500:
        message = "The server reported an error.";
        break;
    default:
        message = "Status code is " + xhr.status;
    }
    redrata.logging.log("onComplete " + new Date().getTime(), "onComplete - " + message, false, false);
},



doSave : function(evt, subviewName) {
	redrata.waitForActions(evt);
    if (evt) {
        Event.stop(evt);
    }
    var ajaxform = this;
    if (ajaxform.isSaving || ajaxform.isDeleting) {
        return;
    }
    
    //manage_multiple: support for dynamic urls, if url starts with function: then following is used as 
    //function name which is called and should return url
    if (ajaxform.url.match("^function:")) {
        var functionName = ajaxform.url.split("function:")[1];
        if (typeof window[functionName] == "function") {
             var resp = window[functionName](ajaxform.formSelector);
             if (resp.match('^Problem - ')) {
                 new redrata.feedBackLayer( {  
                     message : resp.split('Problem - ')[1],
                     isError : true 
                 });
                 redrata.cancelWaitForActions(evt);
                 return;
             }
             ajaxform.url = resp;
        } else {
            new redrata.feedBackLayer( {  
                message : 'There was an error while performing this operation.',
                isError : true 
            });
            redrata.cancelWaitForActions(evt);
            return;
        }
    }
    
    ajaxform.setFormEnabled(false);
    ajaxform.isSaving = true;
    $$(ajaxform.formSelector).each(function(item){item.addClassName('rr-request-being-processed');});
    //ajaxform.feedbackmessage.setInfoMessage("Saving...");
    
    var messagebus = redrata.messagebus;

    for (var i in messagebus.connections) {
        var isMatch = messagebus.connections[i].isMatch;

        if (isMatch(null, ajaxform.url, ajaxform.httpMethod)) {
            var init = messagebus.connections[i].init;
            init(ajaxform.url, ajaxform.httpMethod);
        }
    }
    
    var deferred = new Ajax.Request(ajaxform.url, {
    method : ajaxform.httpMethod,
    parameters : Form.serialize(ajaxform.getForm()),
    requestHeaders : ajaxform.headers,
    //contentType : ajaxform.headers["Content-Type"],
    onSuccess : function(xhr) {  
        /*
        redrata.logging.log("onSuccess " + new Date().getTime(), "onSuccess", false, false);
        $$('.rr-error').each(function(item){item.removeClassName('rr-error');});
        $$(ajaxform.formSelector).each(function(item){item.removeClassName('rr-request-being-processed');});
        $$(ajaxform.formSelector + ' .rr-error-placeholder').each(function(item){item.childElements().each(function(child){child.remove();});});
        $$(ajaxform.formSelector + ' .rr-error-placeholder').each(function(item){item.removeClassName('rr-error-message');});
        var jaxrs_response = redrata.util.getJaxRSResponseFromXHR(xhr);
		new redrata.feedBackLayer( {  
			message : jaxrs_response.human_readable_message,
			isError : false  
		});
        if (redrata.util.parseXHRAndHandleJaxRSResponse(xhr, new redrata.responseHandlingOptions({ formidprefix : ajaxform.prefix, feedbackmessage : ajaxform.feedbackmessage, shakeSubmitButtonAndDisplaySubmitMessage : ajaxform.shakeSubmitButtonAndDisplaySubmitMessage, isRedirectingASAP : ajaxform.isRedirectingASAP}))) {
        } else {
            ajaxform.feedbackmessage.setInfoMessage("Saved");
        }
        redrata.messagebus.fireAjaxSuccessEvent(new redrata.onajaxsuccessmessage( {
        formSelector : ajaxform.formSelector,
        method : ajaxform.httpMethod,
        messageDivSelector : ajaxform.feedbackmessage.messageDivSelector,
        resourceURL : ajaxform.url,
        xhr : xhr
        }), ajaxform);
        if (subviewName != null) {
            redrata.util.deleteSubviewFromHash(subviewName); 
        }
        if (!jaxrs_response.redirect_uri || jaxrs_response.redirect_uri.length <= 0) {
            // if we are about to redirect away, keep the form disabled.
            redrata.util.enableForm(ajaxform);
        }*/
        ajaxform.onSuccessHandler(xhr, subviewName);
    },
    onFailure : function(xhr) {
        /*
        redrata.logging.log("onFailure " + new Date().getTime(), "onFailure", false, false);
        
        var jaxrs_response = redrata.util.getJaxRSResponseFromXHR(xhr);
        
        $$(ajaxform.formSelector).each(function(item){item.removeClassName('rr-request-being-processed');});
        $$(ajaxform.formSelector + ' .rr-error-placeholder').each(function(item){item.childElements().each(function(child){child.remove();});});
        $$(ajaxform.formSelector + ' .rr-error-placeholder').each(function(item){item.removeClassName('rr-error-message');});
        
        for (var i in messagebus.connections) {
            var isMatch = messagebus.connections[i].isMatch;

            if (isMatch(null, ajaxform.url, ajaxform.httpMethod)) {
                var err = messagebus.connections[i].error;
                err(ajaxform.url, ajaxform.httpMethod);
            }
        }
        if (redrata.util.parseXHRAndHandleJaxRSResponse(xhr, new redrata.responseHandlingOptions({formidprefix: ajaxform.prefix, feedbackmessage : ajaxform.feedbackmessage, shakeSubmitButtonAndDisplaySubmitMessage : ajaxform.shakeSubmitButtonAndDisplaySubmitMessage, isRedirectingASAP : ajaxform.isRedirectingASAP}))) {
            // then the message will be fine.  nothing extra needed.
        } else {
            // else some random response.
        	new redrata.feedBackLayer( {  
    			message : "There was an error while performing this update.",
    			isError : true 
    		});
        }
        if (jaxrs_response!=null && jaxrs_response.redirect_uri && jaxrs_response.redirect_uri.length >0 ) {
            // then we're redirecting away.  and we won't want to re-enable the form.
        } else {
            redrata.util.enableForm(ajaxform);
        }
        */
        ajaxform.onFailureHandler(xhr);
    },
    onComplete : function(xhr) {
        /*
        redrata.logging.log("onComplete " + new Date().getTime(), "onComplete", false, false);
        var message = "";
        switch (xhr.status) {
        case 200:
            message = "Good request.";
            break;
        case 404:
            message = "The requested page was not found";
            break;
        case 406:
            message = "Not acceptable.";
            break;
        case 500:
            message = "The server reported an error.";
            break;
        default:
            message = "Status code is " + xhr.status;
        }
        redrata.logging.log("onComplete " + new Date().getTime(), message, false, false);
        */
        ajaxform.onCompleteHandler(xhr);
    }
    }, true);
},
doDelete : function(evt) {
    var ajaxform = this;
    if (ajaxform.isDeleting || ajaxform.isSaving) {
        return;
    }
    ajaxform.isDeleting = true;
    ajaxform.setFormEnabled(false);
    ajaxform.feedbackmessage.setInfoMessage("Deleting...");
    $$(ajaxform.formSelector).each(function(item){item.addClassName('rr-request-being-processed');});
    redrata.waitForActions(evt);
    var ajaxform = this;
    
    var messagebus = redrata.messagebus;
    for (var i in messagebus.connections) {
        var isMatch = messagebus.connections[i].isMatch;

        if (isMatch(null, ajaxform.url, ajaxform.httpMethod)) {
            var init = messagebus.connections[i].init;
            init(ajaxform.url, ajaxform.httpMethod);
        }
    }
    
    var deferred = new Ajax.Request(ajaxform.url, {
    method : 'delete',
    requestHeaders : {
        "Accept" : "application/json",
        "RR-Id" : redrata.sid
    },
    onSuccess : function(xhr) {
        /*
        var jaxrs_response = redrata.util.getJaxRSResponseFromXHR(xhr);
        $$('.rr-error').each(function(item){item.removeClassName('rr-error');});
        $$(ajaxform.formSelector).each(function(item){item.removeClassName('rr-request-being-processed');});
        redrata.messagebus.fireAjaxSuccessEvent(new redrata.onajaxsuccessmessage( {
        formSelector : ajaxform.formSelector,
        method : "DELETE",
        messageDivSelector : ajaxform.messageDivSelector,
        resourceURL : ajaxform.url,
        xhr : xhr
        }));
        if (!jaxrs_response.redirect_uri || jaxrs_response.redirect_uri.length <= 0) {
            redrata.util.enableForm(ajaxform);
        }
        */
        ajaxform.onSuccessHandler(xhr, null);
    },
    onFailure : function(xhr) {
        /*
        var jaxrs_response = redrata.util.getJaxRSResponseFromXHR(xhr);
        $$(ajaxform.formSelector).each(function(item){item.removeClassName('rr-request-being-processed');});
        
        for (var i in messagebus.connections) {
            var isMatch = messagebus.connections[i].isMatch;

            if (isMatch(null, ajaxform.url, ajaxform.httpMethod)) {
                var err = messagebus.connections[i].error;
                err(ajaxform.url, ajaxform.httpMethod);
            }
        }
        if (redrata.util.parseXHRAndHandleJaxRSResponse(xhr, new redrata.responseHandlingOptions({formidprefix: ajaxform.prefix, feedbackmessage : ajaxform.feedbackmessage, shakeSubmitButtonAndDisplaySubmitMessage : ajaxform.shakeSubmitButtonAndDisplaySubmitMessage, isRedirectingASAP : ajaxform.isRedirectingASAP}))) {
            // then the message will be fine.  nothing extra needed.
        } else {
            // else some random response.
            new redrata.feedBackLayer( {  
                message : "There was an error while performing this delete.",
                isError : true 
            });
        }
        if (jaxrs_response!=null && jaxrs_response.redirect_uri && jaxrs_response.redirect_uri.length >0 ) {
            // then we're redirecting away.  and we won't want to re-enable the form.
        } else {
            redrata.util.enableForm(ajaxform);
        }
        */
        ajaxform.onFailureHandler(xhr);
    },
    onComplete : function(xhr) {
        ajaxform.onCompleteHandler(xhr);
    }
    });
}
}); // ajaxform class

/* auto-create inplaceedit objects for each .rr-inline-edit-widget  //FED: commented out as no longer needed (likely)
dojo.behavior.add( {
    '.rr-ajax-form.rr-auto-instantiate' : {
        found : function(evt) {
            var id = evt.id;
            if (!redrata.ajaxformSingleton) {
                redrata.ajaxformSingleton = {};
            }
            if (redrata.ajaxformSingleton[id]) {
                return;
            }
            redrata.ajaxformSingleton[id] = id;
            new redrata.ajaxform( {
                formSelector : "#" + id
            });
        }
    }
}); */

//FED: singleton
if (!redrata.ajaxformSingleton) {
    redrata.ajaxformSingleton = {};
}

//FED: behavior function for submit (for ajax forms submits)
redrata.util.addBehavior('initiate ajax form save', {
    '.rr-ajax-submit-op:not(.rr-inline-edit-submit-operation)': {
        onclick: function(evt) {
            redrata.ajaxformSingleton[redrata.util.initAjaxForm(evt, true)].doSave(evt);
        }
    }
});

//FED: behavior function for submit (for inline edit submits)
redrata.util.addBehavior('initiate inline edit form save', {
    '.rr-ajax-submit-op.rr-inline-edit-submit-operation': {
        onclick: function(evt) {
            var parent = redrata.util.getParentNode(evt.target, "rr-inline-edit-widget");
            if(!parent) {
                redrata.util.warn( 'no parent for ' + evt.target.id);
                if (evt) {
                    Event.stop(evt);
                }
                return;
            }
            var subviewName = parent.id.replace("rrid-inline-edit-widget-", "");
            redrata.ajaxformSingleton[redrata.util.initAjaxForm(evt, true)].doSave(evt, subviewName);
        }
    }
});

redrata.util.addBehavior('form_enterkey', {
    'form.rr-ajax-form': {
        onkeypress : function(evt) {
            if (evt.keyCode == Event.KEY_RETURN && evt.target.type != 'textarea') {
                var subviewName = null;
                if ($(evt.target).hasClassName("rr-input-edit-controls")) {
                    var parent = redrata.util.getParentNode(evt.target, "rr-inline-edit-widget");
                    if (parent != null) {
                        subviewName = parent.id.replace("rrid-inline-edit-widget-", "");
                    }
                }
                redrata.ajaxformSingleton[redrata.util.initAjaxForm(evt, true)].doSave(evt, subviewName);
            }
        } 
    }
});

//FED: behavior function for delete (general)
redrata.util.addBehavior('handle form delete', {
    '.rr-delete-op': {
        onclick: function(evt) {
            redrata.ajaxformSingleton[redrata.util.initAjaxForm(evt, true)].doDelete(evt);
        }
    }
});

/** *******************SUBVIEW MANAGER********************************** */

/*
ok, so we have subviewManager object ...

whats the purpose of this?

imagine beein on ci page, havin one ci expanded ... now we click reply link for that ci, reply form appears (it was 
there before, we just show it by removing rr-is-hidden of it) ... now when the page or frag gets reloaded, the reply 
form disappears again ... might be confusing, when workin and things are goin away without knowing why (dwr updates)
... so we need to store the states we are in somewhere ... things, which are different from when page gets loaded, 
i called them subviews ... like reply subview, edit-attribs subview etc ... so basically we need a mechanism dealin 
with showing, toggling, hiding things and storing the state ... and, dealin with dependencies ... think of when we 
have one ci open, we open reply form 4 it ... what should happen when we collapse that ci? of course also reply form 
goes away, but when we uncollapse ci, it is there, and it shouldnt ... so we need to hide reply subview as well ... and 
get rid of reply subview from hash as well ... so to define that reply subview is dependant on ci subview ... thats why we 
have subviewManager object, it deals with everything ... we shouldnt ever access (modify) the hash, if really needed, 
then use methods addSubviewToHash or deleteSubviewFromHash in redrata.util ... but try to use subviewManager everytime 
something is beein shown/hidden ...

the idea is to programatically define subviews, their names, what should be shown and what hidden (switchers) and 
dependencies ...
subviewManager object has these parameters ...

id -an id which binds particular subviewManager with particular link ... its also used as a key to field of 
subviewManager objects ...
switchers - field of switcher objects which have 3 attributes - criteria, action, class ... criteria should be 
valid js selecting criteria (#id or .class), action is either "add" or "remove" and class is classname which is 
added or removed from object(s) selected by criteria, if u dont state classname it would be rr-is-hidden
subviewName - name of subview which is beein shown and added to hash in case of shower or in case of hider beein hidden 
and deleted from hash
subviewsToGetRidOn - field of strings, all subviews containing those strings are beein removed from hash !!! 
remember that this deals only with removing subviews from hash, not hiding the subviews themselfs, u need to hide 
them in switchers section !!!
revertedShowing - false by default ... set to true only when subview means that ure hidin something, so even though we 
are in subview - add it to hash, we are actually hidin something, not showing 
(rare thing, we have only one, show/hide filter view on conversation page)
subviewFunction - default set to false, if u set it to true, after subview was created (all logic from switchers applied and
hash modified), we also try to call function of this name subviewName.split('-')[0]SubviewFunction(id), 
eg replySubviewFunction('5') in case of subview name reply-5. so when creatin a subview also requires some js to call,
just set attribute subviewFunction to true and create appropriate function. when u dont need id from subview name, just ignore it
in your function implementation 

every subviewManager object is created only once and stored in singleton by id ... this allows us to have one 
object but dealin with group of same behaviors, but we somehow need to distiguish which one we are usin ... and 
usin it in switchers ... so expression (id) is beein replaced on fly by the actual id which comes from the event 
... special thing is expression (ids) , which u can use in subviewName and that creates subviews for all cis on 
page (used only once when expanding all cis)

lets deal with simple example ...

1. we define 2 objects, shower and hider

    new redrata.subviewManager({
        id : 'rrcaid-reply-shower',
        switchers : [['.rrca-conversation-item-reply', 'add'],
                     ['#rrcaid-reply-(id)', 'remove', 'blahblah'],
                     ['.rrca-reply-button', 'remove'],
                     ['#rrcaid-reply-shower-(id)', 'add']],
        subviewName : "reply-(id)",
        subviewsToGetRidOf : ['reply-']
    });

    new redrata.subviewManager({
        id : 'rrcaid-reply-hider',
        switchers : [['#rrcaid-reply-(id)', 'add'],
                     ['#rrcaid-reply-shower-(id)', 'remove']],
        subviewName : "reply-(id)",
        subviewsToGetRidOf : null
    });


2. we define links

    <div id='rrcaid-reply-shower-45' class='rr-subview-manager rrca-reply-button' title='Reply to the item via email.' >Reply</div>
    
    <div id='rrcaid-reply-shower2-45' class='rr-subview-manager rrca-reply-button' title='Reply to the item via email.' >Reply</div>

    <div id='rrcaid-reply-hider-45' class='rr-cancel-op rr-subview-manager'>Hide</div>

    things here :

    - the switchers have to have class rr-subview-manager on them, that binds them to behavior
    - the id of switcher have to have this format *-function(number)-id where
        * is whatever
        function is either shower or hider, or if u need two showers, u can have shower1 and shower2
        id is id we are usin for subview (in this case it is 45) ... if we dont need id (its general for page), dont put it there, so just *(number)-function

    and we define contents of subview, in this case

    <div id="rrcaid-reply-45" class='rrca-conversation-item-reply rr-is-hidden rr-reply-45-subview-div'>
        blahblah
    </div>

    - another thing, we need to have class on subview elements in this format rr-*-subview-div or rr-*subview-hide-div ... 
    * is subview name ...  this is used when the page (or fragment) gets reloaded ...
        if we have hash like #reply-45
        everything with class rr-reply-45-subview-div is beein shown (rr-is-hidden removed) after reload
        and
        everything with class rr-reply-45-subview-hide-div is beein hidden (rr-is-hidden added)
        if we use different class in showers than rr-is-hidden, it needs to be implemented as special case in initViewToggle method
        

3. so when we click on something with class rr-subview-manager and id rrcaid-reply-shower-45, we get the id of 
subview from id of link (45 in this case), we get the function from id (in this case shower)
    we get the appropriate subviewManager object,
    replace all occurences of string (id) by value of id in switchers and perfom logic which is beein defined in switchers ...
        so apply rr-is-hidden (default class) to .rrca-conversation-item-reply,
        remove blahblah class from #rrcaid-reply-45
        etc ...
        
    same logic would get executed if we click on something with class rr-subview-manager and id rrcaid-reply-shower2-45 ...

    subview name reply-45 is beein added to hash, comma separated
    and all subviews which match reply- are beein removed from hash
*/
 

if (!redrata.subviewManagerSingleton) {
    redrata.subviewManagerSingleton = {};
}

redrata.subviewManager = Class.create({
    id : null,
    switchers : null,
    subviewName : null,
    subviewsToGetRidOf : null,
    revertedShowing : false,
    idToHighlight : null,
    subviewFunction : false,

    initialize : function(args) {
        var manager = this;
        Object.extend(manager, args);
        if (manager.id == null) {
            redrata.util.error( 'Id of subview manager is null');
            return;
        }
        //if (manager.switchers == null) manager.switchers = null;
        if (manager.subviewName == null) manager.subviewName = "";
        //manager.subviewsToGetRidOf = redrata.util.createArrayFromObject(manager.subviewsToGetRidOf);
        if (!redrata.subviewManagerSingleton[manager.id]) {
            redrata.subviewManagerSingleton[manager.id] = manager;
        }
    }
});

function processSubviewManagerFromEvent(evt, subviewManagerClass) {
	//if element has class rr-subview-manager-respect-event, the nwe do not stop event
    if (!evt.target.hasClassName('rr-subview-manager-respect-event')) {
        Event.stop(evt);
    }
    var idOfNode = redrata.util.getParentNode(evt.target, subviewManagerClass).id;
    var splittie =  idOfNode.split("-");
    var func, id, singletonId;
    if (splittie[splittie.length -1].match('shower') || splittie[splittie.length -1].match('hider') || splittie[splittie.length -1].match('toggler')) { //we whave no id, format *-func
        func = splittie[splittie.length -1].match('shower') ? 'shower' : splittie[splittie.length -1].match('hider') ? 'hider' : 'toggler';
        id = 'id';
        singletonId = idOfNode.split(func)[0] + func;
    } else if (splittie[splittie.length -2].match('shower') || splittie[splittie.length -2].match('hider') || splittie[splittie.length -2].match('toggler')) { //we whave id, format *-func-id
        func = splittie[splittie.length -2].match('shower') ? 'shower' : splittie[splittie.length -2].match('hider') ? 'hider' : 'toggler';
        id = splittie[splittie.length -1];
        singletonId = idOfNode.split(func)[0] + func;
    } else {
        redrata.util.error( 'subview manager - wrong format of nodeId - ' + idOfNode);
        return;
    }
    subviewManagerEventProcessor(singletonId, func, id, idOfNode);
}

function subviewManagerEventProcessor(singletonId, func, id, idOfNode) {
    var manager;
    var idAttribute = '\\(id\\)';
    var idsAttribute = '\\(ids\\)';
    if (!redrata.subviewManagerSingleton || !redrata.subviewManagerSingleton[singletonId]) {
        redrata.util.error( 'subview manager - we dont have subview manager object with such id - ' + singletonId);
        return;
    } else {
        manager = redrata.subviewManagerSingleton[singletonId];
    }
    manager && manager.switchers && manager.switchers.each(function(switcher) {//processing switchers from subview Manager
        switch(switcher[1]) {
            case 'add' : {
                $$(redrata.util.replaceAttribute(switcher[0], idAttribute, id)).each(function(item){item.addClassName(switcher.length == 3? switcher[2] : 'rr-is-hidden');});
                break;
            }
            case 'remove' : {
                $$(redrata.util.replaceAttribute(switcher[0], idAttribute, id)).each(function(item){item.removeClassName(switcher.length == 3? switcher[2] : 'rr-is-hidden');});
                break;
            }
            case 'toggle' : {
                $$(redrata.util.replaceAttribute(switcher[0], idAttribute, id)).each(function(item){item.toggleClassName(switcher.length == 3? switcher[2] : 'rr-is-hidden');});
                break;
            }
            default : {
                redrata.util.error( 'subview manager - wrong function in switcher, has to be add or remove or toggle');
                return;
            }
        }
    });
    if (func != 'toggler') {
        if (manager.revertedShowing == true ? func == "hider" : func == "shower") { // if function shower or function hider and reversed showing, we add subview to hash
            if (manager.subviewName.match("(ids)")) { // only commapp case
                var ids = redrata.commapp.getIdsOfCisOnPage(); //function moved to commapp.js
                ids && ids.each(function(id, index, ids) {
                    redrata.util.addSubviewToHash(redrata.util.replaceAttribute(manager.subviewName, idsAttribute, id), redrata.util.replaceAttribute(manager.subviewsToGetRidOf, idAttribute, id));
                });
            } else {
                redrata.util.addSubviewToHash(redrata.util.replaceAttribute(manager.subviewName, idAttribute, id), redrata.util.replaceAttribute(manager.subviewsToGetRidOf, idAttribute, id));
            }
        } else if (manager.revertedShowing == true ? func == "shower" : func == "hider") { // if function hider or function shower and reversed showing, we delete subview from hash
            redrata.util.deleteSubviewFromHash(redrata.util.replaceAttribute(manager.subviewName, idAttribute, id), redrata.util.replaceAttribute(manager.subviewsToGetRidOf, idAttribute, id));
        }
    } else {
        var subviewName = redrata.util.replaceAttribute(manager.subviewName, idAttribute, id);
        if (!window.location.hash.match(subviewName)) {
            if (manager.switchers == null) {
                $$('.rr-' + subviewName + '-subview-div').each(function(item){item.removeClassName('rr-is-hidden');});
                $$('.rr-' + subviewName + '-subview-hide-div').each(function(item){item.addClassName('rr-is-hidden');});
            }
            redrata.util.addSubviewToHash(redrata.util.replaceAttribute(manager.subviewName, idAttribute, id), redrata.util.replaceAttribute(manager.subviewsToGetRidOf, idAttribute, id));
        } else {
            if (manager.switchers == null) {
                $$('.rr-' + subviewName + '-subview-div').each(function(item){item.addClassName('rr-is-hidden');});
                $$('.rr-' + subviewName + '-subview-hide-div').each(function(item){item.removeClassName('rr-is-hidden');});
            }
            redrata.util.deleteSubviewFromHash(redrata.util.replaceAttribute(manager.subviewName, idAttribute, id), redrata.util.replaceAttribute(manager.subviewsToGetRidOf, idAttribute, id));
        }
    }
    if (manager.subviewFunction) {
        var functionName = manager.subviewName.split('-')[0] + "SubviewFunction";
        var functionParam = manager.subviewName.split('-').length > 1 ? redrata.util.replaceAttribute(manager.subviewName.split('-')[1], idAttribute, id) : "no param";
        if (typeof window[functionName] == "function") {
            window[functionName](functionParam, idOfNode);
        } else {
            redrata.util.error( 'subview manager - error while tryin to find execute ' + functionName + "('" + functionParam + "');");
        }
    }
    if (manager.idToHighlight) {
        var processedIdToHighlight = redrata.util.replaceAttribute(manager.idToHighlight, idAttribute, id);
        if ($(processedIdToHighlight) != null) {
            redrata.util.highlightId(processedIdToHighlight);
            //dojo.query('#' + processedIdToHighlight).addClass('rr-subview-manager-highlight');
            //setTimeout(function() {dojo.query('#' + processedIdToHighlight).removeClass('rr-subview-manager-highlight')}, 1000);
        }
    }
}

redrata.util.addBehavior('handle subview change on click', {
    '.rr-subview-manager': {
        onclick: function(evt) {
            processSubviewManagerFromEvent(evt, 'rr-subview-manager');
        }
    }
});

redrata.util.addBehavior('handle subview change on double click', {
    '.rr-subview-manager-double-click': {
        ondblclick: function(evt) {
            processSubviewManagerFromEvent(evt, 'rr-subview-manager-double-click');
        }
    }
});

/** ******************ONAJAXSUCCESSMESSAGE*********************************** */
redrata.onajaxsuccessmessage = Class.create({
/** css selector (e.g. #form-id or '#id form') of form that contained the data we were get/put/post/deleting */
formSelector : null,
/** the method we were calling. e.g. GET, PUT, POST, DELETE, etc */
method : null,
/** true if this message is fired after the user did something locally (vs. some application notice delivered via dwr.) */
isLocal : true,
/** where we'd like the message to be displayed */
messageDivSelector : null,
/** a common response object */
jaxRSResponse : null,
/** the resource that was affected */
resourceURL : null,
xhr : null,
/* e.g. */
initialize : function(arguments) {
    var successMessage = this;
    Object.extend(successMessage, arguments);
}
});

/** ******************ONAJAXSUCCESSHANDLER***********************************
* create an onajaxsuccesshandler. call subscribe on it (give some resource paths to monitor exclude) when there is a successful ajax call to a resource path matching those subscribed values, then onAjaxSuccess is triggered. This will typically populate a specified div with some new html
*/

redrata.onajaxsuccesshandler = Class.create({
/* if there is a Location header on the result, redirect to that location */
redirectToLocationIfProvided : true,
/* Load this url when onAjaxSuccess is called */
resourceToLoadURL : null,
resourceToLoadAccept : "text/vnd.redrata.detail+html",
/* insert the result into the element matching this css selector */
elementInWhichToInsertResultSelector : '#rrid-main-content',
/** this selector will be used to hide/remove an element on delete */
elementToHideOnDeleteSelector : null,
/* e.g. */
timer : null, /** timerDelayingSuccessAction */
lastUpdateMS : new Date().getTime(), /** timeTheLastActionWasTriggered */
interval : {local : 0, remote : 0}, /** minimalRefreshIntervalMS */
initialize : function(arguments) {
    var successHandler = this;
    Object.extend(successHandler, arguments);
},
/**
 * override this if you want to handle the success message before the regular onAjaxSuccess is called.  Return true
 * if you want to continue processing, otherwise it stops further processing
 */
customHandlingOfOnAjaxSuccess : function(onajaxsuccessmessage) {
    return true;
},
/**
 * override this if you want to perform some logic before we do ajax call.
 */
customHandlingOfOnAjaxCall : function(url, method) {
},
/**
 * override this if you want to perfrom some logic after ajax call failed.
 */
customHandlingOfOnAjaxError : function(url, method) {
},
onAjaxSuccess : function(onajaxsuccessmessage, ajaxform) {
    try {
        var onajaxsuccesshandler = this;
        
        function onAjaxSuccess2(onajaxsuccessmessage, ajaxform) {
            
            onajaxsuccesshandler.timer = null;
            onajaxsuccesshandler.lastUpdateMS = new Date().getTime();
        
            if (onajaxsuccesshandler.customHandlingOfOnAjaxSuccess) {
                if(!onajaxsuccesshandler.customHandlingOfOnAjaxSuccess(onajaxsuccessmessage)) {
                    return;
                }
            }
            var location = onajaxsuccessmessage.xhr.getResponseHeader("Location");
            if (onajaxsuccesshandler.redirectToLocationIfProvided) {
                if(onajaxsuccessmessage.jaxRSResponse && onajaxsuccessmessage.jaxRSResponse.redirect_uri) {
                    location = onajaxsuccessmessage.jaxRSResponse.redirect_uri;
                }
                if (location) {
                    window.location.assign(location);
                    return;
                }
            }
            if ("DELETE" == onajaxsuccessmessage.method && onajaxsuccesshandler.elementToHideOnDeleteSelector) {
                // on a delete go and hide all the specified elements
                if (!Object.isArray(onajaxsuccesshandler.elementToHideOnDeleteSelector)) {
                    onajaxsuccesshandler.elementToHideOnDeleteSelector = [ onajaxsuccesshandler.elementToHideOnDeleteSelector];
                }
                onajaxsuccesshandler && onajaxsuccesshandler.elementToHideOnDeleteSelector && onajaxsuccesshandler.elementToHideOnDeleteSelector.each(function (selector) {
                    $$(selector).each(function(item) {
                        new Effect.Fade($(item), {
                    		duration: 1.5,
                    		afterFinish : function(){
                    			item.addClassName('rr-is-hidden');
                    			item.innerHTML = '';
                    		}
                    	});
                    });
                });
                return;
            }
        
            var ct = onajaxsuccessmessage.xhr.getResponseHeader("Content-Type")
            if (ct != null) {
                ct = ct.split(";", 1)[0];
            }
        
            if (ct == onajaxsuccesshandler.resourceToLoadAccept && !onajaxsuccesshandler.resourceToLoadURL) {
                redrata.util.insertPayload(onajaxsuccesshandler.elementInWhichToInsertResultSelector, onajaxsuccessmessage.xhr.responseText, onajaxsuccessmessage, ajaxform);
                return;
            }
        
            if (!onajaxsuccesshandler.resourceToLoadURL) {
                redrata.util.warn( "no resourceToLoadURL specified.  In context of " + onajaxsuccesshandler.elementInWhichToInsertResultSelector);
                return;
            }
        
            new Ajax.Request(onajaxsuccesshandler.resourceToLoadURL ? onajaxsuccesshandler.resourceToLoadURL : location, {
            method : 'get',
            requestHeaders : {
                "Accept" : onajaxsuccesshandler.resourceToLoadAccept,
                "RR-Id" : redrata.sid
                },
            onSuccess : function(xhr) {
                redrata.util.insertPayload(onajaxsuccesshandler.elementInWhichToInsertResultSelector, xhr.responseText, onajaxsuccessmessage, ajaxform);
            },
            onFailure : function(xhr) {
                if (redrata.util.parseXHRAndHandleJaxRSResponse(xhr)) {
                    return;
                }
            	new redrata.feedBackLayer( {  
					message : "There was an error while automatically refreshing.  Please reload this page manually.",
					isError : true 
				});
            }
            });
        }
        if ((onajaxsuccesshandler.interval.local != 0 && onajaxsuccessmessage.isLocal) || (onajaxsuccesshandler.interval.remote != 0 && !onajaxsuccessmessage.isLocal)) {
            if (new Date().getTime() - onajaxsuccesshandler.lastUpdateMS > onajaxsuccesshandler.interval) { // were outside interval, callin action
                onAjaxSuccess2(onajaxsuccessmessage, ajaxform);
                return;
            } else {
                var i = onajaxsuccessmessage.isLocal ? onajaxsuccesshandler.interval.local : onajaxsuccesshandler.interval.remote;
                var delay = Math.max(0, i - (new Date().getTime() - onajaxsuccesshandler.lastUpdateMS));
                clearTimeout(onajaxsuccesshandler.timer);
                onajaxsuccesshandler.timer = setTimeout(function() {
                    onAjaxSuccess2(onajaxsuccessmessage, ajaxform);
                }, delay);
                return;
            } 
        }
        onAjaxSuccess2(onajaxsuccessmessage, ajaxform);
    } finally {
    }
},

/**
 * provide a string or string[] for each of the match/exclude regexs. When a resource is updated, and we find matching onajaxsuccesshandler and call them.
 */
subscribe : function(key, resourceToMatchRegex, resourceToExclueRegex, httpMethodsToInclude, httpMethodsToExclude) {
    var onajaxsuccesshandler = this;

    if (typeof(key) !== 'string') {
        redrata.util.error( "Couldn't subscribe to message bus: parameter key is either missing or not a string!");
        return;
    }
    
    function isMatch(xhr, resourceURL, method) {
        var onajaxsuccesshandler = this;

        // rob->bry Here is where we check the returned RR-Id header to see if this session generated the event, and if so ignore it.
        if (xhr && xhr.getResponseHeader("RR-Id") && xhr.getResponseHeader("RR-Id") == redrata.sid) {
            return false;
        }

        if (!resourceURL) {
            return false;
        }
        if (!resourceToMatchRegex) {
            resourceToMatchRegex = [];
        }
        if (!Object.isArray(resourceToMatchRegex)) {
            resourceToMatchRegex = [ resourceToMatchRegex ];
        }
        {
            var hasFoundIncluded = resourceToMatchRegex.length > 0 ? false : true;
            if (!resourceToMatchRegex) {
                hasFoundIncluded = true;
            }
            resourceToMatchRegex && resourceToMatchRegex.each(function(item) {
                if (resourceURL.match(item)) {
                    hasFoundIncluded = true;
                } else {
                    false;
                }
            });
            if (!hasFoundIncluded) {
                return false;
            }
        }

        if (!httpMethodsToInclude) {
            httpMethodsToInclude = [];
        }
        if (!Object.isArray(httpMethodsToInclude)) {
            httpMethodsToInclude = [ httpMethodsToInclude ];
        }
        {
            var hasFoundIncluded = httpMethodsToInclude.length > 0 ? false : true;
            if (!httpMethodsToInclude) {
                hasFoundIncluded = true;
            }
            httpMethodsToInclude && httpMethodsToInclude.each(function(item) {
                if (method.match(item)) {
                    hasFoundIncluded = true;
                } else {
                    false;
                }
            });
            if (!hasFoundIncluded) {
                return false;
            }
        }

        if (!resourceToExclueRegex) {
            resourceToExclueRegex = [];
        }
        if (!Object.isArray(resourceToExclueRegex)) {
            resourceToExclueRegex = [ resourceToExclueRegex ];
        }
        {
            var hasFoundExcluded = false;
            resourceToExclueRegex && resourceToExclueRegex.each(function(item) {
                if (resourceURL.match(item)) {
                    hasFoundExcluded = true;
                }
            });
            if (hasFoundExcluded) {
                return false;
            }
        }
        if (!httpMethodsToExclude) {
            httpMethodsToExclude = [];
        }
        if (!Object.isArray(httpMethodsToExclude)) {
            httpMethodsToExclude = [ httpMethodsToExclude ];
        }
        {
            var hasFoundExcluded = false;
            httpMethodsToExclude && httpMethodsToExclude.each(function(item) {
                if (method.match(item)) {
                    hasFoundExcluded = true;
                }
            });
            if (hasFoundExcluded) {
                return false;
            }
        }
        return true;
    }
    ;
    function action(onajaxsuccessmessage, ajaxform) {
        if (onajaxsuccessmessage.xhr && !onajaxsuccessmessage.jaxRSResponse) {
            onajaxsuccessmessage.jaxRSResponse = redrata.util.getJaxRSResponseFromXHR(onajaxsuccessmessage.xhr);
        }
        onajaxsuccesshandler.onAjaxSuccess(onajaxsuccessmessage, ajaxform);
    }
    function init(url, method) {
        onajaxsuccesshandler.customHandlingOfOnAjaxCall(url, method);
    }
    function error(url, method) {
        onajaxsuccesshandler.customHandlingOfOnAjaxError(url, method);
    }
    redrata.messagebus.addListener(key, isMatch, action, init, error);
}
});

/** ******************DEFAULT*VALUE*********************************** **/
redrata.defaultValue = Class.create({
    attrib : null,
    value : null,
    initialize : function(arguments) {
        Object.extend(this, arguments);
    }
});

if (!redrata.defaultValues) {
    redrata.defaultValues = {};
}

redrata.util.addBehavior("remember input/textarea default vals", {
    "input[type=text].rr-input-edit-controls:not(.rrca-dont-preserve-values), textarea.rr-input-edit-controls:not(.rrca-dont-preserve-values)": {
        onkeydown: function(evt) {
            if(redrata.defaultValues[evt.target.id] == null){
                redrata.defaultValues[evt.target.id] = new redrata.defaultValue({attrib: "value", value: $(evt.target.id).value});
            }
        }
    }
});

redrata.util.addBehavior("remember select default vals", {
    "select.rr-input-edit-controls:not(.rrca-dont-preserve-values)": {
        onchange: function(evt) {
            if(evt.target.id && redrata.defaultValues[evt.target.id] == null){
                redrata.defaultValues[evt.target.id] = new redrata.defaultValue({attrib: "value", value: $(evt.target.id).value});
            }
        }
    }
});

redrata.util.addBehavior("remember checkbox default vals", {
    ".rr-input-edit-controls:not(.rrca-dont-preserve-values) input[type=checkbox]": {
        onclick: function(evt) {
            if(evt.target.id && redrata.defaultValues[evt.target.id] == null){
                redrata.defaultValues[evt.target.id] = new redrata.defaultValue({attrib: "checked", value: $(evt.target.id).checked});
            }
        }
    }
});

/** ******************create spinner or add class to parent until on ajax success***********************/ 

redrata.waitForActions = function(evt){
	 var parent = redrata.util.getParentNode(evt.target, "rr-onload-parent");
	 if(parent != null) {
		var replacementNode = $(parent).select(".rr-for-onload")[0];
		if (replacementNode) {
		    $(replacementNode).insert({after:"<span class='rrca-confirm-in-action rr-load-action-css'></span>"});
		    $(replacementNode).addClassName("rr-is-hidden");
		}
	 }
}

redrata.cancelWaitForActions = function(evt){
	 var parent = redrata.util.getParentNode(evt.target, "rr-onload-parent");
	 if(parent != null) {
		var replacementNode = $(parent).select(".rr-for-onload")[0];
		if (replacementNode) {
		    var spinner = $(replacementNode).next('.rrca-confirm-in-action');
		    if (spinner) {
		        $(spinner).remove();   
		        $(replacementNode).removeClassName("rr-is-hidden");
		    }
		}
	 }
}


/** ******************DELETION*DIALOG************************ **/

/*
 *     
 * 
**/
redrata.openDialogs = {};

redrata.dialog = Class.create( {
	initialize : function(target,args) {
		if(!Object.isUndefined(redrata.openDialogs[args.msg])) {
			return;      
		}
		var widget = this;
		// create elements
	    widget.splashScreen = new Element('div', { id: "rrid-splashscreen"+target,'class': 'rr-splash'});
	    widget.box = new Element('div', { id : "rrid-inner-box"+target,'class': 'rr-inner-outside',style:"opacity:0"});
		widget.innerBox = new Element('div', { 'class': 'rr-inner-box', style:"width:300px;" });
		widget.topText = new Element('div', { 'class': 'rr-inner-text',style:"z-index:201;"}).update(args.msg);
		// add some events
		widget.buttonConfirm = new Element('input', { value:"Yes",type:'button','class': args["class"] ,style:"z-index:201;"}).observe("click",function(evt) {
			if(Object.isFunction(args.confirm))
				args.confirm();
			new Effect.Fade($(widget.box), { duration:0.7, afterFinish : function(){delete redrata.openDialogs[args.msg];$(widget.box).remove();}}); 
		});
		widget.buttonCancel = new Element('input', { value:"No",type:'button','class': 'rr-cancel-button',style:"z-index:201;"}).observe("click",function(evt) {
			if(Object.isFunction(args.cancel))
				args.cancel();
			new Effect.Fade($(widget.box), { duration:0.7, afterFinish : function(){delete redrata.openDialogs[args.msg];$(widget.box).remove();}});
		});
		// append to each other and page
		widget.innerBox.appendChild(widget.topText);
		widget.innerBox.appendChild(new Element("br"));
		widget.innerBox.appendChild(widget.buttonConfirm);
		widget.innerBox.appendChild(widget.buttonCancel);
		widget.box.appendChild(widget.innerBox);
		$(widget.box).appendChild(widget.splashScreen);
		$(args.element).parentNode.appendChild(widget.box);
		// setposition
		redrata.openDialogs[args.msg] = widget;
		widget.height = $(widget.innerBox).getHeight() + 62;
		widget.width =	 $(widget.innerBox).getWidth() + 22;
		$(widget.innerBox).setStyle({top:"50%" ,marginTop:(widget.height / -2) + "px", left:"50%",marginLeft:(widget.width / -2) + "px"});
		$(widget.box).appear({ duration:0.7 });
	}
});


redrata.createButtons = Class.create( {
	initialize : function(target,args) {
	    var widget = this;
	    //if($("rr-deletion") != null){
	    //	$("rr-deletion").remove();
	    //	$$("rr-hider")[0].removeClassName("rr-hider").removeClassName("rr-is-hidden");
	    //}
		widget.element = $(target);
		widget.element.addClassName("rr-hider rr-is-hidden");
		widget.box =  new Element("span",{"id":"rr-deletion"} );
		widget.buttonConfirm = widget.box.appendChild(new Element('input', { value:"Confirm",type:'button','class': args["class"] ,style:"z-index:201;"} ).observe("click",function(evt) {
			if(Object.isFunction(args.confirm))
				args.confirm();
		}));
		widget.buttonCancel = widget.box.appendChild(new Element('input', { value:"Cancel",type:'button',style:"z-index:201;"} ).observe("click",function(evt) {
			if(Object.isFunction(args.confirm))
				args.cancel();
			widget.element.removeClassName("rr-hider").removeClassName("rr-is-hidden");
			widget.box.remove();
		}));
		widget.element.parentNode.appendChild(widget.box);
		
	}
});

redrata.responseHandlingOptions = Class.create({

    successCallBack : null,
    errorCallBack : null,
    formidprefix : null,
    isHumanReadableMessageDisplayed : true,
    scrollFeedbackMessageIntoView : null,
    setFocusOnErrorField : true,
    messageDivSelector : null,
    shakeSubmitButtonAndDisplaySubmitMessage : false,
    isErrorPublished : false,
    isRedirectingASAP : false,

    initialize : function(args) {
        Object.extend(this, args);
    }
});

redrata.util.addBehavior(".rr-confirm-expand", { 
	".rr-confirm-expand" : {
		onclick : function(evt) {
            Event.stop(evt);
			new redrata.createButtons($(redrata.util.getParentNode(evt.target, "rr-confirm-expand")), {"class":"rr-delete-op"} );
		}
	}
});

/** ***********MESSAGE*BUS**************** **/
// the messagebus is a static class. i.e. no 'new' required. One instance serves all for the page.

redrata.messagebus = {};
redrata.messagebus.connections = {};

/**
 * isMatch(onajaxsuccessmessage) returns true is the action should be triggered action(onajaxsuccessmessage) handles the onajaxsuccessmessage
 */
redrata.messagebus.addListener = function(key, isMatch, action, init, error) {
    var messagebus = redrata.messagebus;
    
    if (typeof(key) !== 'string') {
        redrata.util.error( "Couldn't subscribe to message bus: parameter key is either missing or not a string!");
        return;
    }
    
    //wax:multisuccesshandlerbug
    messagebus.connections[key] = new Object({isMatch : isMatch, action : action, init : init, error : error});
};
redrata.messagebus.fireAjaxSuccessEvent = function(onajaxsuccessmessage, ajaxform) {
    var messagebus = redrata.messagebus;

    for (var i in messagebus.connections) {
        var isMatch = messagebus.connections[i].isMatch;

        if (isMatch(onajaxsuccessmessage.xhr, onajaxsuccessmessage.resourceURL, onajaxsuccessmessage.method)) {
            var action = messagebus.connections[i].action;
            action(onajaxsuccessmessage, ajaxform);
        }
    }
};

/** ******************GENERAL*BEHAVIORS******** **/

new Event.on($(document), 'click', '*', function(evt) {
    redrata.util.setRedrataFocusFromEvt(evt);
});

new Event.on($(document), 'keyup', '*', function(evt) {
    //if (redrata.util.isKeyCode(evt, Event.KEY_TAB)) {
        redrata.util.setRedrataFocusFromEvt(evt);
    //}
});

redrata.util.addBehavior2("remember on focus changes", {
    "*": {
        onfocus: function(evt) {
			if (document.selection) { //ie
				try { //try catch as srcElement value will not always be there ...
					redrata.focus = window.event.srcElement.id;
				}
				catch(err) {}
			} else {
				redrata.focus = evt.target.id;
			}
			if (redrata.focus == "") { //bogus value for stupid ie as document.getElementById("") throws exception
				redrata.focus = "dull_focus";
			}
			/* commented out 4 now till we find better solution
			var el = dojo.byId(redrata.focus);
			if (redrata.focus != "dull_focus" && el != null && dojo.hasClass(el, 'rr-input-edit-controls')) {
			    if (dojo.byId(redrata.focus + "-error-span") != null) {
			        dojo.byId(redrata.focus + "-error-span").innerHTML = "";
			    }
			    if (dojo.byId(redrata.focus.replace('if', 'errif')) != null) {
			        dojo.byId(redrata.focus.replace('if', 'errif')).innerHTML = "";
			    }
			    var inputWhole = redrata.util.getParentNode(el, 'rr-input-whole');
                if (inputWhole != null) {
                    dojo.removeClass(inputWhole, 'rr-error');
                }
			}*/
			redrata.util.log( redrata.focus);
    }
}});

//redrata.logging.log("redrataJsEnd", "Logs from initial processing of redrata.js - END", false, true);