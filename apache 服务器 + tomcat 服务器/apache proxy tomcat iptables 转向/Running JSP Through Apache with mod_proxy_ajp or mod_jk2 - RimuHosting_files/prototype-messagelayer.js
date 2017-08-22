if(typeof redrata == 'undefined'){
	redrata = {};
};
// 	if u want a partictular class or time on a message on a specific webpage you can do
//	if(redrata && redrata.messageSettings) redrata.messageSettings.error["class"] += "add-new-class"
//	if(redrata && redrata.messageSettings) redrata.messageSettings.error.lifeTime = 30000; //for 30 seconds
redrata.messageSettings =
{	
	//permanent alerter interval(ms) and colors to change between
    "permAlert":    {"interval":1000,color1:"#F82A00",color2:"#FF8780"},
	"permButton":   {"class":"rr-message-kill",defaultText:"Hide message."},
	//class for element in which to have icon as a back ground image  have css selector ".rr-message-errors.rr-message-icon-type { background: url("blah.png");width:Xpx; height:Ypx; }
	"icon":			{"class":"rr-message-icon-type"},
	//message classes and there lifetimes(ms)
    "error":        {"lifeTime":13000,	"class":"rr-message-errors"},
    "info":         {"lifeTime":10000,	"class":"rr-message-info"},
    "default":      {"lifeTime":7000,	"class":"rr-message-default"}, //when message does not have a type i.e.. is not error type or info type
    "permanent":    {"lifeTime":null,	"class":"rr-message-perm"}
}
redrata.feedbackMessages = new Array();
redrata.repeatedFeedbackmessages = new Array();

redrata.getParentNode = function(itemNode, parentclass) {
    if (itemNode == null) {
         return null;
    } else if ($(itemNode).hasClassName(parentclass)) {
        return itemNode;
    } else {
        return redrata.getParentNode(itemNode.parentNode, parentclass);
    }
}
redrata.killFeedBackLayersWithMessage = function(message){
	if(redrata.feedbackMessages[message]){
			redrata.feedbackMessages[message].object.killLayer();
	}
}
//kills all messages with the class specified in 'redrata.messageSettings.permanent["class"]'
redrata.killAllPermanentFeedBackLayers = function(){
	for(var layer in redrata.feedbackMessages){
		if(typeof redrata.feedbackMessages[layer] != 'function'){
			if(redrata.feedbackMessages[layer].perm){        
				redrata.feedbackMessages[layer].object.killLayer();
			}
		}
	}
}

