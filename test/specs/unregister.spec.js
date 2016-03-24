/* global Pyjamas */

describe ('Pyjamas.unregister', function(){
    'use strict';
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
    }());

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

