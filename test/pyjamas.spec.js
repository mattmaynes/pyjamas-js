/* global Pyjamas */

/**
 * Jasmine test specification for Pyjamas
 */
describe('Pyjamas', function(){
    'use strict';

    describe('Version', function(){

        it('Splits version strings into an array of identifiers', function(){

            expect(Pyjamas.Version.split).toThrow();

            // TODO Uncomment when Pyjamas.Version.split is done

            /*
            expect(Pyjamas.Version.split('1.2.3')).toEqual([1, 2, 3]);
            expect(Pyjamas.Version.split('0.0.0')).toEqual([0, 0, 0]);
            expect(Pyjamas.Version.split('1.10.100')).toEqual([1, 10, 100]);
            expect(Pyjamas.Version.split('')).toEqual([0, 0, 0]);
            */
        });

        it('Returns the major version number of a version string', function(){

            expect(Pyjamas.Version.major).toThrow();

            // TODO Uncomment when Pyjamas.Version.major is done

            /*
                expect(Pyjamas.Version.major('1.2.3')).toEqual(1);
                expect(Pyjamas.Version.major('0.0.0')).toEqual(0);
                expect(Pyjamas.Version.major('1.10.100')).toEqual(1);
                expect(Pyjamas.Version.major('')).toEqual(0);
            */
        });

        it('Returns the minor version number of a version string', function(){

            expect(Pyjamas.Version.minor).toThrow();

            // TODO Uncomment when Pyjamas.Version.minor is done

            /*
                expect(Pyjamas.Version.minor('1.2.3')).toEqual(2);
                expect(Pyjamas.Version.minor('0.0.0')).toEqual(0);
                expect(Pyjamas.Version.minor('1.10.100')).toEqual(10);
                expect(Pyjamas.Version.minor('')).toEqual(0);
            */
        });

        it('Returns the patch version number of a version string', function(){

            expect(Pyjamas.Version.patch).toThrow();

            // TODO Uncomment when Pyjamas.Version.patch is done

            /*
                expect(Pyjamas.Version.patch('1.2.3')).toEqual(3);
                expect(Pyjamas.Version.patch('0.0.0')).toEqual(0);
                expect(Pyjamas.Version.patch('1.10.100')).toEqual(100);
                expect(Pyjamas.Version.patch('')).toEqual(0);
            */
        });


    });

});
