startTest("jslib-modify-jquery");

// Try to force real results
var ret, tmp, div, a, dd;

var root = document.getElementById('root');
var html = root.innerHTML,
	elem = document.createElement("div"),
	elem2 = document.createElement("strong"),
	elemStr = "<strong>some text</strong>";

	prep(function(){
		a = $("a");
		dd = $("dd");
		div = $("#root div");
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		root.appendChild( tmp );
	});

	/* // Need to find a good way to test this
	test("$ - wrap()", function(){
		div.wrap( elem );
	});
	*/

	test("$ - html()", function(){
		dd.html( elemStr );
	});

	test("$ - before()", function(){
		div.before( elemStr );
	});

	test("$ - after()", function(){
		div.before( elemStr );
	});

	test("$ - prepend()", function(){
		div.prepend( elemStr );
	});

	test("$ - append()", function(){
		div.append( elemStr );
	});

	/* // Need a good way to test
	test("$ - replaceWith()", function(){
		div.replaceWith( elem );
	});

	test("$ - remove()", function(){
		div.remove();
	});
	*/

endTest();
