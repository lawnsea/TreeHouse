self.basePolicy = (function () {
    var UNSAFE_URI_PATTERN = new RegExp('^(?:javascript):.+');
    var URL_PATTERN = new RegExp('^url\\(');

    function isSafeURI(attribute, uri) {
        return ('' + uri).match(UNSAFE_URI_PATTERN) === null;
    }

    return {
        '!api': {
            '*': true,
            XMLHttpRequest: {
                '*': true,
                '!invoke': true,
                '!result': {
                    '*': true, 
                    open: function (method, url, async, user, password) {
                        return async === true;
                    }
                }
            }
        },
        '!elements': {
            '!attributes': {
                '*': true
            },
            '!tags': {
                '*': true
            }
        }
    };
}());
