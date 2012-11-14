define([
    './core', '../level2/html'
],
function (_core, _html) {
    var core = _core.dom.level3.core,
        html = _html.dom.level2.html,
        exports = {};

    exports.dom = {
      level3 : {
        html : html,
        core : core
      }
    };

    return exports;
});
