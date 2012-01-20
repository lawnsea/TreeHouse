define(['serialization'], function (serialization) {
    return {
        getConsole: function (postMessage) {
            var console = {};

            function sendConsoleMessage() {
                var args = Array.prototype.slice.call(arguments);
                var i;

                for (i = 0; i < args.length; i++) {
                    if (self.Node && args[i] instanceof self.Node) {
                        args[i] = serialization.serializeNode(args[i]);
                    }
                }
                postMessage({
                    method: 'console',
                    params: args
                });
            }

            console.log = _.bind(sendConsoleMessage, console, 'log');
            console.dir = _.bind(sendConsoleMessage, console, 'dir');
            console.debug = _.bind(sendConsoleMessage, console, 'debug');
            console.info = _.bind(sendConsoleMessage, console, 'info');
            console.warn = _.bind(sendConsoleMessage, console, 'warn');
            console.error = _.bind(sendConsoleMessage, console, 'error');
            console.assert = _.bind(sendConsoleMessage, console, 'assert');

            return console;
        }
    };
});
