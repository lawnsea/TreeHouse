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
        var ruleset = policy['!api'];
        var searchpath = path.slice();
        var element, rule;

        // starting from leftmost path element, find the most specific ruleset
        while (isRuleset(ruleset) && searchpath.length > 0) {
            element = searchpath.shift();
            ruleset = ruleset[element];
        }

        if (searchpath.length === 0 && !isUndefined(ruleset) && !isNull(ruleset)) {
            // Exact match

            // if the match is a ruleset, the rule is its !invoke rule.
            // otherwise it's the match itself
            rule = isObject(ruleset) ? ruleset['!invoke'] : ruleset;
        } else {
            // Not an exact match

            if (isBoolean(ruleset)) {
                // If the most specific match is a boolean, its value determines
                // whether any descendant is allowed or forbidden
                rule = ruleset;
            } else if (path[path.length - 1] !== '*') {
                // Otherwise, we didn't match, so try the default rule

                searchpath = path.slice();
                searchpath[searchpath.length - 1] = '*';
                rule = findRule(policy, searchpath);
            }
        }

        // return the rule if it's a valid method rule and null otherwise
        return isFunction(rule) || isBoolean(rule) ? rule : null;
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
        var rule = findRule(policy, path);

        if (rule === null) {
            // no rule found. deny.
            return false;
        }

        var result = evaluateMethodRule(rule, path[path.length - 1], args);
        return result === true;
    }

    function checkAttribute(policy, value, name) {
        var rule = policy.dom.attributes[name];

        if (name.indexOf(STYLE_ATTRIBUTE_PREFIX) === 0) {
            name = util.dashedToCamelCase(name.slice(STYLE_ATTRIBUTE_PREFIX.length));
            rule = policy.dom.attributes.style[name];
        }

        // FIXME: handle data-* attributes in the policy instead
        if (name.indexOf('data-') === 0 ||
            rule === true ||
            (_.isRegExp(rule) && rule.test(value)) ||
            (_.isFunction(rule) && rule(value) === true) ||
            rule === value)
        {
            return true;
        }

        return false;
    }

    function checkNode(policy, node) {
        // text nodes are ok
        if (_.isString(node)) {
            return true;
        }

        node = serialization.unpackJSONML(node);

        // check tag
        if (!policy.dom.elements[node.tag]) {
            return false;
        }
        
        // check attributes
        if (!_.all(node.attributes, _.bind(checkAttribute, this, policy))) {
            return false;
        };

        // check content
        if (_.isArray(node.contents) && !_.all(node.contents, _.bind(checkNode, this, policy))) {
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
        checkAttribute: checkAttribute,
        checkNode: checkNode,
        checkEvent: checkEvent,
        checkFunction: checkFunction
    };
});
