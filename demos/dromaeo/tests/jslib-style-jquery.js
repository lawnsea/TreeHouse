startTest("jslib-style-jquery");

// Try to force real results
var ret, tmp, div;

var root = document.getElementById('root');
var html = root.innerHTML;

	prep(function(){
		div = $("#root div");
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		root.appendChild( tmp );
	});

	test("$ - css(color) x100", function(){
		for ( var i = 0; i < 1000; i++ )
		ret = div.css("color");
	});

	test("$ - css(color,red)", function(){
		for ( var i = 0; i < 10; i++ )
		div.css("color","red");
	});

	test("$ - height() x10", function(){
		for ( var i = 0; i < 100; i++ )
		ret = div.height();
	});

	test("$ - width() x10", function(){
		for ( var i = 0; i < 100; i++ )
		ret = div.width();
	});

	test("$ - .is(:visible)", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.is(":visible");
	});

	test("$ - .show()", function(){
		for ( var i = 0; i < 10; i++ )
		div.show();
	});

	test("$ - .hide()", function(){
		for ( var i = 0; i < 10; i++ )
		div.hide();
	});

	test("$ - .toggle()", function(){
		div.toggle();
	});

endTest();

