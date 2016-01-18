/* global Pyjamas */

/**
 * Jasmine test specification for Pyjamas
 */
describe('Pyjamas', function(){
    'use strict';

    describe('Pyjamas.Version', function(){

        it('Splits version strings into an array of identifiers', function(){
            expect(Pyjamas.Version.split('1.2.3')).toEqual([1, 2, 3]);
            expect(Pyjamas.Version.split('0.0.0')).toEqual([0, 0, 0]);
            expect(Pyjamas.Version.split('1.10.100')).toEqual([1, 10, 100]);
            expect(Pyjamas.Version.split('')).toEqual([0, 0, 0]);
        });

        it('Returns the major version number of a version string', function(){
            expect(Pyjamas.Version.major('1.2.3')).toEqual(1);
            expect(Pyjamas.Version.major('0.0.0')).toEqual(0);
            expect(Pyjamas.Version.major('1.10.100')).toEqual(1);
            expect(Pyjamas.Version.major('')).toEqual(0);
        });

        it('Returns the minor version number of a version string', function(){
            expect(Pyjamas.Version.minor('1.2.3')).toEqual(2);
            expect(Pyjamas.Version.minor('0.0.0')).toEqual(0);
            expect(Pyjamas.Version.minor('1.10.100')).toEqual(10);
            expect(Pyjamas.Version.minor('')).toEqual(0);
        });

        it('Returns the patch version number of a version string', function(){
            expect(Pyjamas.Version.patch('1.2.3')).toEqual(3);
            expect(Pyjamas.Version.patch('0.0.0')).toEqual(0);
            expect(Pyjamas.Version.patch('1.10.100')).toEqual(100);
            expect(Pyjamas.Version.patch('')).toEqual(0);
        });

        it('Returns a diff of two version strings', function(){
            expect(Pyjamas.Version.diff('1.1.1', '0.0.0')).toEqual([1, 1, 1]);
            expect(Pyjamas.Version.diff('0.0.0', '1.1.1')).toEqual([-1, -1, -1]);
            expect(Pyjamas.Version.diff('1.2.3', '1.2.3')).toEqual([0, 0, 0]);
            expect(Pyjamas.Version.diff('4.5.6', '1.2.3')).toEqual([3, 3, 3]);
        });

        it('Returns a comparison of two version strings', function(){
            expect(Pyjamas.Version.compare('1.1.1', '0.0.0')).toEqual(1);
            expect(Pyjamas.Version.compare('0.0.0', '1.1.1')).toEqual(-1);
            expect(Pyjamas.Version.compare('1.2.3', '1.2.3')).toEqual(0);
            expect(Pyjamas.Version.compare('4.5.6', '1.2.3')).toEqual(1);
        });

        it('Returns if a version is greater than another', function(){
            expect(Pyjamas.Version.greaterThan('1.1.1', '0.0.0')).toBeTruthy();
            expect(Pyjamas.Version.greaterThan('0.0.0', '1.1.1')).toBeFalsy();
            expect(Pyjamas.Version.greaterThan('1.2.3', '1.2.3')).toBeFalsy();
        });

        it('Returns if a version is less than another', function(){
            expect(Pyjamas.Version.lessThan('0.0.0', '1.1.1')).toBeTruthy();
            expect(Pyjamas.Version.lessThan('1.1.1', '0.0.0')).toBeFalsy();
            expect(Pyjamas.Version.lessThan('1.2.3', '1.2.3')).toBeFalsy();
        });

        it('Returns if a version is equal to another', function(){
            expect(Pyjamas.Version.equals('1.2.3', '1.2.3')).toBeTruthy();
            expect(Pyjamas.Version.equals('0.0.0', '1.1.1')).toBeFalsy();
            expect(Pyjamas.Version.equals('1.1.1', '0.0.0')).toBeFalsy();
        });

        it('Returns a string of a version array', function(){
            expect(Pyjamas.Version.toString([1, 2, 3])).toString('1.2.3');
            expect(Pyjamas.Version.toString([0, 0, 0])).toString('0.0.0');
        });

    });

    describe('Pyjamas.manifest', function(){

        var myA, myB;

        var MyClassA = (function(){
            function MyClassA(){
                this.value = 0;
            }

            MyClassA.prototype.add = function(){
                this.value++;
            };

            return MyClassA;
        })();

        var MyClassB = (function(){
            function MyClassB(name){
                this.name = name;
                this.a = new MyClassA();
            }
            return MyClassB;
        })();

        beforeEach(function(){
            myA = new MyClassA();
            myB = new MyClassB('Pyjamas');

            Pyjamas.DB.insert(MyClassA, new Pyjamas('0.1.0', {
                value : Number
            }));

            Pyjamas.DB.insert(MyClassB, new Pyjamas('0.2.0', {
                name    : String,
                a       : MyClassA
            }));
        });

        it('Manifests a single object', function(){
            expect(Pyjamas.manifest(myA)).toEqual({
                version : '0.1.0',
                value   : 0
            });

            myA.add();

            expect(Pyjamas.manifest(myA)).toEqual({
                version : '0.1.0',
                value   : 1
            });
        });

        it('Recursively manifests objects', function(){
            expect(Pyjamas.manifest(myB)).toEqual({
                version : '0.2.0',
                name    : 'Pyjamas',
                a       : {
                    version : '0.1.0',
                    value   : 0
                }
            });

            myB.a.add();

            expect(Pyjamas.manifest(myB)).toEqual({
                version : '0.2.0',
                name    : 'Pyjamas',
                a       : {
                    version : '0.1.0',
                    value   : 1
                }
            });
        });

        it('Does not encode an undefined property', function(){
            myB.name = undefined;

            expect(Pyjamas.manifest(myB)).toEqual({
                version : '0.2.0',
                a       : {
                    version : '0.1.0',
                    value   : 0
                }
            });

        });

        it('Does not encode an function property', function(){
            myB.name = function(){};

            expect(Pyjamas.manifest(myB)).toEqual({
                version : '0.2.0',
                a       : {
                    version : '0.1.0',
                    value   : 0
                }
            });

        });

    });

    describe('Pyjamas.prototype.upgrade', function(){
        it('Adds an upgrader to a pyjamas instance', function(){
            var pjs = new Pyjamas(),
                up  = function(){};


            pjs.upgrade('0.1.0', up);

            expect(pjs.upgrades).toEqual({'0.1.0' : up});
        });
    });

    describe ('Pyjamas.register', function(){
        var myObj;
        var MyClass = (function(){
            function MyClassA(){
                this.value = 0;
                this.name = 'test';
            }

            MyClassA.prototype.add = function(){
                this.value++;
            };

            return MyClassA;
        })();

        beforeEach(function(){
            myObj = new MyClass();
        });

        it('Returns a pyjamas instance with the correct fields', function(){
            var instance = Pyjamas.register(MyClass, '0.1.0', {
                value : Number,
                name : String
            });
            expect(instance.version).toEqual('0.1.0');
            expect(instance.defines).toEqual({
                value : Number,
                name : String
            });
        });

        it('Adds the class constructor and pyjamas instance to the DB', function(){
            Pyjamas.register(MyClass, '0.1.0',{
                value : Number,
                name : String
            });
            expect(Pyjamas.DB.fetch(myObj).version).toEqual('0.1.0');
            expect(Pyjamas.DB.fetch(myObj).defines).toEqual({
                value : Number,
                name : String
            });
        });
    });
});
