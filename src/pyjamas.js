
/**
 * @name Pyjamas
 *
 * Pyjamas is a simple library that provides basic version management for
 * persisting reflections JavaScript code as JSON.
 *
 * @TODO Improve this description!
 *
 * @version 0.0.3
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
         * @return {Pyjamas} Inserted pyjamas instance
         */
        function insert (constructor, instance){
            db[constructor] = instance;
            return instance;
        }

        /**
         * Fetches an entry from the database or returns null
         *
         * @param target {object} Target to return related pyjamas instance for
         *
         * @return {Pyjamas | null}
         */
        function fetch (target){
            return db[target.constructor] || null;
        }

        /**
         * Removes an entry from the database and returns said entry or null
         *
         * @param constructor {function} Object constructor
         *
         * @return {Pyjamas | null}
         */
        function remove(constructor){
            var instance = db[constructor];
            delete db[constructor];
            return instance;
        }

        return {
            fetch   : fetch,
            insert  : insert,
            remove  : remove
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
     */
    var Version = (function(){

        /**
         * Given a string representation of a version, convert the version
         * to a 3 element array
         *
         * @param version {string} A version identifier
         *
         * @return {Array<int>} [major, minor, patch] Version array
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
     * Encodes each key in the target if it is defined and defined in the
     * prototype of the object
     *
     * @param keys      {object} Object with the keys of the target to encode
     * @param target    {object} Object to encode
     * @param [version] {string} Version string of output
     *
     * @return {object} Encoded object
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
     *
     * @private
     */
    function encode (target){
        var pjs = PyjamasDB.fetch(target);

        return pjs ? encodeEach(pjs.defines, target, pjs.version) :
            target instanceof Object ? encodeEach(target, target) :
            target;
    }

    /**
     * Constructs a new Pyjamas instance with default values
     *
     * @param [version] {string} Current version of instance
     * @param [defines] {object} Definitions of instance variables
     *
     * @constructor
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
     * @return {Pyjamas} An updated Pyjamas instance
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
     * @return {Pyjamas} A new Pyjamas instance
     */
    Pyjamas.register = function(constructor, version, defines){
        return PyjamasDB.insert(constructor, new Pyjamas(version, defines));
    };

    /**
     * Removes a class from the PyjamasDB if it exists, otherwise return null
     *
     * @param constructor {function} Object constructor to unregister
     *
     * @return {Pyjamas | null} Removed Pyjamas instance or null if the
     * constructor was not registered
     * @end
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
     */
    Pyjamas.construct = function (){
        // TODO
    };

    /**
     * Returns a JSON string representation of a target instance
     *
     * @param target {object} Target object to serialized
     *
     * @return {string} JSON string representation of target
     *
     * @see Pyjamas.manifest
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
