startTest("jslib-event-jquery");

// Try to force real results
var ret, tmp, div;

var root = document.getElementById('root');
var html = root.innerHTML;

function testfn(){}

	prep(function(){
		div = $("#root div");
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		root.appendChild( tmp );
	});

	test("$ - bind", function(){
		for ( var i = 0; i < 10; i++ )
		div.bind("click", testfn);
	});

	test("$ - trigger", function(){
		for ( var i = 0; i < 10; i++ )
		div.trigger("click");
	});

	test("$ - unbind x10", function(){
		for ( var i = 0; i < 100; i++ )
		div.unbind("click", testfn);
	});

endTest();

