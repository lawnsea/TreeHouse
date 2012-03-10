var doc, document, win, window;
var initBroker;

(function () {
    var _self = {};
    var whitelist = [
        'Array', 'ArrayBuffer', 'Boolean', 'DataView', 'Date', 'Error',
        'EvalError', 'EventSource', 'FileError', 'FileException',
        'Float32Array', 'Float64Array', 'Function', 'Infinity', 'Int16Array',
        'Int32Array', 'Int8Array', 'JSON', 'Math', 'MessageEvent', 'NaN',
        'Number', 'Object', 'PERSISTENT', 'RangeError', 'ReferenceError',
        'RegExp', 'String', 'SyntaxError', 'TEMPORARY', 'TypeError',
        'URIError', 'Uint16Array', 'Uint32Array', 'Uint8Array',
        'WebKitBlobBuilder', 'WebKitFlags', 'WorkerLocation', 'clearInterval',
        'clearTimeout', 'close', 'decodeURI', 'decodeURIComponent',
        'dispatchEvent', 'encodeURI', 'encodeURIComponent', 'escape', 'eval',
        'isFinite', 'isNaN', 'location', 'navigator', 'onerror', 'parseFloat',
        'parseInt', 'removeEventListener', 'self', 'setInterval', 'setTimeout',
        'undefined', 'unescape', 'webkitURL',
        'win', 'window', 'doc', 'document', 'initBroker'
    ];
    var blacklist = ['Worker'];
    var nop = function (){};
    var ignored = {};
    var importScriptsImpl = importScripts;
    var postMessageImpl = postMessage;
    var closeImpl = close;
    var wrapped = {
        importScripts: function () {
            if (self.console && self.console.error) {
                self.console.error('Importing', arguments[0]);
            }
            return importScriptsImpl(arguments[0]);
        },

        postMessage: function () {
            return _self.postMessage.apply(this, arguments);
        },
        
        addEventListener: function () {
            return _self.addEventListener.apply(this, arguments);
        },
        
        XMLHttpRequest: function () {
            return new _self.XMLHttpRequest();
        },
    };
    var beenWrapped = {};
    var keys = [], k;
    var basePolicy, policy, importScriptsRule, i, validate;

    function argumentsToArray(args, start) {
        return Array.prototype.slice.call(args, start);
    }

    function terminate() {
        if (console && console.error) {
            console.error.apply(console, ['Terminating:'].concat(argumentsToArray(arguments)));
        }

        // FIXME: The worker doesn't terminate until the event loop empties, so
        // consider asking the monitor to kill us
        closeImpl();
    }

    // Import base and default policies
    importScriptsImpl('policy/base-broker.js');
    basePolicy = self.basePolicy;
    delete self.basePolicy;

    importScriptsImpl('policy/default.js');
    policy = self.policy;
    delete self.policy;

    function freezeProperty(k, v) {
        Object.defineProperty(self, k, {
            value: v,
            writable: false,
            enumerable: true,
            configurable: false
        });
    }

    function wrapFunction(fn, name) {
        var args = argumentsToArray(arguments, 2);

        // check policy
        if (validate && !validate.checkFunction(policy, name, args)) {
            terminate('Use of', name, 'violates policy');
        }

        // check base policy
        if (validate && !validate.checkFunction(basePolicy, name, args)) {
            terminate('Use of', name, 'violates base policy');
        }

        return fn.apply(this, args);
    }

    function wrapProperty(k, v) {
        var fn;

        if (typeof v === 'function') {
            _self[k] = v;
            fn = wrapped[k] || v;
            freezeProperty(k, function () {
                var args = [fn, k].concat(argumentsToArray(arguments));
                return wrapFunction.apply(self, args);
            });
        } else if (v instanceof Array) {
            _self[k] = v;
            self[k] = [];
        } else if (typeof v === 'object') {
            _self[k] = v;
            self[k] = {};
        }
    }

    for (i = 0; i < whitelist.length; i++) {
        ignored[whitelist[i]] = true;
    }

    keys = Object.getOwnPropertyNames(self);
    for (k in self) {
        keys.push(k);
    }
    keys = keys.concat(blacklist);

    for (i = 0; i < keys.length; i++) {
        k = keys[i];
        if (!ignored[k] && !beenWrapped[k]) {
            beenWrapped[k] = true;
            wrapProperty(k, self[k]);
        }
    }

    initBroker = function(console, jsdom, serialization, validateLib, util) {
        validate = validateLib;

        var initialized = false;
        var messageHandlers = {};
        var eventHandlers = {};
        var changingDOM = false;
        var CSSStyleDeclaration = jsdom.dom.level3.core.CSSStyleDeclaration;
        var STYLE_PROPERTY_PREFIX = '__treehouseStyle-';
        var STYLE_ATTRIBUTE_PREFIX = 'data-treehouse-style-';
        var DISPATCHED_EVENTS = {
            'abort': true, 'blur': true, 'click': true, 'error': true, 'focus': true, 'focusin': true, 
            'focusout': true, 'keydown': true, 'keypress': true, 'keyup': true, 'load': true,
            'mousedown': true, 'mouseenter': true, 'mouseleave': true, 'mousemove': true,
            'mouseout': true, 'mouseover': true, 'mouseup': true, 'scroll': true, 'select': true,
            'textinput': true, 'unload': true, 'wheel': true
        };
        var hookedStyles = {};
        var k, i;
        var addEventListenerImpl;

        importScriptsImpl('../lib/jsdom/ie10-compatibility.js');
        console = self.console = console.getConsole(postMessageImpl);

        console.debug('Started.');

        self.document = self.doc = jsdom.jsdom("<html><head></head><body></body></html>", null, {
            features: {
                FetchExternalResources: false,
                ProcessExternalResources: false,
                QuerySelector: true
            }
        });
        self.window = self.win = doc.createWindow();

        // TODO: export the entire DOM interface to self
        self.Event = jsdom.dom.level3.events.Event;
        self.MutationEvent = jsdom.dom.level3.events.MutationEvent;
        self.Node = jsdom.dom.level3.core.Node;
        self.Element = jsdom.dom.level3.core.Element;

        /*
         * Install a setter and getter on a style property that actually sets
         * an attribute on the element
         */
        function hookStyleProperty(property) {
            // propertyName -> data-treehouse-style-property-name
            var name = STYLE_ATTRIBUTE_PREFIX + util.camelCaseToDashed(property);

            if (hookedStyles[property]) {
                // already hooked
                return;
            }

            hookedStyles[property] = true;
            Object.defineProperty(CSSStyleDeclaration.prototype, property, {
                set: function (newValue) {
                    this._element.setAttribute(name, newValue);
                },
                get: function () {
                    return this._element.getAttribute(name) || '';
                }
            });
        }

        // Export style properties in the base policy
        for (k in basePolicy.dom.attributes.style) {
            hookStyleProperty(k);
        }

        // Export any style properties that don't appear in the base policy
        for (k in policy.dom.attributes.style) {
            hookStyleProperty(k);
        }

        // XXX: setPolicy needs to do this too

        // Wrap addEventListener so that we can ask the monitor to install
        // listeners in the actual DOM
        addEventListenerImpl = jsdom.dom.level3.core.Node.prototype.addEventListener;
        jsdom.dom.level3.core.Node.prototype.addEventListener = 
            function (type, listener, capturing) {
                if (this.tagName.toLowerCase() !== 'script' && DISPATCHED_EVENTS[type]) {
                    _self.postMessage.call(self, {
                        method: 'addEventListener',
                        params: [ serialization.getNodeTraversal(this, doc.body), type, capturing ]
                    });
                }
                return addEventListenerImpl.call(this, type, listener, capturing);
            };

        // Handle DOMSubtreeModified events from the monitor
        eventHandlers.DOMSubtreeModified = function (e) {
            var s;

            e.target = serialization.deserializeNode(e.target);
            e = serialization.deserializeEvent(e, document.body);

            if (e.attrChange === MutationEvent.prototype.ADDITION) {
                console.debug('Appending serialized dom', serialization.serializeNode(e.target));
                changingDOM = true;
                document.body.appendChild(e.target);
                changingDOM = false;

                if (e.target.tagName.toLowerCase() === 'script') {
                    console.error('Importing script', e.target.src);
                    importScriptsImpl(e.target.src);
                }
            }
        };

        // Handle dispatchEvent messages
        messageHandlers.dispatchEvent = function (e) {
            if (eventHandlers[e.type] !== void undefined) {
                console.debug('Handling received event', e);
                eventHandlers[e.type](e);
            } else {
                if (e.type !== 'mousemove') {
                    console.debug('Dispatching received event', e);
                }
                e = serialization.deserializeEvent(e, doc.body);
                e.target.dispatchEvent(e);
            }
        };

        _self.addEventListener.call(self, 'message', function(e) {
            var msg = e.data;

            console.debug('Received message', msg);
            if (messageHandlers[msg.method] !== void undefined) {
                messageHandlers[msg.method].apply(this, msg.params);
            }
        });

        // Listen for changes to the VDOM and dispatch them to the monitor
        addEventListenerImpl.call(document.body, 'DOMSubtreeModified', function (e) {
            var target;

            if (changingDOM) {
                // the broker modified the VDOM, so ignore this event
                return;
            }

            // TODO: if the new node is a SCRIPT, check the policy and import it if allowed
            // TODO: if the new node has onfoo handers, register them and delete the attributes
            //       from the serialized node

            if (e.attrChange === MutationEvent.prototype.ADDITION) {
                // When adding a node to the DOM, serialize the node and append
                // it to the traversal
                target = serialization.serializeNode(e.target);
                e = serialization.serializeEvent(e, document.body);
                e.target.push(target);
            } else {
                e = serialization.serializeEvent(e, document.body);
            }

            if (!validate.checkEvent(policy, e)) {
                terminate('VDOM modification violates policy', e);
            }
            // XXX: Revisit. Are you sure don't need to check the base policy here?

            e.__treehouseEventTime = new Date();
            console.debug('Dispatching DOMSubtreeModified event:', e);
            _self.postMessage.call(self, {
                method: 'dispatchEvent',
                params: [ e ]
            });
        }, false);

        delete initBroker;
    };

    importScriptsImpl('require.js');
}());

require({
    baseUrl: './',
    packages: [{
        name: 'jsdom',
        location: '../lib/jsdom',
        main: 'jsdom'
    }, {
        name: 'node-htmlparser',
        location: '../lib/jsdom/node-htmlparser'
    }, {
        name: 'underscore',
        location: '../lib/underscore',
        main: 'underscore'
    }, {
        name: 'treehouse',
        location: './'
    }]
}, [
    'treehouse/worker/console', 'jsdom', 'treehouse/serialization', 'treehouse/policy/validate',
    'treehouse/util', 'underscore'
], initBroker);
