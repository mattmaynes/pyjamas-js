/* global Pyjamas */

/**
 * Jasmine test specification for Pyjamas
 */
describe('Pyjamas', function(){
    'use strict';

    describe('Version', function(){

        it('Splits version strings into an array of identifiers', function(){

            expect(Pyjamas.Version.split).toThrow();

            // TODO: When Pyjamas.Version.split is implemented then
            // these test should be re-added
            /*

            expect(Pyjamas.Version.split('1.2.3')).toEqual([1, 2, 3]);
            expect(Pyjamas.Version.split('0.0.0')).toEqual([0, 0, 0]);
            expect(Pyjamas.Version.split('1.10.100;)).toEqual([1, 10, 100]);
            */
        });

    });

});
