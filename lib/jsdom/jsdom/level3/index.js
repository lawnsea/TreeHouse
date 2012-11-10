define([
    './core', './xpath', './events', './html', './ls'
],
function (_core, _xpath, _events, _html, _ls) {
    var exports = {};

    exports.dom = {
      level3 : {
        core   : _core.dom.level3.core,
        xpath  : _xpath.xpath,
        events : _events.dom.level3.events,
        html   : _html.dom.level3.html,
      }
    };

    exports.dom.ls = _ls.dom.level3.ls;

    return exports;
});
