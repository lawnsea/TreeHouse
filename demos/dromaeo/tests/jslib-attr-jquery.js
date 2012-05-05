startTest("jslib-attr-jquery");

// Try to force real results
var ret, tmp, div;

var html = document.body.innerHTML;

	prep(function(){
		div = jQuery("div");
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		document.body.appendChild( tmp );
	});

	test("jQuery - addClass", function(){
		for ( var i = 0; i < 10; i++ )
		div.addClass("foo");
	});

	test("jQuery - removeClass", function(){
		for ( var i = 0; i < 10; i++ )
		div.removeClass("foo");
	});

	test("jQuery - hasClass x10", function(){
		for ( var i = 0; i < 100; i++ )
		ret = div.hasClass("test");
	});

	test("jQuery - attr(class) x100", function(){
		for ( var i = 0; i < 1000; i++ )
		ret = div.attr("class");
	});

	test("jQuery - attr(class,test)", function(){
		for ( var i = 0; i < 10; i++ )
		div.attr("class","test");
	});

	test("jQuery - removeAttribute", function(){
		for ( var i = 0; i < 10; i++ )
		div.removeAttr("id");
	});

endTest();

