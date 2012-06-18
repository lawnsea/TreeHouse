startTest("jslib-traverse-jquery");

// Try to force real results
var ret, tmp, div, dd;

var root = document.getElementById('root');
var html = root.innerHTML;

	prep(function(){
		div = $("#root div");
		dd = $("dd");
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		root.appendChild( tmp );
	});

	test("$ - parent x10", function(){
		for ( var i = 0; i < 100; i++ )
		ret = div.parent().length;
	});

	test("$ - parents x10", function(){
		for ( var i = 0; i < 100; i++ )
		ret = div.parents().length;
	});

	test("$ - prev x10", function(){
		for ( var i = 0; i < 100; i++ )
		ret = div.prev().length;
	});

	test("$ - prevAll", function(){
		for ( var i = 0; i < 10; i++ )
		ret = dd.prevAll().length;
	});

	test("$ - next x10", function(){
		for ( var i = 0; i < 100; i++ )
		ret = div.next().length;
	});

	test("$ - nextAll", function(){
		for ( var i = 0; i < 10; i++ )
		ret = dd.nextAll().length;
	});

	test("$ - siblings", function(){
		for ( var i = 0; i < 10; i++ )
		ret = dd.siblings().length;
	});

	test("$ - children", function(){
		for ( var i = 0; i < 10; i++ )
		ret = div.children().length;
	});

endTest();

