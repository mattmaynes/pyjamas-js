/* global Pyjamas */

describe('Pyjamas.construct', function () {
    'use strict';
    var myA, myB, myRawA, myRawB;

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
            this.b = 1;
        }
        return MyClassB;
    }());

    var MyClassC = (function () {
        function MyClassC (name) {
            this.name = name;
            this.a = new MyClassA();
        }
        return MyClassC;
    }());


    beforeEach(function () {
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

    it('Constructs single objects', function () {
        expect(
            Pyjamas.construct(MyClassA, myRawA)
        ).toEqual(myA);
    });

    it('Recursively constructs objects', function () {
        expect(
            Pyjamas.construct(MyClassB, myRawB)
        ).toEqual(myB);
    });

    it('Upgrades a serialized object between versions', function () {
        var instance;
        Pyjamas.register(MyClassC, '1.2.3', {
            name    : String,
            a       : MyClassA,
        })
        .upgrade('0.5.0', function (raw) {
            raw.name = 'goodbye ' + raw.name;
            return raw;
        })
        .upgrade('1.0.0', function (raw) {
            raw.name = 'hello ' + raw.name;
            return raw;
        });

        instance = Pyjamas.construct(MyClassC, {
            version : '0.2.2',
            name    : 'tom',
            a   : {
                value : 1
            }
        });

        expect(instance.name).toEqual('hello goodbye tom');
        expect(Pyjamas.manifest(instance).version).toEqual('1.2.3');
    });

});


