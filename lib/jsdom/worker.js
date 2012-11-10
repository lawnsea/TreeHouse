importScripts('require.js')

require({ baseUrl: './' }, ['jsdom'], function(jsdom) {
    var doc = jsdom.jsdom("<html><head></head><body>hello world</body></html>"),
        win = doc.createWindow();

    postMessage('jsdom was required');
    postMessage(win.document.innerHTML);
    // output: '<html><head></head><body>hello world</body></html>'

    postMessage(win.innerWidth)
    // output: 1024

    postMessage(typeof win.document.getElementsByClassName);
    // outputs: function    

});
