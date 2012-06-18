importScripts('../demos/zepto.js');
var $ = window.$;

var span = $('#foo');
span.append($('<span></span>').text('Hello, ').addClass('red'));
span.append($('<span></span>').text('Zepto!').addClass('blue'));
