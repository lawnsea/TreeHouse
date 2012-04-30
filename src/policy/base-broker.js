self.basePolicy = (function () {
    var URI_PATTERN = new RegExp('^(?:http|https):\\/\\/.+');
    var URL_PATTERN = new RegExp('^url\\(');

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
