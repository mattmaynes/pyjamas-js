/* global Pyjamas */

describe ('Pyjamas.register', function () {
    'use strict';

    var myObj;
    var MyClass = (function () {
        function MyClass() {
            this.value = 0;
            this.name = 'test';
        }

        MyClass.prototype.add = function () {
            this.value++;
        };

        return MyClass;
    })();

    beforeEach(function () {
        myObj = new MyClass();
    });

    it('Returns a pyjamas instance with the correct fields', function () {
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

    it('Adds the class constructor and pyjamas instance to the DB', function () {
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


