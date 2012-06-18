startTest("dom-query");

// Try to force real results
var ret, tmp;
var num = 40;
var root = document.getElementById('root');
var html = root.innerHTML;

	prep(function(){
		html = html.replace(/id="test(\w).*?"/g, 'id="test$1' + num + '"');
		html = html.replace(/name="test.*?"/g, 'name="test' + num + '"');
		html = html.replace(/class="foo.*?"/g, 'class="foo test' + num + ' bar"');
		var div = document.createElement("div");
		div.innerHTML = html;
		root.appendChild( div );
	});

	test( "getElementById", function(){
		for ( var i = 0; i < num * 30; i++ ) {
			ret = document.getElementById("testA" + num).nodeType;
			ret = document.getElementById("testB" + num).nodeType;
			ret = document.getElementById("testC" + num).nodeType;
			ret = document.getElementById("testD" + num).nodeType;
			ret = document.getElementById("testE" + num).nodeType;
			ret = document.getElementById("testF" + num).nodeType;
		}
	});

	test( "getElementById (not in document)", function(){
		for ( var i = 0; i < num * 30; i++ ) {
			ret = document.getElementById("testA");
			ret = document.getElementById("testB");
			ret = document.getElementById("testC");
			ret = document.getElementById("testD");
			ret = document.getElementById("testE");
			ret = document.getElementById("testF");
		}
	});

	test( "getElementsByTagName(div)", function(){
		for ( var i = 0; i < num; i++ ) {
			var elems = document.getElementsByTagName("div");
			ret = elems[elems.length-1].nodeType;
		}
	});

	test( "getElementsByTagName(p)", function(){
		for ( var i = 0; i < num; i++ ) {
			var elems = document.getElementsByTagName("p");
			ret = elems[elems.length-1].nodeType;
		}
	});

	test( "getElementsByTagName(a)", function(){
		for ( var i = 0; i < num; i++ ) {
			var elems = document.getElementsByTagName("a");
			ret = elems[elems.length-1].nodeType;
		}
	});

	test( "getElementsByTagName(*)", function(){
		for ( var i = 0; i < num; i++ ) {
			var elems = document.getElementsByTagName("*");
			ret = elems[elems.length-1].nodeType;
		}
	});

	test( "getElementsByTagName (not in document)", function(){
		for ( var i = 0; i < num; i++ ) {
			var elems = document.getElementsByTagName("strong");
			ret = elems.length == 0;
		}
	});

	test( "getElementsByName", function(){
		for ( var i = 0; i < num * 20; i++ ) {
			var elems = document.getElementsByName("test" + num);
			ret = elems[elems.length-1].nodeType;
			var elems = document.getElementsByName("test" + num);
			ret = elems[elems.length-1].nodeType;
			var elems = document.getElementsByName("test" + num);
			ret = elems[elems.length-1].nodeType;
			var elems = document.getElementsByName("test" + num);
			ret = elems[elems.length-1].nodeType;
		}
	});

	test( "getElementsByName (not in document)", function(){
		for ( var i = 0; i < num * 20; i++ ) {
			ret = document.getElementsByName("test").length == 0;
			ret = document.getElementsByName("test").length == 0;
			ret = document.getElementsByName("test").length == 0;
			ret = document.getElementsByName("test").length == 0;
			ret = document.getElementsByName("test").length == 0;
		}
	});

endTest();

