

/* HTML
 * 
 * 	<div id="rrid-slider-type" class="rr-slide-component">
		<input type="hidden" name="ram" id="rrid-slider-value" value="0"/>
	</div>
 */	


/*JAVASCRIPT
 * 
 * 
 * 	var slider = new slider($(hidden-input-field),[Range-min,Range-max], default value);
	slider.toValue(function(position,min,max,update){
		position = Percentage of the bar the slider is at
		if(update){
			ui stuff you want to update
		}
		return (number that slider is at worked out from the "postion")
	});
	dataSlider.toPercent(function(value,min,max,update){
		value = current value that the slider is at
		if(update){
			ui stuff you want to update
		}
		return (percentage that the slider is at worked out from "value")
	})
*/

	function slider(parent,data,defaultVal,suffix,textFieldId) {
			var slider = this;
			var rangemin = data.range[0];
			var rangemax = data.range[data.range.length-1];		
			var barWidth = 480;
			
			slider.parent = parent;
			slider.mouseDown = false
			slider.defaultValue = defaultVal;
			slider.textFieldId = textFieldId;
			
			slider.repo = function(value,update) {					
				var nextpreset = 0;
				var unitdist = 100/(data.range.length-1);	
				for(var i = 1; i < data.range.length; i++) {
					if (value < data.range[i] || i >= data.range.length-1) {
						nextpreset = i;
						break;
					}
				}				
				var position = unitdist * ((nextpreset - 1) + ((value - data.range[i-1]) / (data.range[i]-data.range[i-1])) );
				if (update) {					
					$(parent).getElementsBySelector(".rr-slider-label")[0].value = value;
					recordCustomPlan(suffix,Math.round(value));
				}				
				return position;
			}	
			
			slider.move = function(position,update) {
				var nextpreset = 0;
				var unitdist = 100/(data.range.length-1);			
				for (var i = 1; i < data.range.length; i++) {				
					if (position < unitdist*i || i >= data.range.length-1) {
						nextpreset = i;
						break;
					}
				}	
				var val = data.range[i-1] + ((data.range[i]-data.range[i-1])*((position-(i-1)*unitdist)/unitdist));
				if (update) {
					selectCustomPlan();
					$(parent).getElementsBySelector(".rr-slider-label")[0].value = Math.round(val);
					recordCustomPlan(suffix,Math.round(val));
				}
				if (refreshErrors()) {
					return Math.round(val);
				}
				$('rrid-spinner-holder').removeClassName('rr-is-hidden');
				if(fetchTimer != null) {
					clearTimeout(fetchTimer);
				}
				fetchTimer = setTimeout(function() {
					fetchPlanRoView();
				},fetchTimerInterval);
				return Math.round(val);
			}
			
			slider.setValue = function(value) {
				if (!slider.isValueValid(value)) { //if value is not valid, we store it and set slider to minimum
					$(slider.formControl).value = value;
					loc = 0;
					$(slider.button).setStyle({ left : (loc + 43)  + "px" })
					$(slider.bar.fill).setStyle({ width : loc + "px"});
				} else {
					value = Math.min(value,rangemax);
					value = Math.max(value,rangemin);			
					loc = (barWidth * (slider.repo(value,true) / 100));
					$(slider.button).setStyle({ left : (loc + 43)  + "px" })
					$(slider.bar.fill).setStyle({ width : loc + "px"});
				}
				return value;
			}
			
			slider.isValueValid = function(value) {
				if (isNaN(value) || (value + '').indexOf('.') > -1) {
					return false;
				}
				if (value > rangemax || value < rangemin) {
					return false;
				}
				return true;
			}
			
			return {
				create : function(){
					comp = slider.parent;
					slider.bar = new Element('div', { 'class': 'rr-slide-range' });
					comp.appendChild(slider.bar);
					slider.bar.fill = new Element('div', { 'class': 'rr-slide-color rr-transition-04' });
					slider.button = new Element('div', { 'class': 'rr-slide-button rr-transition-04' });
					slider.bar.appendChild(slider.bar.fill);
					slider.bar.appendChild(slider.button);
					$(slider.parent).appendChild(slider.bar);
					slider.formControl = $(slider.parent).getElementsBySelector(".rr-slider-value")[0];
					slider.bar.labels = new Element('span', { 'class': 'rr-slide-scale' });
					slider.bar.labels.tag = [];
					$(slider.bar).observe("mousedown", function(evt){
						slider.mouseDown = true;
						$(slider.button).removeClassName('rr-transition-04');
						$(slider.bar.fill).removeClassName('rr-transition-04');
						slider.pos =(Event.pointerX(evt) - $(slider.bar).viewportOffset().left + 43);
						slider.p = (((Event.pointerX(evt) - $(slider.bar).viewportOffset().left) / $(slider.bar).getWidth()) * 100);
						if(slider.p <= 100 && slider.p >= 0){
							slider.value = slider.move(slider.p,true);
							$(slider.formControl).value = slider.value;
							$(slider.button).setStyle({ left : slider.pos  + "px" })
							$(slider.bar.fill).setStyle({ width : (slider.pos - 43) + "px"});
						}
					});
					for( var i = 0 ; i < data.range.length ; i++){
						var val = data.range[i];
						var x = 100*i/(data.range.length-1);
						slider.bar.labels.tag[x] =  new Element('span', { style: 'margin-left:'+(barWidth * (x / 100))+'px' }).update("<span class='rr-number-selector'>"+val+"</span>");
						$(slider.bar.labels.tag[x]).gotoValue = val;
						slider.bar.labels.appendChild(slider.bar.labels.tag[x]);
						slider.bar.labels.tag[x].getElementsBySelector('.rr-number-selector')[0].observe('mousedown', function(evt){
							selectCustomPlan();
							slider.setValue($(evt.target.parentNode).gotoValue);			
							if (!refreshErrors()) {
								fetchPlanRoView();
							}
						});
					}
					$(slider.parent).appendChild(slider.bar.labels);
					$(slider.button).observe('mousedown', function(evt){ 
						slider.mouseDown = true;
						$(slider.button).removeClassName('rr-transition-04');
						$(slider.bar.fill).removeClassName('rr-transition-04');
					});
					$$("body")[0].observe('mousemove', function(evt){
						if(slider.mouseDown){
							var wid = barWidth;
							var lef = $(slider.bar).viewportOffset().left;
							slider.pos = Math.max(Math.min((Event.pointerX(evt) - lef + 43),wid+43),43);
							slider.p = Math.max(Math.min((((Event.pointerX(evt) - lef) / wid) * 100),100),0);
							slider.value = slider.move(slider.p,rangemin,rangemax,true);
							$(slider.formControl).value =  slider.value;
							$(slider.button).setStyle({ left : slider.pos  + "px" })
							$(slider.bar.fill).setStyle({ width : (slider.pos - 43) + "px"});
						}
					});
					$$("body")[0].observe('mouseup', function(evt){
						slider.mouseDown = false;
						$(slider.button).addClassName('rr-transition-04');
						$(slider.bar.fill).addClassName('rr-transition-04');
					});
					slider.setValue(slider.defaultValue);
				},
				changeToValue : slider.setValue,
				isValueValid : slider.isValueValid,
				parent : slider.parent,
				range : data.range,
				textFieldId : slider.textFieldId
			}
		}
	
 /**
  * Other js, used by rh / rh2 only
  */
	
document.on('click', '.rr-cpu-expand',  function (evt,element){
	if(element.hasClassName('rr-cpu-contract')){ $(element).removeClassName('rr-cpu-contract'); } 
	else { 	$(element).addClassName('rr-cpu-contract'); }
});
	
