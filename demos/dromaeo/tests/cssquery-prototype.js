startTest("cssquery-prototype");

// Try to force real results
var ret, tmp;

var root = document.getElementById('root');
var html = root.innerHTML;

	prep(function(){
		var div = document.createElement("div");
		div.innerHTML = html;
		root.appendChild( div );
	});

	test("Prototype - *", function(){
		$$("*");
	});

	test("Prototype - div:only-child", function(){
		$$("div:only-child");
	});

	test("Prototype - div:first-child", function(){
		$$("div:first-child");
	});

	test("Prototype - div:nth-child(even)", function(){
		$$("div:nth-child(even)");
	});

	test("Prototype - div:nth-child(2n)", function(){
		$$("div:nth-child(2n)");
	});

	test("Prototype - div:nth-child(odd)", function(){
		$$("div:nth-child(odd)");
	});

	test("Prototype - div:nth-child(2n+1)", function(){
		$$("div:nth-child(2n+1)");
	});

	test("Prototype - div:nth-child(n)", function(){
		$$("div:nth-child(n)");
	});

	test("Prototype - div:last-child", function(){
		$$("div:last-child");
	});

	test("Prototype - div > div", function(){
		$$("div > div");
	});

	test("Prototype - div + div", function(){
		$$("div + div");
	});

	test("Prototype - div ~ div", function(){
		$$("div ~ div");
	});

	test("Prototype - body", function(){
		$$("body");
	});

	test("Prototype - body div", function(){
		$$("body div");
	});

	test("Prototype - div", function(){
		$$("div");
	});

	test("Prototype - div div", function(){
		$$("div div");
	});

	test("Prototype - div div div", function(){
		$$("div div div");
	});

	test("Prototype - div, div, div", function(){
		$$("div, div, div");
	});

	test("Prototype - div, a, span", function(){
		$$("div, a, span");
	});

	test("Prototype - .dialog", function(){
		$$(".dialog");
	});

	test("Prototype - div.dialog", function(){
		$$("div.dialog");
	});

	test("Prototype - div .dialog", function(){
		$$("div .dialog");
	});

	test("Prototype - div.character, div.dialog", function(){
		$$("div.character, div.dialog");
	});

	test("Prototype - #speech5", function(){
		$$("#speech5");
	});

	test("Prototype - div#speech5", function(){
		$$("div#speech5");
	});

	test("Prototype - div #speech5", function(){
		$$("div #speech5");
	});

	test("Prototype - div.scene div.dialog", function(){
		$$("div.scene div.dialog");
	});

	test("Prototype - div#scene1 div.dialog div", function(){
		$$("div#scene1 div.dialog div");
	});

	test("Prototype - #scene1 #speech1", function(){
		$$("#scene1 #speech1");
	});

	test("Prototype - div[class]", function(){
		$$("div[class]");
	});

	test("Prototype - div[class=dialog]", function(){
		$$("div[class=dialog]");
	});

	test("Prototype - div[class^=dia]", function(){
		$$("div[class^=dia]");
	});

	test("Prototype - div[class$=log]", function(){
		$$("div[class$=log]");
	});

	test("Prototype - div[class*=sce]", function(){
		$$("div[class*=sce]");
	});

	test("Prototype - div[class|=dialog]", function(){
		$$("div[class|=dialog]");
	});

	test("Prototype - div[class~=dialog]", function(){
		$$("div[class~=dialog]");
	});

endTest();

