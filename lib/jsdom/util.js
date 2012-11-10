define(function () {
    function extend(target, source) {
        source = source || {};

        for (var k in source) {
            if (!target.hasOwnProperty(k)) {
                target[k] = source[k];
            }
        }
    }

    return {
        augment: function (target, source) {
            var k;

            for (k in source) {
                if (source.hasOwnProperty(k)) {
                    Object.defineProperty(target, k, Object.getOwnPropertyDescriptor(source, k));
                }
            }
        },

        // core.DOMException.prototype.__proto__ = Error.prototype;
        inherit: function (ctor, base, props) {
            var descriptors = {};
            var k;

            for (k in props) {
                if (props.hasOwnProperty(k)) {
                    descriptors[k] = Object.getOwnPropertyDescriptor(props, k);
                }
            }

            ctor.prototype = Object.create(base, descriptors);
            ctor.prototype.constructor = ctor;

        },

        updateProperty: function (obj, prop, descriptor) {
            extend(descriptor, Object.getOwnPropertyDescriptor(obj, prop));
            extend(descriptor, { enumerable: true, configurable: true });

            Object.defineProperty(obj, prop, descriptor);
        }
    };
});
