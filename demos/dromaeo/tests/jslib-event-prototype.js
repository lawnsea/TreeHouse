startTest("jslib-event-prototype");

// Try to force real results
var ret, tmp, div;

var root = document.getElementById('root');
var html = root.innerHTML;

function testfn(){}

	prep(function(){
		div = $$("div");
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		root.appendChild( tmp );
	});

	test("Prototype - observe", function(){
		for ( var i = 0; i < 10; i++ )
		div.invoke("observe", "click", testfn);
	});

	test("Prototype - fire", function(){
		for ( var i = 0; i < 10; i++ )
		div.invoke("fire", "click");
	});

	test("Prototype - stopObserving", function(){
		for ( var i = 0; i < 10; i++ )
		div.invoke("stopObserving", "click", testfn);
	});

endTest();
