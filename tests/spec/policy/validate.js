define([
    'treehouse/policy/validate'
],
function (validate) {
    describe('The treehouse/policy/validate module', function () {
        describe('provides a checkMethodCall method', function () {
            var policy = {
                '!api': {
                    '*': function () {},
                    'foo': function () {},
                    'fiz': {
                        '!invoke': function () {},
                        '!result': {
                            'biz': function () {}
                        }
                    },
                    'nested': {
                        '*': true,
                        'ruleset': {
                            'rule': true 
                        }
                    },
                    'truebool': true,
                    'falsebool': false,
                    'regexp': /fail/,
                    'ruleset': {},
                    'null': null
                }
            };

            // rule matching
            it('which, when an exact match exists, checks the matching rule', function () {
                spyOn(policy['!api'], 'foo');

                validate.checkMethodCall(policy, ['foo']);

                expect(policy['!api'].foo).toHaveBeenCalled();
            });

            it('which, when an exact match exists if !invoke were appended, checks the matching rule', function () {
                spyOn(policy['!api'].fiz, '!invoke');

                validate.checkMethodCall(policy, ['fiz']);

                expect(policy['!api'].fiz['!invoke']).toHaveBeenCalled();
            });

            it('which, when no exact match exists, checks the default rule', function () {
                spyOn(policy['!api'], '*');

                validate.checkMethodCall(policy, ['applesauce']);

                expect(policy['!api']['*']).toHaveBeenCalled();
            });

            it('which returns the value if a prefix matches a boolean', function () {
                expect(validate.checkMethodCall(policy, ['truebool', 'foo'])).toBe(true);
                expect(validate.checkMethodCall(policy, ['falsebool', 'foo'])).toBe(false);
            });

            it('which handles nested rules correctly', function () {
                expect(validate.checkMethodCall(policy, ['nested', 'ruleset', 'rule'])).
                    toBe(true);
                expect(validate.checkMethodCall(policy, ['nested', 'ruleset', 'foo'])).
                    toBe(false);
                expect(validate.checkMethodCall(policy, ['nested', 'other', 'foo'])).
                    toBe(true);
            });

            it('which returns false if the check fails', function () {
                var fakeResult = false;
                var fakeFn = function () { return fakeResult; };
                spyOn(policy['!api'], 'foo').andCallFake(fakeFn);

                expect(validate.checkMethodCall(policy, ['foo'])).toBe(false);

                fakeResult = null;
                expect(validate.checkMethodCall(policy, ['foo'])).toBe(false);

                fakeResult = 42;
                expect(validate.checkMethodCall(policy, ['foo'])).toBe(false);
            });

            it('which returns true if the check passes', function () {
                spyOn(policy['!api'], 'foo').andCallFake(function () { return true; });

                expect(validate.checkMethodCall(policy, ['foo'])).toBe(true);
            });

            // rule types
            it('which returns true if the rule value is true', function () {
                expect(validate.checkMethodCall(policy, ['truebool'])).toBe(true);
            });

            it('which returns false if the rule value is false', function () {
                expect(validate.checkMethodCall(policy, ['falsebool'])).toBe(false);
            });

            it('which calls the rule with the name and passed args if its value is a function', function () {
                var args = [23, 42, 23251];
                spyOn(policy['!api'], 'foo');

                validate.checkMethodCall(policy, ['foo'], args);

                expect(policy['!api'].foo).toHaveBeenCalled();
                var actualArgs = policy['!api'].foo.mostRecentCall.args;
                expect(actualArgs.length).toBe(args.length + 1);
                expect(actualArgs[0]).toBe('foo');
                for (var i = 1; i < actualArgs.length; i++) {
                    expect(actualArgs[i]).toBe(args[i - 1]);
                }
            });

            it('which returns false if the rule value is anything else', function () {
                expect(validate.checkMethodCall(policy, ['regexp'])).toBe(false);
                expect(validate.checkMethodCall(policy, ['ruleset'])).toBe(false);
                expect(validate.checkMethodCall(policy, ['null'])).toBe(false);
            });
        });

        describe('provides a checkPropertySet method', function () {
            var policy = {
                '!api': {
                    '*': function () {},
                    'foo': function () {},
                    'fiz': {
                        '!set': function () {}
                    },
                    'nested': {
                        '*': true,
                        'ruleset': {
                            'rule': true 
                        }
                    },
                    'truebool': true,
                    'falsebool': false,
                    'regexp': /fail/,
                    'ruleset': {},
                    'null': null
                }
            };

            // rule matching
            it('which, when an exact match exists, checks the matching rule', function () {
                spyOn(policy['!api'], 'foo');

                validate.checkPropertySet(policy, ['foo']);

                expect(policy['!api'].foo).toHaveBeenCalled();
            });

            it('which, when an exact match exists if !set were appended, checks the matching rule', function () {
                spyOn(policy['!api'].fiz, '!set');

                validate.checkPropertySet(policy, ['fiz']);

                expect(policy['!api'].fiz['!set']).toHaveBeenCalled();
            });

            it('which, when no exact match exists, checks the default rule', function () {
                spyOn(policy['!api'], '*');

                validate.checkPropertySet(policy, ['applesauce']);

                expect(policy['!api']['*']).toHaveBeenCalled();
            });

            it('which returns the value if a prefix matches a boolean', function () {
                expect(validate.checkPropertySet(policy, ['truebool', 'foo'])).toBe(true);
                expect(validate.checkPropertySet(policy, ['falsebool', 'foo'])).toBe(false);
            });

            it('which handles nested rules correctly', function () {
                expect(validate.checkPropertySet(policy, ['nested', 'ruleset', 'rule'])).
                    toBe(true);
                expect(validate.checkPropertySet(policy, ['nested', 'ruleset', 'foo'])).
                    toBe(false);
                expect(validate.checkPropertySet(policy, ['nested', 'other', 'foo'])).
                    toBe(true);
            });

            it('which returns false if the check fails', function () {
                var fakeResult = false;
                var fakeFn = function () { return fakeResult; };
                spyOn(policy['!api'], 'foo').andCallFake(fakeFn);

                expect(validate.checkPropertySet(policy, ['foo'])).toBe(false);

                fakeResult = null;
                expect(validate.checkPropertySet(policy, ['foo'])).toBe(false);

                fakeResult = 42;
                expect(validate.checkPropertySet(policy, ['foo'])).toBe(false);
            });

            it('which returns true if the check passes', function () {
                spyOn(policy['!api'], 'foo').andCallFake(function () { return true; });

                expect(validate.checkPropertySet(policy, ['foo'])).toBe(true);
            });
            
            // rule types
            it('which returns true if the rule value is true', function () {
                expect(validate.checkPropertySet(policy, ['truebool'])).toBe(true);
            });

            it('which returns false if the rule value is false', function () {
                expect(validate.checkPropertySet(policy, ['falsebool'])).toBe(false);
            });

            it('which calls the rule with the name and new value if its value is a function', function () {
                var newValue = 42;
                spyOn(policy['!api'], 'foo');

                validate.checkPropertySet(policy, ['foo'], 42);

                expect(policy['!api'].foo).toHaveBeenCalledWith('foo', 42);
            });
        });

        describe('provides a checkDOMChange method', function () {
            // rule matching
            // rule types
            // node addition
            // node modification
        });
    });
});
