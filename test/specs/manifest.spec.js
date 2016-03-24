/* global Pyjamas */

describe('Pyjamas.manifest', function(){
    'use strict';
    var myA, myB;


    var MyClassA = (function(){
        function MyClassA(){
            this.value = 0;
        }

        MyClassA.prototype.add = function(){
            this.value++;
        };

        return MyClassA;
    }());

    var MyClassB = (function(){
        function MyClassB(name){
            this.name = name;
            this.a = new MyClassA();
        }
        return MyClassB;
    }());

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



