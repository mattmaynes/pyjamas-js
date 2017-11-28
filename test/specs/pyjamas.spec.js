/* global Pyjamas */

describe('Pyjamas.prototype.upgrade', function(){
    'use strict';

    it('Adds an upgrader to a pyjamas instance', function(){
        var pjs = new Pyjamas(),
            up  = function(){};


        pjs.upgrade('0.1.0', up);

        expect(pjs.upgrades).toEqual({'0.1.0' : up});
    });

    describe('Hierarchy', function () {
        var myA, myB;

        var MyClassA = (function () {
            function MyClassA() {
                this.value = 0;
            }

            MyClassA.prototype.add = function () {
                this.value++;
            };

            return MyClassA;
        }());

        var MyClassB = (function () {
            function MyClassB (name) {
                this.name = name;
                this.a = new MyClassA();
                this.b = [1, 2, 3];
                MyClassA.call(this);
            }
            MyClassB.prototype = Object.create(MyClassA.prototype);
            MyClassB.prototype.constructor = MyClassB;
            return MyClassB;
        }());

        beforeEach(function () {
            myA = new MyClassA();
            myB = new MyClassB('Pyjamas');

            Pyjamas.register(MyClassA, '0.1.0', {
                value : Number
            });

            Pyjamas.register(MyClassB, '0.1.0', {
                name    : String,
                a       : MyClassA,
                b       : Array,
            }).extend(MyClassA);

        });

        it('Serializes a child class', function () {
            myB.add();

            expect(Pyjamas.manifest(myB)).toEqual({
                version : '0.1.0',
                value   : 1,
                name    : 'Pyjamas',
                b       : [1, 2, 3],
                a       : {
                    version : '0.1.0',
                    value   : 0
                },
            });
        });

        it('Deserializes a child class', function () {
            expect(Pyjamas.construct(MyClassB, Pyjamas.manifest(myB))).toEqual(myB);
        });

    });

    describe('Deferred Construction', function () {
        var MyClassA = function () {},
            MyClassB = function () {
                this.a = new MyClassA();
            };

        beforeEach(function () {
            Pyjamas.register(MyClassA, '0.1.0');
            Pyjamas.register(MyClassB, '0.1.0', {
                a : MyClassA,
            }).defer(MyClassA);

        });

        it('Does not execute MyClassA', function () {
            var myB  = new MyClassB(),
                newB = Pyjamas.construct(MyClassB, Pyjamas.manifest(myB));

            expect(newB instanceof MyClassB).toBeTruthy();
            expect(newB.a instanceof MyClassA).toBeTruthy();
        });


    });
});

