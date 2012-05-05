startTest("jslib-modify-prototype");

// Try to force real results
var ret, tmp, div, a, dd;

var root = document.getElementById('root');
var html = root.innerHTML,
	elem = document.createElement("div"),
	elem2 = document.createElement("strong"),
	elemStr = "<strong>some text</strong>";

	prep(function(){
		a = $$("a");
		dd = $$("dd");
		div = $$("#root div");
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		root.appendChild( tmp );
	});

	/* // Need a good way to test this
	test("Prototype - wrap()", function(){
		div.invoke("wrap", "div");
	});
	*/

	test("Prototype - update()", function(){
		dd.invoke("update", elemStr);
	});

	test("Prototype - before", function(){
        self.inTest = true;
		div.invoke("insert", {before: elemStr});
	});

    // Fails b/c the kernel gets a removal with a null target
	test("Prototype - after", function(){
		div.invoke("insert", {after: elemStr});
	});

    // Fails b/c the kernel gets a removal with a null target
	test("Prototype - prepend", function(){
		div.invoke("insert", {top: elemStr});
	});

	test("Prototype - append", function(){
		div.invoke("insert", {bottom: elemStr});
	});

	/* // Need a good way to test
	test("Prototype - replace()", function(){
		div.invoke("replace", elem );
	});

	test("Prototype - remove()", function(){
		div.invoke("remove");
	});
	*/

endTest();
