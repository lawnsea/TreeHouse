define([
    'treehouse/serialization', 'treehouse/sorted-set', 'treehouse/policy/validate',
    'treehouse/policy/base-monitor', 'underscore'
], 
function(serialization, SortedSet, validate, basePolicy) {
    var Sandbox;
    var consoleMethods = ['log', 'debug', 'info', 'warn', 'error', 'assert'];
    var messageHandlers = {
        dispatchEvent: function(e) {
            var ev = document.createEvent('CustomEvent');
            var serializedTarget = e.target;
            var rootNode = this._children.get(serializedTarget.shift());
            var serializedTargetNode;

            if (e.type !== 'DOMSubtreeModified') {
                return;
            }

            if (!validate.checkDOMMutation(basePolicy, e, rootNode)) {
                this.onPolicyViolation();
            }

            serializedTargetNode = e.target.pop();

            if (e.attrChange === MutationEvent.ADDITION) {
                // the last element of the target is the new node to add
                e.target = serialization.deserializeNode(serializedTargetNode);
                e.target.__treehouseNextSibling = serialization.traverseToNode(
                    serializedTarget, rootNode);
            }

            e = serialization.deserializeEvent(e, rootNode);
            this.debug('Deserialized received event', e);
            ev.initCustomEvent('sandboxDOMEvent', true, true, e);
            ev.detail.sandbox = this;
            document.body.dispatchEvent(ev);
        },

        addEventListener: function (node, type, capturing) {
            var child = this._children.get(node.shift());
            // FIXME: authorize with application policy. is that necessary?
            // FIXME: do we need to check the type against DISPATCHED_EVENTS?

            console.debug('Adding event listener', node, type, capturing);
            node = serialization.traverseToNode(node, child);
            console.debug('Adding event listener', node, type, capturing);
            if (node) {
                node.addEventListener(type, _.bind(dispatchEvent, this, child));
            }
        },

        console: function(method) {
            this[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    };

    /**
     * Compare two nodes by depth-first traversal order
     *
     * The nodes are considered equal if the same node or if one is a descendant of the other
     */
    function compareNodes(node1, node2) {
        var traversal1, traversal2, len, i, delta;

        if (node1 === node2) {
            return 0;
        }

        traversal1 = serialization.getNodeTraversal(node1, document.body);
        traversal2 = serialization.getNodeTraversal(node2, document.body);
        len = traversal1.length <= traversal2.length ? traversal1.length : traversal2.length;

        for (i = 0; i < len; i++) {
            delta = traversal1[i] - traversal2[i];
            if (delta !== 0) {
                return delta;
            }
        }

        // one is the child of the other
        return 0;
    }

    function onMessage(e) {
        if (e.data.method in messageHandlers) {
            this.debug('Received message', e.data);
            messageHandlers[e.data.method].apply(this, e.data.params);
        } else {
            //this.warn('Unknown message type "' + e.data.type + '"', e.data);
        }
    }

    Sandbox = function (name, loader, attributeWhitelist) {
        loader = loader || '../src/loader.js';
        this.name = name;
        this._worker = new Worker(loader);
        this._children = new SortedSet(compareNodes);
        this._started = false;
        this._listeners = [];
        this._whitelist = attributeWhitelist;

        consoleMethods.forEach(function (method) {
            this[method] = function () {
                console[method].apply(console,
                    ['Sandbox ' + this.name].concat(Array.prototype.slice.call(arguments)));
            };
        }, this);
        this.addEventListener('message', _.bind(onMessage, this), false);
    };

    /**
     * Called when a worker violates the base policy
     *
     * Default action is to terminate the sandbox
     */
    Sandbox.prototype.onPolicyViolation = function (policyKey) {
        console.error('Sandbox', this.name, 'violated the base policy and will be terminated');
        this.terminate();
    };

    /**
     * Call addEventListener on the sandbox's worker
     *
     * See https://developer.mozilla.org/en/DOM/element.addEventListener
     */
    Sandbox.prototype.addEventListener = function (type, listener, useCapture) {
        this._worker.addEventListener(type, listener, useCapture);
    };

    /**
     * Call postMessage on the sandbox's worker
     *
     * See https://developer.mozilla.org/En/DOM/Worker#postMessage()
     */
    Sandbox.prototype.postMessage = function (data) {
        this.debug('Sending message', data);
        this._worker.postMessage(data);
    };

    /**
     * Call terminate on the sandbox's worker and tear down the sandbox
     *
     * See https://developer.mozilla.org/En/DOM/Worker#terminate()
     */
    Sandbox.prototype.terminate = function () {
        this._worker.terminate();
    };

    Sandbox.prototype.jsonrpcCall = function (method) {
        // TODO: make the call, return a promise
        throw 'Not implemented';
    };

    Sandbox.prototype.jsonrpcNotify = function (method) {
        var msg = {
            method: method,
            params: Array.prototype.slice.call(arguments, 1)
        };
        this.debug('Sending JSON-RPC notification', msg);
        this.postMessage(msg);
    };

    function dispatchEvent(rootNode, e) {
        // XXX: hack! if rootNode is truthy, we assume it's a node and try to
        // find the child it is a descendant of
        var prefix = !rootNode ? [] : [ this._children.getIndex(rootNode) ];
        var ev;

        if (this._started) {
            ev = serialization.serializeEvent(e, rootNode, prefix);

            this.jsonrpcNotify('dispatchEvent', ev);
        }
    };

    function createMutationEvent(target) {
        var event = document.createEvent('MutationEvent');

        event.initMutationEvent('DOMSubtreeModified', true, true, target, '', '', '',
            MutationEvent.ADDITION);

        event = _.extend({}, event);
        event.target = serialization.serializeNode(target);
        event.relatedNode = [];
        return event;
    }

    Sandbox.prototype.addChild = function (child) {
        var index = this._children.insert(child);
        var i;

        if (index < 0) {
            this.debug('Ignoring existing child', child);
            return;
        }

        this.debug('Added new child', child);

        if (this._started) {
            // TODO: construct and dispatch a mutation event
            throw 'Adding children to a running sandbox is not implemented';
        }

        /*
        for (i = 0; i < DISPATCHED_EVENTS.length; i++) {
            child.addEventListener(DISPATCHED_EVENTS[i], dispatchEvent.bind(this));
        }
        */
    };

    Sandbox.prototype.removeChild = function (child) {
        // TODO: think about the right way to do this
        throw 'Not implemented';
    }

    Sandbox.prototype.start = function () {
        this._started = true;

        // iterate over children and dispatch a mutation event for each
        this._children.get().forEach(function (child, index, children) {
            var event = createMutationEvent(child);
            dispatchEvent.call(this, event.currentTarget, event, false);
        }, this);
    };

    return Sandbox;
});
