define(['serialization', 'util'], function (serialization, util) {
    var STYLE_ATTRIBUTE_PREFIX = 'data-xzibos-style-';

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
        checkAttribute: checkAttribute,
        checkNode: checkNode,
        checkEvent: checkEvent,
        checkFunction: checkFunction
    };
});
