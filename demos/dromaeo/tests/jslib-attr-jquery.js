startTest("jslib-attr-jquery");

// Try to force real results
var ret, tmp, div;

var root = document.getElementById('root');
var html = root.innerHTML;

	prep(function(){
		div = $("div");
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		root.appendChild( tmp );
	});

	test("$ - addClass", function(){
		for ( var i = 0; i < 10; i++ )
		div.addClass("foo");
	});

	test("$ - removeClass", function(){
		for ( var i = 0; i < 10; i++ )
		div.removeClass("foo");
	});

	test("$ - hasClass x10", function(){
		for ( var i = 0; i < 100; i++ )
		ret = div.hasClass("test");
	});

	test("$ - attr(class) x100", function(){
		for ( var i = 0; i < 1000; i++ )
		ret = div.attr("class");
	});

	test("$ - attr(class,test)", function(){
		for ( var i = 0; i < 10; i++ )
		div.attr("class","test");
	});

	test("$ - removeAttribute", function(){
		for ( var i = 0; i < 10; i++ )
		div.removeAttr("id");
	});

endTest();

