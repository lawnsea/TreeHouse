startTest("jslib-style-prototype");

// Try to force real results
var ret, tmp, div;

var root = document.getElementById('root');
var html = root.innerHTML;

	prep(function(){
		div = $$("div");
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		root.appendChild( tmp );
	});

	test("Prototype - getStyle()", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.invoke("getStyle","color");
	});

	test("Prototype - setStyle()", function(){
		for ( var i = 0; i < 10; i++ )
		div.invoke("setStyle","color","red");
	});

	test("Prototype - getHeight()", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.invoke("getHeight");
	});

	test("Prototype - getWidth()", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.invoke("getWidth");
	});

	test("Prototype - visible()", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.invoke("visible");
	});

	test("Prototype - .show()", function(){
		for ( var i = 0; i < 10; i++ )
		div.invoke("show");
	});

	test("Prototype - .hide()", function(){
		for ( var i = 0; i < 10; i++ )
		div.invoke("hide");
	});

	test("Prototype - .toggle() x10", function(){
		for ( var i = 0; i < 10; i++ )
		div.invoke("toggle");
	});

endTest();

