startTest("dom-attr");

// Try to force real results
var ret, tmp;

var elem = document.getElementById("test1");
var a = document.getElementsByTagName("a")[0];
var num = 10240;
    
    test( "getAttribute", function(){
        for ( var i = 0; i < num; i++ )
            ret = elem.getAttribute("id");
    });

    test( "element.property", function(){
        for ( var i = 0; i < num * 2; i++ )
            ret = elem.id;
    });

    test( "setAttribute", function(){
        for ( var i = 0; i < num; i++ )
            a.setAttribute("id", "foo");
    });

    test( "element.property = value", function(){
        for ( var i = 0; i < num; i++ )
            a.id = "foo";
    });

    test( "element.expando = value", function(){
        for ( var i = 0; i < num; i++ )
            a["test" + num] = function(){};
    });

    test( "element.expando", function(){
        for ( var i = 0; i < num; i++ )
            ret = a["test" + num];
    });

endTest();