/*
 * new redrata.feedBackLayer ({
 * 		message :   "string",							// (required)
 *		button 	: 	"button value string", 				// (optional) for permanent messages only, defaults to "ok"
 * 		isPerm	: 	true,								// (optional)
 * 		isError : 	true, 								// (optional) this will override "isInfo : true"
 * 		isInfo  : 	true,								// (optional)
 * 		"class" :	addClass ,							// (optional) already has a class of "rr-message-item"
 * 		life 	: 	time message stays alive (ms),     	// (optional) defaults to time in redrata.messageSettings  ... above
 *
 * });
 */
 redrata.feedBackLayer = Class.create({
	killLayer : function(){
		if(this.timer){
			clearInterval(this.timer);
		}
		this.die(this.messageID,true);
	},
	initialize: function(opts) {
	    var layer = this;
	    layer.opts = opts;
	    layer.messageID = layer.opts.message.replace(/\s/g, "");
	    if(typeof layer.messageID != 'string'){
	    	
	    }else if(typeof redrata.feedbackMessages[layer.messageID] == 'object'){
	        if(layer.opts.isPerm != true){
	        	redrata.repeatedFeedbackmessages[layer.messageID] = null;
	        }
	    } else if($$(".rr-message-layers").length <= 0 || $$(".rr-message-layers-out").length <= 0 || $$(".rr-message-layers-alert").length <= 0){
	    	if(typeof RH == 'object' && typeof RH.onErrorHandler == 'function'){
	    		RH.onErrorHandler("cannot find class '.rr-message-layers' or '.rr-message-layers-out' or '.rr-message-layers-out' \nplace the following into the body element: \n \"<div class=\"rr-message-layers-out\"><div class=\"rr-message-layers-alert\"></div><div class=\"rr-message-layers\"></div></div>\"");
	    	}
	    	//alert("cannot find class '.rr-message-layers' or '.rr-message-layers-out' or '.rr-message-layers-out' \nplace the following into the body element: \n \"<div class=\"rr-message-layers-out\"><div class=\"rr-message-layers-alert\"></div><div class=\"rr-message-layers\"></div></div>\""); 
	    } else {
	        layer.main = $$(".rr-message-layers")[0];
	        layer.currentHeight = $$(".rr-message-layers-out")[0];
	        if(typeof layer.opts["class"] == "undefined"){
	            layer.opts["class"] = "";
	        }
	        layer.opts["class"] += " rr-message-item ";
			if(layer.opts.isError && layer.opts.isInfo){ layer.opts.isInfo = false; }//if info and error are set true, overide info and just have error set to true
	      	//*****************message life taken from redrata.messageSettings*****************
	        if(layer.opts.isInfo){
		        layer.life  = redrata.messageSettings["info"].lifeTime;  layer.opts["class"] += " "+redrata.messageSettings["info"]["class"]+" ";       //is an info message
	        } else if (layer.opts.isError){
		        layer.life = redrata.messageSettings["error"].lifeTime;  layer.opts["class"] += " "+redrata.messageSettings["error"]["class"]+" ";       //is an error message
	    	} else {
		        layer.life = redrata.messageSettings["default"].lifeTime;layer.opts["class"] += " "+redrata.messageSettings["default"]["class"]+" ";   //is a  normal message
	    	}
	        if(layer.opts.isPerm){
		    	layer.opts["class"] +=" " + redrata.messageSettings["permanent"]["class"]+" ";
		    	layer.life = 10;
		    }
	        if(!isNaN(layer.opts.life)){layer.life = layer.opts.life}
	        //*****************Main layer message element*****************
	        layer.main.message = new Element('div', { 'class': layer.opts["class"],'style':'display:none;' }).update("<div><span class=\""+redrata.messageSettings["icon"]["class"]+"\"></span>"+layer.opts.message.replace(/\n/gm,"<br/>")+"</div>");
	        layer.main.insertBefore(layer.main.message,layer.main.firstChild);         
			//**drop down the new Main layer message element***
	        new Effect.SlideDown($(layer.main.message), { duration: 0.2,
		        afterFinish:function(){
	            	$(document.body).setStyle({paddingBottom: (document.viewport.getHeight() - $(layer.currentHeight).offsetTop) + "px"}); //sets padding on the body by getting height of container all message layer stuff is in
	        }});
	        // function to start the layers life counting down till death at which point it slides up and gets removed
	        // if a message gets added twice this picks that up with typeof redrata.repeatedFeedbackmessages[id] == "object"
	        // and starts the layer.die method again
			layer.die = function(id,kill){
				layer.count = 0;
				layer.timer = setInterval(function(){
					layer.count++;
			        if(typeof redrata.repeatedFeedbackmessages[id] == "object"){
			           	clearInterval(layer.timer);
			           	delete redrata.repeatedFeedbackmessages[id];
			           	layer.die(id);
			        }else if(layer.count*100 > layer.life && redrata.feedbackMessages[id] || kill && redrata.feedbackMessages[id]){
				        new Effect.SlideUp(redrata.feedbackMessages[id].element, { duration: 0.2,afterFinish:function(){
						redrata.feedbackMessages[id].element.remove();
			            delete redrata.feedbackMessages[id];
			            $(document.body).setStyle({paddingBottom: (document.viewport.getHeight() - $(layer.currentHeight).offsetTop) + "px"});//sets padding on the body by getting height of container all message layer stuff is in
			        }});
					if(layer.opts.isPerm){redrata.permanent--;}
					 	clearInterval(layer.timer);
		           	}
			    }, 100);
			};
			if(!layer.opts.isPerm){
				//activate elements countdown to death
	        	layer.die(layer.messageID);
	        	//add messages element and message type (perm or not) to redrata.feedbackMessages array with the message as the key
	        	redrata.feedbackMessages[layer.messageID] =  {element:layer.main.message,perm:false,object : layer};
	        } else {
	        	//add messages element and message type (perm or not) to redrata.feedbackMessages array with the message as the key
	        	redrata.feedbackMessages[layer.messageID] =  {element:layer.main.message,perm:true,object : layer};  
				if(redrata.permanent == null || !redrata.permanent){
	                redrata.permanent = 1;      
	            } else {
	                redrata.permanent++;
	            }
				if(redrata.messagetimer != null){ 
	                clearInterval(redrata.messagetimer);
	            }
				//alerter
                new Alerter((redrata.permanent) + " message"+ (redrata.permanent == 1?"":"s")+" needing attention.  <a href=\"javascript:redrata.killAllPermanentFeedBackLayers()\"> Hide all messages.</a>");
                redrata.messagetimer = setInterval(function(){
                    new Alerter((redrata.permanent) + " message"+ (redrata.permanent == 1?"":"s")+" needing attention.  <a href=\"javascript:redrata.killAllPermanentFeedBackLayers()\"> Hide all messages.</a>");   
                },redrata.messageSettings.permAlert.interval+500);   
				layer.main.confirm = new Element('a').update(layer.opts.button != null && layer.opts.button != ""? layer.opts.button:redrata.messageSettings.permButton.defaultText);
	            $(layer.main.confirm).observe("click",function(evt){
	                $(evt.target).fade();
	                layer.alertElement = $$(".rr-message-layers-alert")[0];
	                if(redrata.permanent == 0){
	                    clearInterval(redrata.messagetimer);
	                    redrata.messagetimer = null;
	                    layer.alertElement.update("");
	                }else if(redrata.permanent > 0){
	                	layer.alertElement.update((redrata.permanent) + " message"+ (redrata.permanent == 1?"":"s")+" needing attention.  <a href=\"javascript:redrata.killAllPermanentFeedBackLayers()\"> Hide all messages. </a>");
	                }
	                //activate elements death with a countdown of 10ms
	                layer.die(layer.messageID);
	            });
	            layer.main.message.appendChild(layer.main.confirm);
	        }
	    }
    }
});

var Alerter = Class.create({      
    initialize: function(val) {
        var alerter = this;
        alerter.alertElement =  $$(".rr-message-layers-alert")[0];
        alerter.alertElement.update(val);
        if(redrata.permanent == 0){
        	clearInterval(redrata.messagetimer);
        	alerter.alertElement.update("");
        }  
        new Effect.Morph($(alerter.alertElement), {
        	queue: {position: 'front',scope:"message-alerter",limit:2},
            style: 'background-color:'+redrata.messageSettings.permAlert.color2+";",
            duration: (redrata.messageSettings.permAlert.interval/1000)/4
        });
        new Effect.Morph($(alerter.alertElement), {
        	queue: {position: 'end',scope:"message-alerter",limit:2},
            delay:(redrata.messageSettings.permAlert.interval/1000)/2,
            style: 'background-color:'+redrata.messageSettings.permAlert.color1+";",
            duration: (redrata.messageSettings.permAlert.interval/1000)/4
        });          
    }
});