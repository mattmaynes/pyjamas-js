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
            }).extend(MyClassA);

        });

        it('Serializes a child class', function () {
            myB.add();

            expect(Pyjamas.manifest(myB)).toEqual({
                version : '0.1.0',
                value   : 1,
                name    : 'Pyjamas',
                a       : {
                    version : '0.1.0',
                    value   : 0
                }
            });
        });

        it('Deserializes a child class', function () {
            expect(Pyjamas.construct(MyClassB, Pyjamas.manifest(myB))).toEqual(myB);
        });

    });
});

