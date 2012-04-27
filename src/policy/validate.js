define(['treehouse/serialization', 'treehouse/util'], function (serialization, util) {
    var STYLE_ATTRIBUTE_PREFIX = 'data-treehouse-style-';

    // TODO: move to util
    function isUndefined(rule) {
        return typeof rule === 'undefined';
    }

    function isNull(rule) {
        return rule === null;
    }

    function isBoolean(rule) {
        return typeof rule === 'boolean';
    }

    function isObject(rule) {
        return typeof rule === 'object' && !(rule instanceof Array);
    }

    function isFunction(rule) {
        return typeof rule === 'function';
    }

    function isRegExp(rule) {
        return typeof rule === 'object' && rule instanceof RegExp;
    }

    function isRuleset(rule) {
        return typeof rule === 'object';
    }

    function findRule(policy, path) {
        var ruleset = policy[path[0]];
        var parent = policy;
        var searchpath = path.slice(1);
        var element, rule;

        // starting from leftmost path element, find the most specific ruleset
        while (isRuleset(ruleset) && searchpath.length > 0) {
            parent = ruleset;
            element = searchpath.shift();
            ruleset = ruleset[element];
        }

        if (searchpath.length === 0 && !isUndefined(ruleset) && !isNull(ruleset)) {
            // Exact match
            rule = ruleset;
        } else {
            // Not an exact match

            if (isBoolean(ruleset)) {
                // If the most specific match is a boolean, its value determines
                // whether any descendant is allowed or forbidden
                rule = ruleset;
            } else if (isUndefined(ruleset) && isObject(parent) && parent !== null) {
                // If we didn't match and the rule that didn't contain a match
                // is a ruleset, use its default rule
                rule = parent['*'];
                
                // if the default rule is a ruleset, try to find a more specific rule
                if (isObject(rule)) {
                    rule = findRule(rule, searchpath.slice());
                    rule = rule !== null ? rule : parent['*'];
                }
            }
        }

        return rule;
    }

    function evaluateMethodRule(rule, name, args) {
        args = args || [];
        var result = false;

        if (rule === true) {
            result = true;
        } else if (isFunction(rule)) {
            result = rule.apply(null, [name].concat(args));
        }

        return result;
    }

    function checkMethodCall(policy, path, args) {
        var rule = findRule(policy, ['!api'].concat(path));

        if (rule === null) {
            // no rule found. deny.
            return false;
        } else if (isObject(rule)) {
            rule = rule['!invoke'];
        }

        var result = evaluateMethodRule(rule, path[path.length - 1], args);
        return result === true;
    }

    function evaluatePropertyRule(rule, name, value) {
        var result = false;

        if (rule === true) {
            result = true;
        } else if (isRegExp(rule)) {
            result = ('' + value).match(rule) !== null;
        } else if (isFunction(rule)) {
            result = rule.call(null, name, value);
        }

        return result;
    }

    function checkPropertySet(policy, path, value) {
        var rule = findRule(policy, ['!api'].concat(path));

        if (rule === null) {
            // no rule found. deny.
            return false;
        } else if (isObject(rule) && !(rule instanceof RegExp)) {
            rule = rule['!set'];
        }

        var result = evaluatePropertyRule(rule, path[path.length - 1], value);
        return result === true;
    }

    function checkDOMMutation(policy, event, rootNode) {
        var target = event.target[event.target.length - 1];
        if (event.attrChange === MutationEvent.prototype.ADDITION) {
            return checkNode(policy,
                            serialization.traverseToNode(event.relatedNode, rootNode),
                            target);
        } else if (event.attrChange === MutationEvent.prototype.MODIFICATION) {
            return checkAttribute(policy, target, event.newValue, event.attrName);
        } else if (event.attrChange === MutationEvent.prototype.REMOVAL) {
            // XXX: not sure it's always ok to remove a node
            return true;
        }
    }

    function evaluateAttributeRule(rule, name, value) {
        // properties are evaluated the same as attributes right now, but we
        // might want to change that in the future
        return evaluatePropertyRule(rule, name, value);
    }

    function checkAttribute(policy, node, value, name) {
        node = serialization.unpackJSONML(node);
        var path = ['!elements', '!attributes', node.tag];
        if (name.indexOf(STYLE_ATTRIBUTE_PREFIX) === 0) {
            name = util.dashedToCamelCase(name.slice(STYLE_ATTRIBUTE_PREFIX.length));
            path = path.concat(['style', name]);
        } else {
            path.push(name);
        }

        var rule = findRule(policy, path);

        return evaluateAttributeRule(rule, name, value);
    }

    function evaluateTagRule(rule, node, parent) {
        var result = false;

        if (rule === true) {
            result = true;
        } else if (isFunction(rule)) {
            result = rule.call(null, node, parent);
        }

        return result;
    }

    function checkNode(policy, parent, node) {
        // text nodes are ok
        if (_.isString(node)) {
            return true;
        }

        var serializedNode = node;
        node = serialization.unpackJSONML(node);

        // check tag
        var rule = findRule(policy, ['!elements', '!tags', node.tag]);
        if (!evaluateTagRule(rule, parent, node)) {
            return false;
        }
        
        // check attributes
        if (!_.all(node.attributes, _.bind(checkAttribute, this, policy, serializedNode))) {
            return false;
        };

        // check content
        if (_.isArray(node.contents) && !_.all(node.contents, _.bind(checkNode, this, policy, node))) {
            return false;
        }

        return true;
    }

    function checkEvent(policy, event) {
        if (event.attrChange === MutationEvent.prototype.ADDITION) {
            return checkNode(policy, event.target[event.target.length - 1]);
        } else if (event.attrChange === MutationEvent.prototype.MODIFICATION) {
            return checkAttribute(policy, event.newValue, event.attrName);
        }

        return true;
    }

    function checkFunction(policy, name, args) {
        var rule = policy[name];

        if (rule === true) {
            return true;
        } else if (_.isFunction(rule)) {
            return rule.apply({}, args) === true;
        } else if (_.isObject(rule) && _.isFunction(rule.constructor)) {
            return checkFunction(rule, 'constructor', args);
        }

        return false;
    }

    return {
        checkMethodCall: checkMethodCall,
        checkPropertySet: checkPropertySet,
        checkDOMMutation: checkDOMMutation,
        checkAttribute: checkAttribute,
        checkNode: checkNode,
        checkEvent: checkEvent,
        checkFunction: checkFunction
    };
});
