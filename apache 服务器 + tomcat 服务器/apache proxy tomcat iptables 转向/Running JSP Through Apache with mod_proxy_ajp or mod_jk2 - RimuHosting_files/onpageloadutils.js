//JavaScript dosen't have a selector by class  that works in all browsers its only a recentish thing
//findSelector(tag.class.class#id)  findSelector("tag")   findSelector(.class)  findSelector("#is")
//adding the a tag at the start  with a class search will speed it up as it only goes though a list of the specified elements rather than all
//you can just leave the selector out findSelector() will return all elements or findSelector("")
function findSelector(){
	if(!arguments[0] || arguments[0] == "")return document.getElementsByTagName("*") || document.body.all;
	selector = arguments[0];
    function checkClasses(clist,elems){
        var arry = new Array();
        if(clist.length==0 ||clist==null)return elems;
        for(var e = 0;e<elems.length;e++){
            if(typeof elems[e] != 'object')break;
            var matches = true;
            for(var clzz = 0;clzz<clist.length;clzz++){
                matches = (matches?new RegExp("(^|\\s)"+clist[clzz]+"($|\\s)", "g").test(elems[e].className):false);
            }
            if(matches)arry.push(elems[e]);
        }
        return arry;
    }
    var cut = selector.split(" ");
    var aSelectors = new Array();//associative selector array
    aSelectors["class"] = [];
    for(var a = 0;a<cut.length;a++){tf = cut[a].match(/([#.]|\S)[^#.]+/g);}//split the class and tags and id's
    for(var d = 0;d<tf.length;d++){//add them to associative array   {id:foobar,class:foobar,tag:foobar,}
        if(/^[.]/.test(tf[d])){aSelectors["class"].push(tf[d].split(".")[1])}
        if(/^[#]/.test(tf[d])){aSelectors["id"] = [d,tf[d].split("#")[1]]; }
        if(/^[^#.]/.test(tf[d])){aSelectors["tag"] = [d,tf[d].toUpperCase()];}
    }
    if(aSelectors["id"]){//if ID exsists in wanted element find first and return it
        var byId = document.getElementById(aSelectors["id"][1]);
        return byId && (!aSelectors["tag"] || byId.tagName == aSelectors["tag"][1]) ? checkClasses(aSelectors["class"],[byId]) : [];
    }
    elements = document.getElementsByTagName(aSelectors["tag"]?aSelectors["tag"][1]:"*") || document.body.all;
    if(aSelectors["class"][0]){
        return checkClasses(aSelectors["class"],elements);
    }
    return elements;
}
Array.prototype.doForEach = function(fn){
	if(typeof fn != 'function' || this == null){
		return null
	}
	for(var i in this){
		if(typeof this[i] == 'function')
			continue;
		fn(this[i],i,this.length);
	}
}
Array.prototype.exists = function(){
	return (this.length != 0 && this.length > 0);
}
//creates appropriate script or link elements and adds em to the dom
function loadjscssfile(filename, filetype){
 if (!filename) {
     return;
 }
 filename = filename.split('//').join('/');
 if (filetype=="js"){
  var fr=document.createElement('script');
  fr.setAttribute("type","text/javascript");
  fr.setAttribute("src", filename);
 } else if (filetype=="css"){
  var fr=document.createElement("link");            
  fr.setAttribute("rel", "stylesheet");
  fr.setAttribute("type", "text/css");
  fr.setAttribute("href", filename);
 }
 if (typeof fr!="undefined")
  document.getElementsByTagName("head")[0].appendChild(fr);
}


if (typeof(window.loadHandlingInitialized) == 'undefined') {
    oldLoadHandler = window.onload;
    window.onload = function customLoadHandler() {
        if(typeof(oldLoadHandler) == 'function') {
            oldLoadHandler();
        }
        if(findSelector("a.rrca-datetime-picker").exists()){
            loadjscssfile(RH.Util.contextPath + "/js/datetimepicker.js", "js");
            loadjscssfile(RH.Util.contextPath + "/css/datetimepicker.css", "css");
        }
        
        //put focus on first element with class rr-focus-point, only if no current focus.
        
        if(findSelector('.rr-focus-point').exists() && document.activeElement.tagName == 'BODY'){
            ar[0].focus();
            ar[0].select();
        }
        
        /* commented out 4 now
        findSelector("div.rr-error-note").doForEach(
            function(element){
                //element.className += " rr-is-hidden";
                if (element.innerHTML) {
                    new redrata.feedBackLayer( {  
                        message : element.innerHTML,
                        isError : true,
                        isPerm : true
                    });
                }
            }
        );

        */
    };
    window.loadHandlingInitialized = 'true';
}
