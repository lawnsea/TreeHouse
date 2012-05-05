startTest("jslib-attr-prototype");

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

	test("Prototype - addClassName", function(){
		for ( var i = 0; i < 10; i++ )
		div.invoke("addClassName", "foo");
	});

	test("Prototype - removeClassName", function(){
		for ( var i = 0; i < 10; i++ )
		div.invoke("removeClassName", "foo");
	});

	test("Prototype - hasClassName", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.invoke("hasClassName", "test");
	});

	test("Prototype - readAttribute", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.invoke("readAttribute", "class");
	});

	test("Prototype - writeAttribute", function(){
		for ( var i = 0; i < 10; i++ )
		div.invoke("writeAttribute","class","test");
	});

	/* ???
	test("Prototype - removeAttribute", function(){
	});
	*/

endTest();

