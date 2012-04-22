define([
    'treehouse/policy/validate', 'treehouse/serialization'
],
function (validate, serialization) {
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
                    'regexp': /^regex/,
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

            it('which returns true if the rule is a regex that matches the new value', function () {
                expect(validate.checkPropertySet(policy, ['regexp'], 'regexes')).toBe(true);
            });

            it('which returns false if the rule is a regex that does not match the new value', function () {
                expect(validate.checkPropertySet(policy, ['regexp'], 'noregexes')).toBe(false);
            });
        });

        describe('provides a checkDOMMutation method', function () {
            var policy = {
                '!elements': {
                    '!attributes': {
                        '*': {
                            '*': function () {},
                            'truebool': true,
                            'falsebool': false,
                            'truefn': function () { return true; },
                            'falsefn': function () { return false; },
                            'ruleset': {},
                            'null': null,
                            'applesauce': function () {}
                        },
                        'truetag': true,
                        'falsetag': false,
                        'truefntag': function () { return true; },
                        'falsefntag': function () { return false; },
                        'rulesettag': {
                            '*': function () {},
                            'regexp': /^regex/,
                            'truebool': true,
                            'falsebool': false,
                            'truefn': function () { return true; },
                            'falsefn': function () { return false; },
                        }
                    },
                    '!tags': {
                        '*': function () {},
                        'truetag': true,
                        'falsetag': false,
                        'truefntag': function () { return true; },
                        'falsefntag': function () { return false; },
                        'rulesettag': true
                    }
                }
            };

            function makeMutationEvent(type, config) {
                var event = _.extend({}, config);
                event.attrChange = type;
                return event;
            }

            function trueFn() {
                return true;
            }

            function falseFn() {
                return false;
            }

            var rootNode = document.createElement('div');
            rootNode.appendChild(document.createElement('div'));
            var parent = document.createElement('div');
            rootNode.appendChild(parent);

            describe('which, when adding a node', function () {
                it('checks the matching tag rule on an exact match', function () {
                    var target = ['truefntag'];
                    spyOn(policy['!elements']['!tags'], 'truefntag');

                    validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.ADDITION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target])
                        }),
                        rootNode);

                    expect(policy['!elements']['!tags'].truefntag).toHaveBeenCalled();
                });

                it('checks the default tag rule on no match', function () {
                    var target = ['nomatchtag'];
                    spyOn(policy['!elements']['!tags'], '*');

                    validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.ADDITION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target])
                        }),
                        rootNode);

                    expect(policy['!elements']['!tags']['*']).toHaveBeenCalled();
                });
                
                // rule types
                it('returns true if the rule value is true', function () {
                    expect(validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.ADDITION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([['truetag']])
                        }),
                        rootNode)).toBe(true);
                });

                it('returns false if the rule value is false', function () {
                    expect(validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.ADDITION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([['falsetag']])
                        }),
                        rootNode)).toBe(false);
                });

                it('passes the node to insert and its parent if the rule is a function', function () {
                    var target = ['truefntag'];
                    spyOn(policy['!elements']['!tags'], 'truefntag');

                    validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.ADDITION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target])
                        }),
                        rootNode);

                    var args = policy['!elements']['!tags'].truefntag.mostRecentCall.args;
                    expect(args[0]).toBe(parent);
                    expect(args[1]).toEqual({ tag: 'truefntag', attributes: {}, contents: undefined });
                });

                it('checks the contents of the node to insert', function () {
                    var target = ['truetag', [['truefntag'], ['falsefntag']]];
                    spyOn(policy['!elements']['!tags'], 'truefntag').andCallFake(trueFn);
                    spyOn(policy['!elements']['!tags'], 'falsefntag').andCallFake(trueFn);

                    validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.ADDITION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target])
                        }),
                        rootNode);

                    var args = policy['!elements']['!tags'].truefntag.mostRecentCall.args;
                    expect(args[0]).toEqual({
                        tag: 'truetag',
                        attributes: {},
                        contents: [['truefntag'], ['falsefntag']]
                    });
                    expect(args[1]).toEqual({
                        tag: 'truefntag',
                        attributes: {},
                        contents: undefined
                    });

                    args = policy['!elements']['!tags'].falsefntag.mostRecentCall.args;
                    expect(args[0]).toEqual({
                        tag: 'truetag',
                        attributes: {},
                        contents: [['truefntag'], ['falsefntag']]
                    });
                    expect(args[1]).toEqual({
                        tag: 'falsefntag',
                        attributes: {},
                        contents: undefined
                    });
                });

                it('returns true if all contents of the node to insert pass', function () {
                    var target = ['truetag', [['truetag'], ['truefntag']]];

                    expect(validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.ADDITION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target])
                        }),
                        rootNode)).toBe(true);
                });

                it('returns false if any contents of the node to insert fail', function () {
                    var target = ['nomatchtag', [['truetag'], ['falsefntag']]];

                    expect(validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.ADDITION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target])
                        }),
                        rootNode)).toBe(false);
                });

                it('checks the attributes of the node to insert', function () {
                    var target = ['rulesettag', { truefn: 23, falsefn: 42 }];
                    spyOn(policy['!elements']['!attributes'].rulesettag, 'truefn').andCallFake(trueFn);
                    spyOn(policy['!elements']['!attributes'].rulesettag, 'falsefn').andCallFake(trueFn);

                    validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.ADDITION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target])
                        }),
                        rootNode);

                    expect(policy['!elements']['!attributes'].rulesettag.truefn).
                        toHaveBeenCalledWith('truefn', 23);
                    expect(policy['!elements']['!attributes'].rulesettag.falsefn).
                        toHaveBeenCalledWith('falsefn', 42);
                });

                it('returns true if all attributes of the node to insert pass', function () {
                    var target = ['rulesettag', { truebool: 23, truefn: 42 }];

                    expect(validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.ADDITION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target])
                        }),
                        rootNode)).toBe(true);
                });

                it('returns false if any attribute of the node to insert fails', function () {
                    var target = ['rulesettag', { truebool: 23, falsefn: 42 }];

                    expect(validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.ADDITION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target])
                        }),
                        rootNode)).toBe(false);
                });
            });

            describe('which, when modifying a node', function () {
                it('checks the matching element attribute rule on an exact match', function () {
                    var target = ['rulesettag', { truefn: 23 }];
                    spyOn(policy['!elements']['!attributes'].rulesettag, 'truefn');

                    validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.MODIFICATION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target]),
                            attrName: 'truefn',
                            newValue: 42
                        }),
                        rootNode);

                    expect(policy['!elements']['!attributes'].rulesettag.truefn).
                        toHaveBeenCalled();
                });

                it('checks the element default tag rule on no attribute match', function () {
                    var target = ['rulesettag', { monkey: 23 }];
                    spyOn(policy['!elements']['!attributes'].rulesettag, '*');

                    validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.MODIFICATION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target]),
                            attrName: 'monkey',
                            newValue: 42
                        }),
                        rootNode);

                    expect(policy['!elements']['!attributes'].rulesettag['*']).toHaveBeenCalled();
                });

                it('checks the matching default attribute rule on an exact match', function () {
                    var target = ['nomatchtag', { truefn: 23 }];
                    spyOn(policy['!elements']['!attributes']['*'], 'truefn');

                    validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.MODIFICATION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target]),
                            attrName: 'truefn',
                            newValue: 42
                        }),
                        rootNode);

                    expect(policy['!elements']['!attributes']['*'].truefn).
                        toHaveBeenCalled();
                });

                it('checks the default attribute rule on no match', function () {
                    var target = ['nomatchtag', { nomatchattr: 42 }];
                    spyOn(policy['!elements']['!attributes']['*'], '*');

                    validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.MODIFICATION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([target]),
                            attrName: 'nomatchattr',
                            newValue: 23
                        }),
                        rootNode);

                    expect(policy['!elements']['!attributes']['*']['*']).toHaveBeenCalled();
                });

                it('which returns true if the rule value is true', function () {
                    expect(validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.MODIFICATION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([['rulesettag']]),
                            attrName: 'truebool',
                            newValue: 23
                        }),
                        rootNode)).toBe(true);
                });

                it('which returns false if the rule value is false', function () {
                    expect(validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.MODIFICATION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([['rulesettag']]),
                            attrName: 'falsebool',
                            newValue: 23
                        }),
                        rootNode)).toBe(false);
                });

                it('which calls the rule with the name and new value if its value is a function', function () {
                    spyOn(policy['!elements']['!attributes'].rulesettag, 'truefn');

                    validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.MODIFICATION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([['rulesettag']]),
                            attrName: 'truefn',
                            newValue: 23
                        }),
                        rootNode);

                    expect(policy['!elements']['!attributes'].rulesettag.truefn).
                        toHaveBeenCalledWith('truefn', 23);
                });

                it('which returns true if the rule is a regex that matches the new value', function () {
                    expect(validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.MODIFICATION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([['rulesettag']]),
                            attrName: 'regexp',
                            newValue: 'regexes' 
                        }),
                        rootNode)).toBe(true);
                });

                it('which returns false if the rule is a regex that does not match the new value', function () {
                    expect(validate.checkDOMMutation(policy,
                        makeMutationEvent(MutationEvent.MODIFICATION, {
                            target: serialization.getNodeTraversal(parent, rootNode).
                                concat([['rulesettag']]),
                            attrName: 'regexp',
                            newValue: 'noregexes' 
                        }),
                        rootNode)).toBe(false);
                });
            });
        });
    });
});
