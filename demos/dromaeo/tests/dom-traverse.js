startTest("dom-traverse");

// Try to force real results
var ret, tmp;
var num = 40;
var root = document.getElementById('root');
var html = root.innerHTML;

	prep(function(){
		html = html.replace(/id="test.*?"/g, 'id="test' + num + '"');
		html = html.replace(/name="test.*?"/g, 'name="test' + num + '"');
		html = html.replace(/class="foo.*?"/g, 'class="foo test' + num + ' bar"');
		var div = document.createElement("div");
		div.innerHTML = html;
		root.appendChild( div );
	});

	test( "firstChild", function(){
		var nodes = root.childNodes, nl = nodes.length;

		for ( var i = 0; i < num; i++ ) {
			for ( var j = 0; j < nl; j++ ) {
				var cur = nodes[j];
				while ( cur )
					cur = cur.firstChild;
				ret = cur;
			}
		}
	});

	test( "lastChild", function(){
		var nodes = root.childNodes, nl = nodes.length;

		for ( var i = 0; i < num; i++ ) {
			for ( var j = 0; j < nl; j++ ) {
				var cur = nodes[j];
				while ( cur )
					cur = cur.lastChild;
				ret = cur;
			}
		}
	});

	test( "nextSibling", function(){
		for ( var i = 0; i < num * 2; i++ ) {
			var cur = root.firstChild;
			while ( cur )
				cur = cur.nextSibling;
			ret = cur;
		}
	});

	test( "previousSibling", function(){
		for ( var i = 0; i < num * 2; i++ ) {
			var cur = root.lastChild;
			while ( cur )
				cur = cur.previousSibling;
			ret = cur;
		}
	});

	test( "childNodes", function(){
		for ( var i = 0; i < num; i++ ) {
			var nodes = root.childNodes;
			for ( var j = 0; j < nodes.length; j++ )
				ret = nodes[j];
		}
	});

endTest();
