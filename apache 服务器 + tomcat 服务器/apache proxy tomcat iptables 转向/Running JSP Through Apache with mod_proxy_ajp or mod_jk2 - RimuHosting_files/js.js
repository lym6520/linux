function getObjById(id) {
    if (document.getElementById) {
        return document.getElementById(id);
    }
    if (document.all) {
        return document.all[id];
    }
    if (document.layers) {
        return document.layers[id];
    }
}
function hideElement(id){ 
    var element = getObjById(id);
    if (element == null) {
        return;
    }
    //element.style.display="none";
    $(id).addClassName('rr-is-hidden');
}
function showElement(id){ 
    var element = getObjById(id);
    if (element == null) {
        return;
    }
    //element.style.display="block";
    $(id).removeClassName('rr-is-hidden');
}
function toggleView(id){ 
    var element = getObjById(id);
    if (element == null) {
        return;
    }
    //if (element.style.display=="none") {
        //element.style.display="block";
    //} else {
        //element.style.display="none";
    //}
    $(element).toggleClassName('rr-is-hidden');
}

function canHideElements() {
    // in order to make dynamic changes to page content (i.e. show/hide)
    // the createTextNode function must be accessible by the browser.
    if (document.createTextNode)
        return true;

    return false;
    
}
function Browser() {
    var b=navigator.appName;
    if (b.indexOf('Netscape')!=-1) this.b="ns";
    else if ((b=="Opera") || (navigator.userAgent.indexOf("Opera")>0)) this.b = "opera";
    else if (b=="Microsoft Internet Explorer") this.b="ie";
    if (!b) {
        this.b="invalid"; this.invalid=true;
    }
    this.version=navigator.appVersion;
    this.v=parseInt(this.version);
    this.ns=(this.b=="ns" && this.v>=4);
    this.ns4=(this.b=="ns" && this.v==4);
    this.ns6=(this.b=="ns" && this.v==5);
    this.ie=(this.b=="ie" && this.v>=4);
    this.ie4=(this.version.indexOf('MSIE 4')>0);
    this.ie5=(this.version.indexOf('MSIE 5')>0);
    this.ie55=(this.version.indexOf('MSIE 5.5')>0);
    this.ie6=(this.version.indexOf('MSIE 6.0')>0);
    this.opera=(this.b=="opera");
    this.dom=(document.createElement && document.appendChild && document.getElementsByTagName)?true:false;
    this.def=(this.ie||this.dom); // most used browsers, for faster if loops
    var ua=navigator.userAgent.toLowerCase();
    if (ua.indexOf("win")>-1) this.platform="win32";
    else if (ua.indexOf("mac")>-1) this.platform="mac";
    else this.platform="other";
}
is=new Browser();

function getLayer(name) {
 	var ret = getObjById(name);
    if (is.ns4)
        return findLayer(name, document);
    if (is.ie && !is.dom)
        return eval('document.all.' + name);
    if (is.dom) {
        var ret2 = document.getElementById(name);
        return ret2 != null ? ret2 : ret;
	}
    return null;
}

function findLayer(name, doc) {
    var i, layer;

    for (i = 0; i < doc.layers.length; i++) {
        layer = doc.layers[i];
        if (layer.name == name)
            return layer;
        if (layer.document.layers.length > 0)
            if ((layer = findLayer(name, layer.document)) != null)
                return layer;
    }
    return null;
}

//--------------------------------------------------

function hideLayer(layer) {
    $(layer2).addClassName('rr-is-hidden');
    //if (is.ns4) {
        //layer.visibility = "hide"
    //} else {
        //layer.style.visibility = "hidden"
    //};
}

function showLayer(layer2) {
    $(layer2).removeClassName('rr-is-hidden');
    //if (is.ns4) {
        //layer2.visibility = "show"
    //} else {
        //layer2.style.visibility = "visible"
    //};
}

//--------------------------------------------------

function moveLayerTo(layer, x, y) {
	if(layer==null)
		return;
    if (is.ns4) {
        layer.moveTo(x, y);
    } else {
        layer.style.left = x;
        layer.style.top  = y
    };
}

//--------------------------------------------------

function getImage(name) {
    if (is.ns4) {
        return findImage(name, document)
    };
    if (is.ie && !is.dom) {
        return eval('document.all.' + name)
    };
    if (is.dom) {
        return document.getElementById(name);
    }
    return null;
}

