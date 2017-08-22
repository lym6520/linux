HighlightAll = function(name, showGutter /* optional */, showControls /* optional */, collapseAll /* optional */, firstLine /* optional */, showColumns /* optional */)
{
	function FindValue()
	{
		var a = arguments;
		
		for(var i = 0; i < a.length; i++)
		{
			if(a[i] == null)
				continue;
				
			if(typeof(a[i]) == 'string' && a[i] != '')
				return a[i] + '';
		
			if(typeof(a[i]) == 'object' && a[i].value != '')
				return a[i].value + '';
		}
		
		return null;
	}
	
	function IsOptionSet(value, list)
	{
		for(var i = 0; i < list.length; i++)
			if(list[i] == value)
				return true;
		
		return false;
	}
	
	function GetOptionValue(name, list, defaultValue)
	{
		var regex = new RegExp('^' + name + '\\[(\\w+)\\]$', 'gi');
		var matches = null;

		for(var i = 0; i < list.length; i++)
			if((matches = regex.exec(list[i])) != null)
				return matches[1];
		
		return defaultValue;
	}
	
	function FindTagsByName(list, name, tagName)
	{
		var tags = document.getElementsByTagName(tagName);

		for(var i = 0; i < tags.length; i++)
			if(tags[i].className.indexOf(name) > -1)
				list.push(tags[i]);
	}

	var elements = [];
	var highlighter = null;
	var registered = {};
	var propertyName = 'innerHTML';

	// for some reason IE doesn't find <pre/> by name, however it does see them just fine by tag name... 
	FindTagsByName(elements, name, 'pre');
	FindTagsByName(elements, name, 'textarea');

	if(elements.length == 0)
		return;

	// register all brushes
	for(var brush in dp.sh.Brushes)
	{
		var aliases = dp.sh.Brushes[brush].Aliases;

		if(aliases == null)
			continue;
		
		for(var i = 0; i < aliases.length; i++)
			registered[aliases[i]] = brush;
	}

	for(var i = 0; i < elements.length; i++)
	{
		var element = elements[i];
		var options = FindValue(
                		element.attributes['lang'], element.lang,
				element.attributes['class'], element.className, 
				element.attributes['language'], element.language
				);
		var language = '';
		
		if(options == null)
			continue;
		
		options = options.split(':');
		
		language = options[0].toLowerCase();

		if(registered[language] == null)
			continue;
		
		// instantiate a brush
		highlighter = new dp.sh.Brushes[registered[language]]();
		
		// hide the original element
		element.style.display = 'none';

		highlighter.noGutter = (showGutter == null) ? IsOptionSet('nogutter', options) : !showGutter;
		highlighter.addControls = (showControls == null) ? !IsOptionSet('nocontrols', options) : showControls;
		highlighter.collapse = (collapseAll == null) ? IsOptionSet('collapse', options) : collapseAll;
		highlighter.showColumns = (showColumns == null) ? IsOptionSet('showcolumns', options) : showColumns;

		// write out custom brush style
		if(highlighter.Style)
			document.write('<style>' + highlighter.Style + '</style>');
		
		// first line idea comes from Andrew Collington, thanks!
		highlighter.firstLine = (firstLine == null) ? parseInt(GetOptionValue('firstline', options, 1)) : firstLine;

		highlighter.Highlight(element[propertyName]);
		
		highlighter.source = element;
		element.parentNode.insertBefore(highlighter.div, element);
	}	
}
HighlightAll('code');

