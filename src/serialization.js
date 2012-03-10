define(['underscore'], function () {
    var exports = {};
    var EVENT_KEYS = [
        'altKey', 'bubbles', 'button', 'cancelBubble', 'cancelable',
        'charCode', 'clientX', 'clientY', 'ctrlKey', 'currentTarget',
        'defaultPrd', 'detail', 'hase', 'explicitOriginalTarget', 'isChar',
        'keyCode', 'layerX', 'layerY', 'metaKey', 'originalTarget', 'pageX',
        'pageY', 'relatedTarget', 'screenX', 'screenY', 'shiftKey', 'target',
        'timeStamp', 'type', 'view', 'which', 'attrName', 'attrChange',
        'relatedNode', 'newValue', 'prevValue'
    ];

    function serializeNode(node) {
        var attrs = {};
        var result, i, len, attr, children;

        if (node.tagName === void undefined) {
            // serializing a text node
            return node.textContent;
        }
        
        result = [node.tagName.toLowerCase()]

        for (i = 0, len = node.attributes.length; i < len; i++) {
            attr = node.attributes.item(i);
            attrs[attr.name] = attr.value;
        }
        
        if (len > 0) {
            result.push(attrs);
        }

        if (node.childNodes.length === 0) {
            if (node.textContent !== '') {
                // text child
                result.push(node.textContent);
            }
        } else if (node.childNodes.length === 1 && node.childNodes[0].tagName === void undefined) { 
            // text child
            result.push(node.textContent);
        } else {
            // non-textnode children
            result.push(Array.prototype.slice.call(node.childNodes).map(serializeNode));
        }

        return result;
    };

    /**
     * Unpack a JSONML node in array form into an object
     */
    function unpackJSONML(node) {
        var result;

        if (!_.isArray(node)) {
            throw 'A JSONML node must be an array';
        } else if (node.length < 1) {
            throw 'A JSONML node has minimum length 1';
        } else if (node.length > 3) {
            throw 'A JSONML node has maximum length 3';
        }

        result = {
            tag: node[0],
            attributes: {},
            contents: null
        };

        if (!_.isArray(node[1]) && _.isObject(node[1])) {
            // the second element is an object, which denotes attributes
            // to be set on the node
            result.attributes = node[1];
            result.contents = node[2];
        } else {
            if (node.length > 2) {
                throw 'A JSONML node without attributes has maximum length 2';
            }
            result.contents = node[1];
        }

        return result;
    }

    function deserializeNode(node, whitelist) {
        var passedNode = node;
        var result, contents;

        if (_.isString(node)) {
            result = doc.createTextNode(node);
        } else if (_.isArray(node)) {
            node = unpackJSONML(node);

            result = doc.createElement(node.tag);

            _(node.attributes).keys().forEach(function (key, index) {
                if (whitelist && !whitelist[key.toLowerCase()] && key.indexOf('data-') !== 0) {
                    return;
                }
                result.setAttribute(key, node.attributes[key]);
            });

            if (_.isString(node.contents)) {
                // content is a text node
                result.appendChild(deserializeNode(node.contents));
            } else if (_.isArray(node.contents)) {
                // content contains one or more child nodes
                node.contents.forEach(function (el, index, els) {
                    var child = deserializeNode(el);

                    // overwrite child index with correct value
                    child.__treehouseChildIndex = index;
                    result.appendChild(child);
                });
            } else if (!_.isUndefined(node.contents)) {
                console.warn(passedNode, node);
                throw (typeof node) + ' is not valid JSONML content';
            }
        } else {
            throw (typeof node) + ' is not a valid JSONML node';
        }

        result.__treehouseChildIndex = 0; // this may get overwritten in the caller
        return result;
    }

    function getNodeIndex(node) {
        var index = node.__treehouseChildIndex;
        var parent = node.parentNode;
        var i, len;

        // FIXME: workaround to ignore incorrect cached child index
        parent.__treehouseDirty = true;

        if (!_.isNumber(index) || parent.__treehouseDirty === true) {
            for (i = 0, len = parent.childNodes.length; i < len; i++) {
                if (parent.childNodes[i] === node) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    function getNodeTraversal(node, rootNode) {
        var result = [];

        // FIXME: workaround to prevent trying to get the nodeindex of the
        // document element
        while (node !== rootNode && node.parentNode !== null) {
            result.push(getNodeIndex(node));
            node = node.parentNode;
        }

        result.reverse();
        return result;
    }
    
    function serializeEvent(event, rootNode, traversalPrefix) {
        var result = {};
        var i, k, v;

        for (i = 0; i < EVENT_KEYS.length; i++) {
            k = EVENT_KEYS[i];
            v = event[k];

            if (_.isFunction(v)) {
                continue;
            } else if (v instanceof Node) {
                result[k] = getNodeTraversal(v, rootNode);
                if (_.isArray(traversalPrefix)) {
                    result[k] = traversalPrefix.concat(result[k]);
                }
            } else {
                result[k] = v;
            }
        }

        delete result.view;
        return result;
    }

    function traverseToNode(traversal, rootNode) {
        var result = rootNode;
        var i;

        for (i = 0; i < traversal.length; i++) {
            result = result.childNodes[traversal[i]];
        }

        return result;
    }

    function deserializeEvent(event, rootNode) {
        var k, v;

        for (k in event) {
            if (event.hasOwnProperty(k)) {
                v = event[k];

                if (_.isArray(v)) {
                    if (_.isArray(rootNode)) {
                        // multiple root nodes
                        event[k] = traverseToNode(v, rootNode[v.shift()]);
                    } else {
                        event[k] = traverseToNode(v, rootNode);
                    }
                }
            }
        }

        event.view = window;
        // XXX: This is a hack. We should call initEvent instead.
        event._type = event.type;
        event._bubbles = event.bubbles;
        return event;
    }

    exports.unpackJSONML = unpackJSONML;
    exports.serializeNode = serializeNode;
    exports.deserializeNode = deserializeNode;
    exports.serializeEvent = serializeEvent;
    exports.deserializeEvent = deserializeEvent;
    exports.getNodeTraversal = getNodeTraversal;
    exports.traverseToNode = traverseToNode;

    return exports;
});
