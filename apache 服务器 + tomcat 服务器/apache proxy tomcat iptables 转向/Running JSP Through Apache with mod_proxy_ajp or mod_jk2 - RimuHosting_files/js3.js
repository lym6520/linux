if (typeof RH == "undefined") {
    // if logging is not setup, then define a no-op, do nothing logger
    RH = {};
}

if (typeof Class == "undefined") {
    if (typeof(console) != 'undefined' && console != null && typeof(console.log) == 'function') console.log("You will need to import prototype.js first.");
}

RH.DropDownMenus = Class.create();
RH.DropDownMenus.prototype = {
        initialize: function(menuIDs) {
            menuIDs.each(function(id) {
            	 menuHeader = $('mh'+id);
                 if(!menuHeader)
                     return;
                 menuItems =  $('menuItems'+id);
                 console.log(menuItems + " - stupid")
                 if(!menuItems) {
                     return;
                 }
                positionMenu = function() {
                    mh2 = $('mh'+id);
                    mi2 = $('menuItems'+id);
                    var cumulativeOffset = Element.cumulativeOffset(mh2);
                    mi2.setStyle({left: cumulativeOffset.left + 'px', minWidth: mh2.getWidth() + 'px'});
                    //mi2.style.left = cumulativeOffset.left + "px";
                    //mi2.style.minWidth = mh2.getWidth()+"px";
                    //mi2.style.top = (cumulativeOffset.top+menuHeader.getHeight())  + "px";
                }
                positionMenu();
                //document.observe("dom:loaded",positionMenu);
                Event.observe(window, 'load', positionMenu);
                Event.observe(window, 'resize', positionMenu);
                //<span id='ppicpagetop1' onmouseout="dmTimerOut(); bg_out('ppicpagetop1');" onmouseover="DMenu('picpagetop1'); dmTimerOver(); bg_over('ppicpagetop1');"><a href='/index.jsp'>Home</a></span> |
                mouseOut = function(event) {
                    mh2 = $('mh'+id);
                    mi2 = $('menuItems'+id);
                    var relatedTarget = event.relatedTarget;
                    if(relatedTarget) {
                        try {
                            inHeader = Element.descendantOf(relatedTarget, mh2);
                            if(inHeader)
                                return;
                            inMenuItems = Element.descendantOf(relatedTarget, mi2);
                            if(inMenuItems)
                                return;
                        } catch(e) {
                            // firefox throws if you mouse over a textarea/input/select.  permission denied to call method blah
                        }
                    }
                    mh2.removeClassName("menuHeaderHighlighted");
                    mi2.removeClassName("menuItemsOpened");
                };
                mouseOver = function(event) {
                    mh2 = $('mh'+id);
                    mi2 = $('menuItems'+id);
                    mh2.addClassName("menuHeaderHighlighted");
                    mi2.addClassName("menuItemsOpened");
                };
                Element.observe(menuHeader, 'mouseout', mouseOut);
                Element.observe(menuHeader, 'mouseover', mouseOver);
                Element.observe(menuItems, 'mouseout', mouseOut);
                Element.observe(menuItems, 'mouseover', mouseOver);
            });
        }
};

RH.FormToQueryString = function(element){
    element = $(element);
    if(!element)
        return null;
    var elements = element.getElements();
    var map = $H({});
    for(var i = 0; i<elements.length;i++){
        map.set(elements[i].name,$F(elements[i]));
    }
    
    return map.toQueryString();
}

Date.prototype.format = function(/** String*/ format) {
    RH.Util.Date.formatDate(this, format);
}


/**
 *  only reason i changed it is cause i needed to filter back with a function
 *  we use getParentNode in quite a few locations so i updated it and i put it in here
 *  i will change other locations to use this method instead
 */
 // 	Element.filterParents(innerElement, filter, stopAtFirstMatch[optional])
 //  $(innerElement).filterParents(filter, stopAtFirstMatch[optional])
 // 
 /**   stopAtFirstMatch ▬▶ if false returns -> Element|null					  // stops at first element and returns it 
 *  				 ▬▶ if true  returns -> Array[elements]|empty array	      // returns all parents that match filter
 *  filter can be:
 *   	
 *   	░░░░selector:░░░░
 *   	▬▶	$(element).filterParents(".selector");
 *
 *  	░░░░function:░░░░
 *  	▬▶	$(element).filterParents(function(toFilter){
 *   			return toFilter.id.length > 1;
 *			});	 
 *  
 *  	░░░░String evaluation:░░░░  
 *  	░░░░wrap String in an associative array. The reference to the node in the evaluated string is the key of the key/pair, so in this case i have called it 'item'
 *  	▬▶	$("element").filterParents({ item :  "item.hasClassName('example')" },true);
 *									      ┗┅┅┳┅┅┅┅┅┅┛
 *											 ▼
 * 								          HTML Element to be filtering
 */


function filterParents(element,args) {
	array = [];
	if(!element||!element.parentNode) return null;
	result = false;
	if(/fucntion/.test(typeof args)) result = args(element);
	if(/string/.test(typeof args)) result = Prototype.Selector.match(element, args);
	if(/object/.test(typeof args)) for(var i in args){result = eval(args[i].replace(i,"element"))}
	if(typeof result != 'boolean') return null;
	if(result && element != null) array.push(element);
	return array.concat(filterParents(element.parentNode, args));
}
//adding method to prototype
Element.addMethods({
	filterParents : function(element,filterMethod,all){
		if(!element) return all ? [] : null;
		var f = filterParents(element,filterMethod);
        return all ? f : f==null ? null : f[0];
    }
});

