setPolicy({
    '!api': {
        importScripts: function (name, script) {
            return script === '../demos/zepto.js';
        }
    }
});
