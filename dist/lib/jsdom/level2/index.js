define([
    './core', './events', './html'
],
function (_core, _events, _html) {
    var exports = {};

    exports.dom = {
      level2 : {
        core   : _core.dom.level2.core,
        events : _events.dom.level2.events,
        html   : _html.dom.level2.html
      }
    };

    return exports;
});
