(function (global) {
    'use strict';

    var whitelist = [
        'Array', 'ArrayBuffer', 'Boolean', 'DataView', 'Date', 'Error',
        'EvalError', 'EventSource', 'FileError', 'FileException',
        'Float32Array', 'Float64Array', 'Function', 'Infinity', 'Int16Array',
        'Int32Array', 'Int8Array', 'JSON', 'Math', 'MessageEvent', 'NaN',
        'Number', 'Object', 'PERSISTENT', 'RangeError', 'ReferenceError',
        'RegExp', 'String', 'SyntaxError', 'TEMPORARY', 'TypeError', 'URIError',
        'Uint16Array', 'Uint32Array', 'Uint8Array', 'WebKitBlobBuilder',
        'WebKitFlags', 'WorkerLocation', 'clearInterval', 'clearTimeout',
        'close', 'decodeURI', 'decodeURIComponent', 'dispatchEvent',
        'encodeURI', 'encodeURIComponent', 'escape', 'eval', 'isFinite',
        'isNaN', 'location', 'navigator', 'onerror', 'parseFloat', 'parseInt',
        'removeEventListener', 'self', 'setInterval', 'setTimeout', 'undefined',
        'unescape', 'webkitURL',

        // these likely are not needed
        'win', 'window', 'doc', 'document', 'initBroker'
    ];

    function freeze(key, val) {
        Object.defineProperty(global, key, {
            value: val,
            writable: false,
            enumerable: true,
            configurable: false
        });
    }

    function fail(name) {
        throw new Error('Calling ' + name + ' is forbidden');
    }

    function wrapProperty(key, val) {
        // FIXME: what do we do about Dates, strings, etc?

        switch (typeof val) {
        case 'function':
            freeze(key, fail.bind(null, key));
            break;
        case 'object':
            if (Array.isArray(val)) {
            } else {
            }
            break;
        }
    }
}(this));
