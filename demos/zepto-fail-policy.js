setPolicy({
    '!api': {
        importScripts: function (name, script) {
            return script === '../demos/zepto.js';
        }
    },
    '!elements': {
        '!attributes': {
            'span': {
                'class': function (name, value) {
                    return value !== 'blue';
                }
            }
        }
    }
});

