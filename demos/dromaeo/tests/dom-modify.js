startTest("dom-modify");

// Try to force real results
var ret, tmp, str;

var elems = [];
var root = document.getElementById('root');
var htmlstr = root.innerHTML;
var div = document.createElement("div");
var num = 400;

for ( var i = 0; i < 1024; i++ )
        str += String.fromCharCode( (25 * Math.random()) + 97 );

	test( "createElement", function(){
		for ( var i = 0; i < num; i++ ) {
			ret = document.createElement("div");
			ret = document.createElement("span");
			ret = document.createElement("table");
			ret = document.createElement("tr");
			ret = document.createElement("select");
		}
	});

	test( "createTextNode", function(){
		for ( var i = 0; i < num; i++ ) {
			ret = document.createTextNode(str);
			ret = document.createTextNode(str + "2");
			ret = document.createTextNode(str + "3");
			ret = document.createTextNode(str + "4");
			ret = document.createTextNode(str + "5");
		}
	});

	/* Need a better way to test this
	test( "removeChild", function(){
		while ( root.firstChild )
			root.removeChild( root.firstChild );
	});
	*/

	test( "innerHTML", function(){
		root.innerHTML = htmlstr;
	});

	prep(function(){
		elems = [];
		var telems = root.childNodes;
		for ( var i = 0; i < telems.length; i++ )
			elems.push( telems[i] );
	});
	
	test( "cloneNode", function(){
		for ( var i = 0; i < elems.length; i++ ) {
			ret = elems[i].cloneNode(false);
			ret = elems[i].cloneNode(true);
			ret = elems[i].cloneNode(true);
		}
	});

	test( "appendChild", function(){
		for ( var i = 0; i < elems.length; i++ )
			root.appendChild( elems[i] );
	});

	test( "insertBefore", function(){
		for ( var i = 0; i < elems.length; i++ )
			root.insertBefore( elems[i], root.firstChild );
	});

endTest();

