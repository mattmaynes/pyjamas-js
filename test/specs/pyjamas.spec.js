/* global Pyjamas */

describe('Pyjamas.prototype.upgrade', function(){
    'use strict';

    it('Adds an upgrader to a pyjamas instance', function(){
        var pjs = new Pyjamas(),
            up  = function(){};


        pjs.upgrade('0.1.0', up);

        expect(pjs.upgrades).toEqual({'0.1.0' : up});
    });
});

