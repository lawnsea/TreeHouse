startTest("jslib-traverse-prototype");

// Try to force real results
var ret, tmp, div, dd;

var root = document.getElementById('root');
var html = root.innerHTML;

	prep(function(){
		div = $$("div");
		dd = $$("dd");
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		root.appendChild( tmp );
	});

	test("Prototype - up", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.invoke("up").length;
	});

	test("Prototype - ancestors", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.invoke("ancestors").length;
	});

	test("Prototype - previous", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.invoke("previous").length;
	});

	test("Prototype - previousSiblings", function(){
		for ( var i = 0; i < 10; i++ )
		ret = dd.invoke("previousSiblings").length;
	});

	test("Prototype - next", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.invoke("next").length;
	});

	test("Prototype - nextSiblings", function(){
		for ( var i = 0; i < 10; i++ )
		ret = dd.invoke("nextSiblings").length;
	});

	test("Prototype - siblings", function(){
		for ( var i = 0; i < 10; i++ )
		ret = dd.invoke("siblings").length;
	});

	test("Prototype - childElements", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.invoke("childElements").length;
	});

endTest();
