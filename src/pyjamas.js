/**
 * Pyjamas is a simple library that provides basic version management for
 * persisting reflections JavaScript code as JSON.
 *
 * @TODO Improve this description!
 *
 * @version 0.0.3
 * @namespace Pyjamas
 */
var Pyjamas = (function () {
    'use strict';

    /**
     * Stores relationships between classes and Pyjamas definitions.
     *
     * @private
     */
    var PyjamasDB = (function () {

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
        function insert (constructor, instance) {
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
        function contains (constructor) {
            return constructor in db;
        }

        /**
         * Fetches an entry from the database or returns null
         *
         * @param constructor {function} Object constructor
         *
         * @return {Pyjamas.Pyjamas | null}
         */
        function fetch (constructor) {
            return db[constructor] || null;
        }

        /**
         * Removes an entry from the database and returns said entry or null
         *
         * @param constructor {function} Object constructor
         *
         * @return {Pyjamas.Pyjamas | null}
         */
        function remove (constructor) {
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
     *
     * @public
     * @class Version
     * @memberof Pyjamas
     */
    var Version = (function () {

        /**
         * Given a string representation of a version, convert the version
         * to a 3 element array
         *
         * @param version {string} A version identifier
         *
         * @return {Array<int>} [major, minor, patch] Version array
         * @memberof Pyjamas.Version
         */
        function split (version) {
            var parts = (version || '').split('.');
            return [
                parseInt(parts[0], 10) || 0,
                parseInt(parts[1], 10) || 0,
                parseInt(parts[2], 10) || 0
            ];
        }

        /**
         * Returns the major number of a version string
         *
         * @param version {string} A version identifier
         *
         * @return {int} Major version number
         * @memberof Pyjamas.Version
         */
        function major (version) {
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
        function minor (version) {
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
        function patch (version) {
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
        function diff (base, other) {
            var o = split(other);

            // Map over the base version and subtract the
            // corresponding index of the other version
            return split(base).map(function (v, i) {
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
        function compare (base, other) {
            return diff(base, other).reduce(function (prev, curr) {
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
        function lessThan (base, other) {
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
        function toString (version) {
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
    function getConstructor (target) {
        return ('undefined' === typeof target || target === null) ?
            function () {} :
            target.constructor;
    }

    /**
     * Performs a deep clone of an object by copying all non-primitive fields
     *
     * @param base {*} Base data to copy
     *
     * @return {*} A copy of the target data
     * @private
     */
    function clone (base) {
        var field, target = {};
        for (field in base) {
            target[field] =
                Array.isArray(base[field])      ? base[field].map(clone)    :
                base[field] instanceof Object   ? clone(base[field])        :
                base[field];
        }
        return target;
    }

    /**
     * Copies the fields of a target object into the base. If the
     * 'deep' flag is set then the merge will perform a deep copy
     * of the object before merging.
     *
     * @param base      {object}    Base object to extend
     * @param target    {object}    Data to copy
     * @param [deep]    {boolean}   If this merge should be a deep copy
     *
     * @return {object} The extended base object
     * @private
     */
    function merge (base, target, deep) {
        var field;
        target = deep ? clone(target) : target;

        for (field in target) {
            base[field] = target[field];
        }
        return base;
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
    function encodeEach (keys, target, version) {
        var key, output = {};

        if (Array.isArray(target)) {
            return target.map(function (x) { return encodeEach(x, x); });
        }
        else if (target instanceof Object) {
            for (key in keys) {
                if(target.hasOwnProperty(key)           &&
                    'undefined' !== typeof target[key]  &&
                    'function'  !== typeof target[key]  ) {
                    output[key] = encode(target[key]);
                }
            }
            if (version) {
                output.version = version;
            }
            return output;
        }
        return target;
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
    function encode (target) {
        var parent = {},
            pjs = PyjamasDB.fetch(getConstructor(target));

        if (pjs) {
            if (pjs.parent) {
                parent = encode(merge(clone(target), {constructor : pjs.parent}));
            }
            return merge(parent, encodeEach(pjs.defines, target, pjs.version));
        }
        return target instanceof Object ? encodeEach(target, target) : target;
    }

    /**
     * Checks if the given value is an instance of the constructor.
     * If so then returns the value, otherwise it returns a new
     * instance of the constructor
     *
     * @param constructor   {function}  Object constructor
     * @param value         {*}         Instance of constructor or nothing
     * @param defers        {Array}     Constructors to defer execution
     *
     * @return {*} An instance of the constructor
     * @private
     */
    function construct (constructor, value, defers) {
        if ('function' === typeof constructor) {
            if (getConstructor(value) === constructor) {
                return value;
            } else if (defers.indexOf(constructor) < 0) {
                return new constructor(); // jshint ignore : line
            } else {
                return merge(Object.create(constructor.prototype), value);
            }
        }
        return value;
    }

    /**
     * Applies all upgrade functions to the target instance and
     * returns the new target. The versions are sorted in ascending
     * order before being applied.
     *
     * @param pjs       {Pyjamas}   Pyjamas instance matching the target type
     * @param target    {object}    Raw object instance to upgrade
     *
     * @return {object} Raw target with upgrade functions applied
     * @private
     */
    function upgrade (pjs, target) {
        var i, buffer, versions;

        // Before we decode the constructor we need to apply
        // any defined upgrade functions to the raw object
        versions = Object.keys(pjs.upgrades).sort(Version.compare);
        for (i in versions) {
            if (Version.greaterThan(versions[i], target.version)) {
                buffer = pjs.upgrades[versions[i]](target);
                target = buffer ? buffer : target;
            }
        }
        return target;
    }

    /**
     * Decodes an object to become an instance of the given constructor
     *
     * @param constructor   {function}  Object constructor
     * @param target        {object}    Raw object that populates a new instance
     * @param [defers]      {Array}     Constructors to defer execution
     *
     * @return {object} New instance of the constructor
     * @private
     */
    function decode (constructor, target, defers) {
        var key, instance, pjs;

        pjs      = PyjamasDB.fetch(constructor) || {};
        defers   = (pjs.defers || []).concat(defers || []);
        instance = construct(constructor, target, defers);

        // If the constructor is in the Pyjamas database
        // then we need to fetch the Pyjamas configuration
        // so that we can apply the correct properties to
        // the new instance.
        if (PyjamasDB.contains(constructor)) {

            // If we have a Pyjamas instance then we need to ensure
            // that we decode any parent properties before decoding this
            // object
            if (pjs.parent) {
                target = merge(decode(pjs.parent, target, defers), target);
            }

            // Before we decode the constructor we need to apply
            // any defined upgrade functions to the raw object
            target = upgrade(pjs, target);

            // For each defined value we need to decode it
            // and recursively apply  the corresponding constructor
            for (key in pjs.defines) {
                if (pjs.defines.hasOwnProperty(key) && target[key] !== undefined) {
                    instance[key] = decode(pjs.defines[key], target[key], defers);
                }
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
    function Pyjamas (version, defines) {

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
         *      '0.1.2' : function myUpgrader1() {},
         *      '0.2.3' : function myUpgrader2() {}
         * }
         *
         * @type {object}
         */
        this.upgrades = {};

        /**
         * Parent to Pyjamas instance. When serializing, any fields
         * in the parent will be applied to this instance.
         *
         * @type {object}
         * @see Pyjamas.prototype.extend
         */
        this.parent = null;

        /**
         * List of constructors to defer execution of
         *
         * @type {Array}
         */
        this.defers = [];
    }

    /**
     * Defers executing the given constructor. This can allow an object
     * to be built only using its current values and will not execute the
     * constructor. This will only copy the prototype from the constructor.
     *
     * @param constructor {function} Object constructor
     *
     * @return {Pyjamas.Pyjamas} This Pyjamas instance
     *
     * @example
     * Pyjamas.register(Foo, {
     *      a : Number,
     *      b : String,
     *      c : Bar
     * }).defer(Bar);
     *
     */
    Pyjamas.prototype.defer = function (constructor) {
        this.defers.push(constructor);
        return this;
    };

    /**
     * Registers an upgrade function to this Pyjamas instance. An upgrade
     * function must accept a copy of a old version of a save and the current
     * instance. It should either mutate the current instance of the save or
     * return an upgraded version.
     *
     * @param version {string} Version code that indicates the version of the
     * instance returned from this upgrade function
     *
     * @param upgrader {function} Function to upgrade old save. Prototype:
     * function ( old :  Object, current : Object) : Object
     *
     * @return {Pyjamas.Pyjamas} An updated Pyjamas instance
     *
     * @public
     * @memberof Pyjamas.Pyjamas
     */
    Pyjamas.prototype.upgrade = function (version, upgrader) {
        this.upgrades[version] = upgrader;
        return this;
    };

    /**
     * Extends this Pyjamas instance so it has the given parent. If the parent
     * is a registered Pyjamas instance then any of the parents fields will be
     * applied to the child. When deserializing, the parent's upgrade functions
     * will be applied to this instance before applying its upgraders.
     *
     * @param parent {function} Constructor of parent instance
     *
     * @return {Pyjamas.Pyjamas} An updated Pyjamas instance
     *
     * @public
     * @memberof Pyjamas.Pyjamas
     */
    Pyjamas.prototype.extend = function (parent) {
        this.parent = parent;
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
     *
     * @param constructor   {function}  Object constructor to register
     * @param version       {string}    Current version of object constructor
     * @param defines       {object}    Definitions of instance variables to
     * persist when given an instance of the constructor's class
     *
     * @return {Pyjamas.Pyjamas} A new Pyjamas instance
     *
     * @public
     * @memberof Pyjamas
     */
    Pyjamas.register = function (constructor, version, defines) {
        return PyjamasDB.insert(constructor, new Pyjamas(version, defines));
    };

    /**
     * Removes a class from the PyjamasDB if it exists, otherwise return null
     *
     * @param constructor {function} Object constructor to unregister
     *
     * @return {Pyjamas.Pyjamas | null} Removed Pyjamas instance or null if the
     * constructor was not registered
     *
     * @public
     * @memberof Pyjamas
     */
    Pyjamas.unregister = function (constructor) {
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
    Pyjamas.manifest = function (target) {
        return encode(target);
    };

    /**
     * @alias Pyjamas.manifest
     */
    Pyjamas.serialize = Pyjamas.manifest;

    /**
     * Reconstructs a persisted object as an instance of the given constructor.
     * If the given target is not at the current version of the constructor then
     * upgraders will be successively applied until the highest version is
     * achieved.
     *
     * @param constructor   {function}  Object constructor
     * @param target        {object}    Raw instance to use to populate
     * a new instance of the constructor
     *
     * @return {object} A new instance of the constructor
     *
     * @public
     * @memberof Pyjamas
     */
    Pyjamas.construct = function (constructor, target) {
        return decode(constructor, target);
    };

    /**
     * @alias Pyjamas.construct
     */
    Pyjamas.deserialize = Pyjamas.construct;

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
    Pyjamas.toJSON = function (target) {
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

if('undefined' !== typeof module)  module.exports = Pyjamas;
