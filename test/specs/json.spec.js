/* global Pyjamas */

describe ('Pyjamas.toJSON', function() {
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


    it('Ensures that toJSON returns a string', function () {
        Pyjamas.register(MyClass, '0.1.0', {
            value : Number,
            name : String
        });
        expect(typeof Pyjamas.toJSON(myObj)).toBe('string');

    });

});