function findImage(name, doc) {
    var i, img;

    for (i = 0; i < doc.images.length; i++)
        if (doc.images[i].name == name)
            return doc.images[i];
    for (i = 0; i < doc.layers.length; i++)
        if ((img = findImage(name, doc.layers[i].document)) != null) {
            img.container = doc.layers[i];
            return img;
        }
    return null;
}

function getImagePageLeft(img) {
    var x, obj;

    if (is.ns4) {
        if ('') //img.container != null
            return img.container.pageX + img.x;
        else
            return img.x;
    } else {
        x = 0;
        obj = img;
        while (obj!=null && obj.offsetParent != null) {
            x += obj.offsetLeft;
            obj = obj.offsetParent;
        }
        if(obj!=null)
	        x += obj.offsetLeft;
        return x;
    };
    return -1;
}

function getImagePageTop(img) {
    var y, obj;
    if (is.ns4) {
        if (img.container != null)
            return img.container.pageY + img.y;
        else
            return img.y;
    } else {
        y = 0;
        obj = img;
        while (obj.offsetParent != null) {
            y += obj.offsetTop;
            obj = obj.offsetParent;
        }
        y += obj.offsetTop;
        return y;
    };
    return -1;
}

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

/*
e.g.
addEvent(window, 'load', function() {
 document.getElementById('myfield').focus()
});
function addEvent(obj, evType, fn){
 if (obj.addEventListener){
    obj.addEventListener(evType, fn, true);
    return true;
 } else if (obj.attachEvent){
    var r = obj.attachEvent("on"+evType, fn);
    return r;
 } else {
    return false;
 }
}
*/

setupLIHoverClasses = function(id) {
	if (document.all && document.getElementById) {
		navRoot = document.getElementById(id);
		for (i=0; i < navRoot.childNodes.length; i++) {
			node = navRoot.childNodes[i];
			if (node.nodeName.toUpperCase()=="LI") {
				node.onmouseover=function() {
				this.className+=" over";
			}
			node.onmouseout=function() {
				this.className=this.className.replace(" over", "");
				}
			}
		}
	}
}

var EventSelectors = {
		  version: '1.0_pre',
		  cache: [],
		  
		  start: function(rules) {
		    this.rules = rules || {};
		    this.timer = new Array();
		    this._extendRules();
		    this.assign(this.rules);
		  },
		  
		  assign: function(rules) {
		    var observer = null;
		    this._unloadCache();
		    rules._each(function(rule) {
		      var selectors = $A(rule.key.split(','));
		      selectors.each(function(selector) {        
		        var pair = selector.split(':');
		        var event = pair[1];
		        $$(pair[0]).each(function(element) {
		          if(pair[1] == '' || pair.length == 1) return rule.value(element);
		          if(event.toLowerCase() == 'loaded') {
		            this.timer[pair[0]] = setInterval(this._checkLoaded.bind(this, element, pair[0], rule), 15);
		          } else {
		            observer = function(event) {
		              var element = Event.element(event);
		              if (element.nodeType == 3) // Safari Bug (Fixed in Webkit)
		            		element = element.parentNode;
		              rule.value($(element), event);
		            }
		            this.cache.push([element, event, observer]);
		            Event.observe(element, event, observer);
		          }
		        }.bind(this));
		      }.bind(this));
		    }.bind(this));
		  },
		  
		  // Scoped caches would rock.
		  _unloadCache: function() {
		    if (!this.cache) return;
		    for (var i = 0; i < this.cache.length; i++) {
		      Event.stopObserving.apply(this, this.cache[i]);
		      this.cache[i][0] = null;
		    }
		    this.cache = [];
		  },
		  
		  _checkLoaded: function(element, timer, rule) {
		    var node = $(element);
		    if(element.tagName != 'undefined') {
		      clearInterval(this.timer[timer]);
		      rule.value(node);
		    }
		  },
		  
		  _extendRules: function() {
		    Object.extend(this.rules, {
		     _each: function(iterator) {
		       for (key in this) {
		         if(key == '_each') continue;         
		         var value = this[key];
		         var pair = [key, value];
		         pair.key = key;
		         pair.value = value;
		         iterator(pair);
		       }
		     }  
		    });
		  }
		}
