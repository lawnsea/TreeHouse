define([
    'sandbox', 'util', 'kernel/allowed-attributes', 'kernel/allowed-elements',
    'kernel/allowed-style-properties'
], 
function(Sandbox, util, allowedAttributes, allowedElements, allowedStyleProperties) {
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
                    if (allowedStyleProperties[name] === true) {
                        el.style[name] = attr.value;
                    }
                    toRemove.push(attr.name);
                }
            }

            for (i = 0; i < toRemove.length; i++) {
                el.attributes.removeNamedItem(toRemove[i]);
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
            if (ev.target.setAttribute && allowedAttributes[ev.attrName.toLowerCase()] === true) {
                ev.target.setAttribute(ev.attrName, ev.newValue);
            } else if (ev.attrName.indexOf(STYLE_ATTRIBUTE_PREFIX) === 0) {
                name = ev.attrName.slice(STYLE_ATTRIBUTE_PREFIX.length);
                if (allowedStyleProperties[name] === true) {
                    ev.target.style[name] = ev.newValue;
                }
            }
        } else if (ev.attrChange === MutationEvent.prototype.ADDITION) {
            if (ev.target instanceof Text ||
                allowedElements[ev.target.tagName.toLowerCase()] === true)
            {
                el = ev.target;
                setStyleAttributes(el);
            } else {
                el = document.createElement('div');
                el.style.display = 'none';
            }

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

    function initialize() {
        // TODO: handle scripts in HEAD; probably need to just prefix
        //       traversals with 'body' or 'head'
        var scripts = Array.prototype.slice.apply(
                document.body.querySelectorAll('script[type="text/x-treehouse-javascript"]'));
        var children = [];
        var i, j, k, len, worker, selector, script;

        scripts.forEach(function (script, scriptIndex, scripts) {
            var name = script.getAttribute('data-treehouse-sandbox-name') || 
                'sandbox' + sandboxIndex;
            var sandbox;

            if (sandboxes[name] === void undefined) {
                sandboxes[name] = new Sandbox(name, null, allowedAttributes);
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
            sandbox.start();
        });

        document.body.addEventListener('sandboxDOMEvent', function (e) {
            handleSandboxDOMEvent(e.detail.sandbox, e);
        }, false);
    }

    return {
        initialize: initialize,
        sandboxes: sandboxes
    };
});
