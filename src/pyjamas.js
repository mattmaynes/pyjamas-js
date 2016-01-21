
/**
 * Pyjamas is a simple library that provides basic version management for
 * persisting reflections JavaScript code as JSON.
 *
 * @TODO Improve this description!
 *
 * @version 0.0.3
 * @namespace Pyjamas
 */
var Pyjamas = (function(){
    'use strict';

    /**
     * Stores relationships between classes and Pyjamas definitions.
     *
     * @private
     */
    var PyjamasDB = (function(){

        /**
         * Pyjamas database
         *
         * @private
         * @type {object}
         */
        var db = {};

        /**
         * Adds an entry to the Pyjamas database
         *
         * @param constructor   {function}  Object constructor
         * @param instance      {Pyjamas}   Pyjamas instance
         *
         * @return {Pyjamas.Pyjamas} Inserted pyjamas instance
         */
        function insert (constructor, instance){
            db[constructor] = instance;
            return instance;
        }

        /**
         * Returns if the given constructor is contained in the Db
         *
         * @param constructor {function} Object constructor
         *
         * @return {boolean}
         */
        function contains (constructor){
            return constructor in db;
        }

        /**
         * Fetches an entry from the database or returns null
         *
         * @param constructor {function} Object constructor
         *
         * @return {Pyjamas.Pyjamas | null}
         */
        function fetch (constructor){
            return db[constructor] || null;
        }

        /**
         * Removes an entry from the database and returns said entry or null
         *
         * @param constructor {function} Object constructor
         *
         * @return {Pyjamas.Pyjamas | null}
         */
        function remove (constructor){
            var instance = db[constructor];
            delete db[constructor];
            return instance;
        }

        return {
            contains    : contains,
            fetch       : fetch,
            insert      : insert,
            remove      : remove
        };

    }());

    /**
     * Collection of helper functions for handling version numbers. This class
     * contains a set of static functions that deal with Major-Minor-Patch
     * version identifiers.
     *
     * @example
     * 1.2.3
     *
     * 1 is the major version
     * 2 is the minor version
     * 3 is the patch version
     * @end
     *
     * @public
     * @class Version
     * @memberof Pyjamas
     */
    var Version = (function(){

        /**
         * Given a string representation of a version, convert the version
         * to a 3 element array
         *
         * @param version {string} A version identifier
         *
         * @return {Array<int>} [major, minor, patch] Version array
         * @memberof Pyjamas.Version
         */
        function split (version){
            var parts = version.split('.');
            return [parts[0] | 0, parts[1] | 0, parts[2] | 0];
        }

        /**
         * Returns the major number of a version string
         *
         * @param version {string} A version identifier
         *
         * @return {int} Major version number
         * @memberof Pyjamas.Version
         */
        function major (version){
            return split(version)[0];
        }

        /**
         * Returns the minor number of a version string
         *
         * @param version {string} A version identifier
         *
         * @return {int} Minor version number
         * @memberof Pyjamas.Version
         */
        function minor (version){
            return split(version)[1];
        }

        /**
         * Returns the patch number of a version string
         *
         * @param version {string} A version identifier
         *
         * @return {int}
         * @memberof Pyjamas.Version
         */
        function patch (version){
            return split(version)[2];
        }

        /**
         * Returns the difference between two version numbers. This is a
         * pairwise comparison of each element in the version identifier.
         *
         * @param base  {string} Base version
         * @param other {string} Version to compare to
         *
         * @return {Array<int>} A pairwise comparison of each version number
         * @memberof Pyjamas.Version
         */
        function diff (base, other){
            var o = split(other);

            // Map over the base version and subtract the
            // corresponding index of the other version
            return split(base).map(function(v, i){
                return v - o[i];
            });
        }

        /**
         * Given two versions return -1, 0 or 1 depending on if first version
         * is less than, equal or greater than the second version respectively.
         *
         * @param base  {string} Base version
         * @param other {string} Version to compare to
         *
         * @return {int} Either -1, 0 or 1
         * @memberof Pyjamas.Version
         */
        function compare (base, other){
            return diff(base, other).reduce(function(prev, curr){
                // Note: This is not overly elegant but it is highly optimized
                // by JavaScript JIT compilers
                //
                // Logic:
                //  if prev === 0
                //      return prev
                //  else if !curr
                //      return 0
                //  else if curr < 0
                //      return -1
                //  else
                //      return 1
                return prev === 0 ? curr ? curr < 0 ? -1 : 1 : 0 : prev;
            }, 0);
        }

        /**
         * Returns if a given version is greater than the other
         *
         * @param base  {string} Base version
         * @param other {string} Version to compare to
         *
         * @return {boolean} If the base is greater than the other version
         * @memberof Pyjamas.Version
         */
        function greaterThan (base, other) {
            return compare(base, other) > 0;
        }

        /**
         * Returns if the given version is less than the other
         *
         * @param base  {string} Base version
         * @param other {string} Version to compare to
         *
         * @return {boolean} If the base is less than the other version
         * @memberof Pyjamas.Version
         */
        function lessThan (base, other){
            return compare(base, other) < 0;
        }

        /**
         * Returns if two version are equivalent
         *
         * @param base  {string} Base version
         * @param other {string} Version to compare to
         *
         * @return {boolean} If the version are equivalent
         * @memberof Pyjamas.Version
         */
        function equals (base, other) {
            return compare(base, other) === 0;
        }

        /**
         * Returns a string representation of a version array
         *
         * @param version {Array<int>}
         *
         * @return {string}
         * @memberof Pyjamas.Version
         */
        function toString (version){
            return version.join('.');
        }

        return {
            split       : split,
            major       : major,
            minor       : minor,
            patch       : patch,
            diff        : diff,
            compare     : compare,
            greaterThan : greaterThan,
            lessThan    : lessThan,
            equals      : equals,
            toString    : toString
        };
    }());

    /**
     * Returns the constructor for the given target
     *
     * @param target {object} Object to get constructor of
     *
     * @return {function} Object's constructor
     * @private
     */
    function getConstructor (target){
        return 'undefined' === typeof target ? function(){} : target.constructor;
    }

    /**
     * Encodes each key in the target if it is defined and defined in the
     * prototype of the object
     *
     * @param keys      {object} Object with the keys of the target to encode
     * @param target    {object} Object to encode
     * @param [version] {string} Version string of output
     *
     * @return {object} Encoded object
     * @private
     */
    function encodeEach (keys, target, version){
        var key, output = {};

        for(key in keys){
            if(target.hasOwnProperty(key)           &&
                'undefined' !== typeof target[key]  &&
                'function'  !== typeof target[key]  ){
                output[key] = encode(target[key]);
            }
        }

        output.version = version;
        return output;
    }

    /**
     * Encodes the given target into a raw object that conforms to JavaScript
     * Object Notation. The resulting object will not have any undefined or
     * function references.
     *
     * @param target {object} Target to encode
     *
     * @return {object} Encoded object
     * @private
     */
    function encode (target){
        var pjs = PyjamasDB.fetch(getConstructor(target));

        return pjs ? encodeEach(pjs.defines, target, pjs.version) :
            target instanceof Object ? encodeEach(target, target) :
            target;
    }

    /**
     * Checks if the given value is an instance of the constructor.
     * If so then returns the value, otherwise it returns a new
     * instance of the constructor
     *
     * @param constructor   {function}  Object constructor
     * @param value         {*}         Instance of constructor or nothing
     *
     * @return {*} An instance of the constructor
     */
    function construct (constructor, value){
        if ('function' === typeof constructor){
            return getConstructor(value) === constructor ?
                value :
                new constructor(); // jshint ignore : line
        }
        return value;
    }

    /**
     * Decodes an object to become an instance of the given constructor
     *
     * @param constructor   {function}  Object constructor
     * @param target        {object}    Raw object that populates a new instance
     *
     * @return {object} New instance of the constructor
     * @private
     */
    function decode (constructor, target){
        var key, instance, pjs;

        instance = construct(constructor, target);

        if (PyjamasDB.contains(constructor)){
            pjs = PyjamasDB.fetch(constructor);

            for(key in pjs.defines){
                instance[key] = decode(pjs.defines[key], target[key]);
            }
        }

        return instance;
    }

    /**
     * Constructs a new Pyjamas instance with default values
     *
     * @param [version] {string} Current version of instance
     * @param [defines] {object} Definitions of instance variables
     *
     * @public
     * @constructor
     * @memberof Pyjamas
     */
    function Pyjamas (version, defines){

        /**
         * Version identifier of current instance
         * @type {string}
         */
        this.version = version || '0.0.0';

        /**
         * Definitions of instance variables to persist from given instance
         *
         * @example
         * {
         *      foo : Number,
         *      bar : String,
         *      baz : MyOtherClass
         * }
         * @end
         *
         * @type {object}
         */
        this.defines = defines || {};

        /**
         * Defines a set of upgrade methods to apply to old saves to update
         * to the current source version
         *
         * @example
         * {
         *      '0.1.2' : function myUpgrader1(){},
         *      '0.2.3' : function myUpgrader2(){}
         * }
         * @end
         *
         * @type {object}
         */
        this.upgrades = {};
    }

    /**
     * Registers an upgrade function to this Pyjamas instance. An upgrade
     * function must accept a copy of a old version of a save and the current
     * instance. It should either mutate the current instance of the save or
     * return an upgraded version.
     *
     * @param version {string} Version code that indicates the version of the
     * instance returned from this upgrade function
     * @end
     *
     * @param upgrader {function} Function to upgrade old save. Prototype:
     * function( old :  Object, current : Object) : Object
     * @end
     *
     * @return {Pyjamas.Pyjamas} An updated Pyjamas instance
     *
     * @public
     * @memberof Pyjamas.Pyjamas
     */
    Pyjamas.prototype.upgrade = function(version, upgrader){
        this.upgrades[version] = upgrader;
        return this;
    };

    /**
     * Registers a class into the PyjamasDB and returns a new Pyjamas instance
     *
     * @example
     * Pyjamas.register(MyClass, '0.1.2', {
     *      foo : Number,
     *      bar : String,
     *      baz : MyOtherClass
     * });
     * @end
     *
     * @param constructor   {function}  Object constructor to register
     * @param version       {string}    Current version of object constructor
     * @param defines       {object}    Definitions of instance variables to
     * persist when given an instance of the constructor's class
     * @end
     *
     * @return {Pyjamas.Pyjamas} A new Pyjamas instance
     *
     * @public
     * @memberof Pyjamas
     */
    Pyjamas.register = function(constructor, version, defines){
        return PyjamasDB.insert(constructor, new Pyjamas(version, defines));
    };

    /**
     * Removes a class from the PyjamasDB if it exists, otherwise return null
     *
     * @param constructor {function} Object constructor to unregister
     *
     * @return {Pyjamas.Pyjamas | null} Removed Pyjamas instance or null if the
     * constructor was not registered
     * @end
     *
     * @public
     * @memberof Pyjamas
     */
    Pyjamas.unregister = function (constructor){
        return PyjamasDB.remove(constructor);
    };

    /**
     * Manifests an instance of a class as a bare-bones object that confirms
     * to JavaScript Object Notation. The resulting object will have no
     * undefined fields, functions or a constructor. There are no references
     * to the original constructor stored. It is up to the user to keep the
     * association of the return the type class definition of the manifested
     * object.
     *
     * @param target {object} Target object to manifest
     *
     * @return {object} Versioned persistable representation of target
     *
     * @public
     * @memberof Pyjamas
     */
    Pyjamas.manifest = function (target){
        return encode(target);
    };

    /**
     * Reconstructs a persisted object as an instance of the given constructor.
     * If the given target is not at the current version of the constructor then
     * upgraders will be successively applied until the highest version is
     * achieved.
     *
     * @param constructor   {function}  Object constructor
     * @param target        {object}    Raw instance to use to populate
     * a new instance of the constructor
     * @end
     *
     * @return {object} A new instance of the constructor
     *
     * @public
     * @memberof Pyjamas
     */
    Pyjamas.construct = function (constructor, target){
        return decode(constructor, target);
    };

    /**
     * Returns a JSON string representation of a target instance
     *
     * @param target {object} Target object to serialized
     *
     * @return {string} JSON string representation of target
     *
     * @see Pyjamas.manifest
     * @public
     * @memberof Pyjamas
     */
    Pyjamas.toJSON = function(target){
        return JSON.stringify(Pyjamas.manifest(target));
    };

    /**
     * Make Version publicly accessible
     *
     * @type {Version}
     */
    Pyjamas.Version = Version;

    /**
     * Make Pyjamas DB publicly accessible
     *
     * @type {PyjamasDB}
     */
    Pyjamas.DB = PyjamasDB;

    return Pyjamas;
}());

if('undefined' !== typeof module){
    module.exports = Pyjamas;
}
