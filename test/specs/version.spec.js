/* global Pyjamas */

/**
 * Pyjamas.Version is responsible for comparing version strings
 * for different version identifiers.
 */
describe('Pyjamas.Version', function(){
    'use strict';

    it('Splits version strings into an array of identifiers', function(){
        expect(Pyjamas.Version.split('1.2.3')).toEqual([1, 2, 3]);
        expect(Pyjamas.Version.split('0.0.0')).toEqual([0, 0, 0]);
        expect(Pyjamas.Version.split('1.10.100')).toEqual([1, 10, 100]);
        expect(Pyjamas.Version.split('')).toEqual([0, 0, 0]);
    });

    it('Returns the major version number of a version string', function(){
        expect(Pyjamas.Version.major('1.2.3')).toEqual(1);
        expect(Pyjamas.Version.major('0.0.0')).toEqual(0);
        expect(Pyjamas.Version.major('1.10.100')).toEqual(1);
        expect(Pyjamas.Version.major('')).toEqual(0);
    });

    it('Returns the minor version number of a version string', function(){
        expect(Pyjamas.Version.minor('1.2.3')).toEqual(2);
        expect(Pyjamas.Version.minor('0.0.0')).toEqual(0);
        expect(Pyjamas.Version.minor('1.10.100')).toEqual(10);
        expect(Pyjamas.Version.minor('')).toEqual(0);
    });

    it('Returns the patch version number of a version string', function(){
        expect(Pyjamas.Version.patch('1.2.3')).toEqual(3);
        expect(Pyjamas.Version.patch('0.0.0')).toEqual(0);
        expect(Pyjamas.Version.patch('1.10.100')).toEqual(100);
        expect(Pyjamas.Version.patch('')).toEqual(0);
    });

    it('Returns a diff of two version strings', function(){
        expect(Pyjamas.Version.diff('1.1.1', '0.0.0')).toEqual([1, 1, 1]);
        expect(Pyjamas.Version.diff('0.0.0', '1.1.1')).toEqual([-1, -1, -1]);
        expect(Pyjamas.Version.diff('1.2.3', '1.2.3')).toEqual([0, 0, 0]);
        expect(Pyjamas.Version.diff('4.5.6', '1.2.3')).toEqual([3, 3, 3]);
    });

    it('Returns a comparison of two version strings', function(){
        expect(Pyjamas.Version.compare('1.1.1', '0.0.0')).toEqual(1);
        expect(Pyjamas.Version.compare('0.0.0', '1.1.1')).toEqual(-1);
        expect(Pyjamas.Version.compare('1.2.3', '1.2.3')).toEqual(0);
        expect(Pyjamas.Version.compare('4.5.6', '1.2.3')).toEqual(1);
    });

    it('Returns if a version is greater than another', function(){
        expect(Pyjamas.Version.greaterThan('1.1.1', '0.0.0')).toBeTruthy();
        expect(Pyjamas.Version.greaterThan('0.0.0', '1.1.1')).toBeFalsy();
        expect(Pyjamas.Version.greaterThan('1.2.3', '1.2.3')).toBeFalsy();
    });

    it('Returns if a version is less than another', function(){
        expect(Pyjamas.Version.lessThan('0.0.0', '1.1.1')).toBeTruthy();
        expect(Pyjamas.Version.lessThan('1.1.1', '0.0.0')).toBeFalsy();
        expect(Pyjamas.Version.lessThan('1.2.3', '1.2.3')).toBeFalsy();
    });

    it('Returns if a version is equal to another', function(){
        expect(Pyjamas.Version.equals('1.2.3', '1.2.3')).toBeTruthy();
        expect(Pyjamas.Version.equals('0.0.0', '1.1.1')).toBeFalsy();
        expect(Pyjamas.Version.equals('1.1.1', '0.0.0')).toBeFalsy();
    });

    it('Returns a string of a version array', function(){
        expect(Pyjamas.Version.toString([1, 2, 3])).toString('1.2.3');
        expect(Pyjamas.Version.toString([0, 0, 0])).toString('0.0.0');
    });

});


