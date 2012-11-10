require(['jsdom'], function(jsdom) {
    var doc = jsdom.jsdom("<html><head></head><body>hello world</body></html>"),
        win = doc.createWindow();

    console.log(win.document.innerHTML);
    // output: '<html><head></head><body>hello world</body></html>'

    console.log(win.innerWidth)
    // output: 1024

    console.log(typeof win.document.getElementsByClassName);
    // outputs: function    
});
