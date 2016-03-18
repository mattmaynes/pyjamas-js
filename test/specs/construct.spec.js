/* global Pyjamas */

/**
 * Jasmine test specification for Pyjamas
 */
describe('Pyjamas', function(){
    'use strict';
    describe('Pyjamas.construct', function(){

        var myA, myB, myRawA, myRawB;

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
                this.b = 1;
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
                a       : MyClassA,
                b       : null
            }));

            myRawA = Pyjamas.manifest(myA);
            myRawB = Pyjamas.manifest(myB);
        });

        it('Constructs single objects', function(){
            expect(
                Pyjamas.construct(MyClassA, myRawA)
            ).toEqual(myA);
        });

        it('Recursively constructs objects', function(){
            expect(
                Pyjamas.construct(MyClassB, myRawB)
            ).toEqual(myB);
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
            function MyClass(){
                this.value = 0;
                this.name = 'test';
            }

            MyClass.prototype.add = function(){
                this.value++;
            };

            return MyClass;
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
            expect(Pyjamas.DB.fetch(myObj.constructor).version).toEqual('0.1.0');
            expect(Pyjamas.DB.fetch(myObj.constructor).defines).toEqual({
                value : Number,
                name : String
            });
        });
    });

    describe ('Pyjamas.unregister', function(){
        var myObj, myInstance;
        var MyClass = (function(){
            function MyClass(){
                this.value = 0;
                this.name = 'test';
            }

            MyClass.prototype.add = function(){
                this.value++;
            };

            return MyClass;
        })();

        beforeEach(function(){
            myObj = new MyClass();
            myInstance = Pyjamas.register(MyClass, '0.1.0' , {
                value : Number,
                name : String
            });
        });

        it('Returns a pyjamas instance with the correct fields', function(){
            expect(Pyjamas.unregister(MyClass)).toEqual(myInstance);
        });

        it('Removes the pyjamas instance from the database', function(){
            expect(Pyjamas.DB.fetch(myObj.constructor)).toEqual(myInstance);
            Pyjamas.unregister(MyClass);
            expect(Pyjamas.DB.fetch(myObj.constructor)).toEqual(null);
        });
    });
});
