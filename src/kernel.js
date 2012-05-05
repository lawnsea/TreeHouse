define([
    'treehouse/sandbox', 'treehouse/util', 'treehouse/policy/base-monitor'
], 
function(Sandbox, util, basePolicy) {
    var sandboxes = {};
    var sandboxIndex = 0;
    var messageHandlers = {};
    var STYLE_ATTRIBUTE_PREFIX = 'data-treehouse-style-';

    function setStyleAttributes(el) {
        var toRemove = [];
        var i, attr, attrs;

        // Map data-treehouse-style-foo -> el.style.foo
        if (el.hasAttributes()) {
            attrs = el.attributes;

            for (i = 0; i < attrs.length; i++) {
                attr = attrs[i];
                if (attr.name.indexOf(STYLE_ATTRIBUTE_PREFIX) === 0) {
                    name = util.dashedToCamelCase(attr.name.slice(STYLE_ATTRIBUTE_PREFIX.length));
                    el.style[name] = attr.value;
                    toRemove.push(attr.name);
                }
            }

            for (i = 0; i < toRemove.length; i++) {
                if (el.hasAttribute(toRemove[i])) {
                    el.removeAttribute(toRemove[i]);
                }
            }
        }

        for (i = 0; i < el.childNodes.length; i++) {
            setStyleAttributes(el.childNodes[i]);
        }
    }

    function handleSandboxDOMEvent(sandbox, e) {
        var ev = e.detail;
        var toAdd, toRemove, addBefore, name, el;

        if (ev.type !== 'DOMSubtreeModified') {
            console.error('Unhandled event "' + ev.type + '"', ev);
            return;
        }

        if (ev.attrChange === MutationEvent.prototype.MODIFICATION) {
            if (ev.attrName.indexOf(STYLE_ATTRIBUTE_PREFIX) === 0) {
                name = ev.attrName.slice(STYLE_ATTRIBUTE_PREFIX.length);
                ev.target.style[name] = ev.newValue;
            } else if (ev.target.setAttribute) {
                ev.target.setAttribute(ev.attrName, ev.newValue);
            }
        } else if (ev.attrChange === MutationEvent.prototype.ADDITION) {
            el = ev.target;
            setStyleAttributes(el);

            if (el.__treehouseNextSibling) {
                ev.relatedNode.insertBefore(el, el.__treehouseNextSibling);
                delete el.__treehouseNextSibling;
            } else {
                ev.relatedNode.appendChild(el);
            }
        } else if (ev.attrChange === MutationEvent.prototype.REMOVAL) {
            ev.target.parentNode.removeChild(ev.target);
        } else {
            throw 'Invalid attrChange value';
        }
    };

    // Adapted from Andrew Dupont's implementation
    // http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
    function deepExtend(destination, source) {
        for (var property in source) {
            if (typeof source[property] === "object" &&
                source[property] !== null ) {
                destination[property] = destination[property] || {};
                deepExtend(destination[property], source[property]);
            } else {
                destination[property] = source[property];
            }
        }
        return destination;
    }

    function setPolicy(newPolicy, currentPolicy) {
        deepExtend(currentPolicy, newPolicy);
    }

    function initialize(config) {
        config = config || {};
        config.policy = config.policy || {};

        // TODO: handle scripts in HEAD; probably need to just prefix
        //       traversals with 'body' or 'head'
        var guestScripts = Array.prototype.slice.apply(
            document.body.querySelectorAll(
                'script[type="text/x-treehouse-javascript"]:not([data-treehouse-policy])'));
        var policyScripts = Array.prototype.slice.apply(
            document.body.querySelectorAll(
                'script[type="text/x-treehouse-javascript"][data-treehouse-policy]'));
        var children = [];
        var toRemove = [];
        var i, j, k, len, worker, selector, script;

        setPolicy(config.policy, basePolicy);

        policyScripts.forEach(function (script, scriptIndex, guestScripts) {
            var name = script.getAttribute('data-treehouse-sandbox-name') || 
                'sandbox' + sandboxIndex;
            var sandbox;

            if (sandboxes[name] === void undefined) {
                sandboxes[name] = new Sandbox(name, config.loaderUrl || null);
                sandboxes[name].index = sandboxIndex;
                sandboxIndex++;
            }
            sandbox = sandboxes[name];

            sandbox.setPolicy(script.src);
        });

        guestScripts.forEach(function (script, scriptIndex, guestScripts) {
            var name = script.getAttribute('data-treehouse-sandbox-name') || 
                'sandbox' + sandboxIndex;
            var sandbox;

            if (sandboxes[name] === void undefined) {
                sandboxes[name] = new Sandbox(name, config.loaderUrl || null);
                sandboxes[name].index = sandboxIndex;
                sandboxIndex++;
            }
            sandbox = sandboxes[name];
            
            // add children to sandbox
            // TODO: check if the node or an ancestor of the node is already
            //       owned by another sandbox
            sandbox.childNodeSelectors = script.getAttribute('data-treehouse-sandbox-children');
            if (sandbox.childNodeSelectors) {
                sandbox.childNodeSelectors.split(',').forEach(function (selector) {
                    var nodes = document.querySelectorAll(selector);

                    Array.prototype.slice.call(nodes).forEach(sandbox.addChild, sandbox);
                });
            }
            sandbox.addChild(script);

            /*
            sandbox.bodyNodeSelector = script.getAttribute('data-treehouse-sandbox-body');
            if (sandbox.bodyNodeSelector) {
                sandbox.body = document.querySelector(sandbox.bodyNodeSelector);
            }
            */
        });

        for (var k in sandboxes) {
            sandboxes[k].start();
        }

        document.body.addEventListener('sandboxDOMEvent', function (e) {
            handleSandboxDOMEvent(e.detail.sandbox, e);
        }, false);
    }

    return {
        initialize: initialize,
        sandboxes: sandboxes
    };
});
