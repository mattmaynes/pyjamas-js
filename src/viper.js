
/**
 *
 * @version 0.0.0
 */
var Viper = (function(){

    /**
     * Stores relationships between classes and Viper definitions.
     *
     * @example
     * {
     *      MyClass : <Viper> // MyClass will have a viper instance associated
     * }
     * @end
     *
     * @private
     * @type {object}
     */
    var ViperDB = {};

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
        function split (){
            throw new Error('Version.split - not yet implemented');
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
            throw new Error('Version.diff - not yet implemented');
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
                return prev === 0 ? Math.sign(curr) : prev;
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
    })();


    /**
     * Constructs a new viper instance with default values
     *
     * @param [version] {string} Current version of instance
     *
     * @constructor
     */
    function Viper (version){

        /**
         * Version identifier of current instance
         * @type {string}
         */
        this.version = version | '0.0.0';

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
        this.defines = {};

        /**
         * Defines a set of upgrade methods to apply to old saves to update
         * to the current source version
         *
         * @example
         * {
         *      '0.1.2' : function myUpgrader1(){},
         *      '0.2.3' : function myUpgrader2(){}
         * @end
         *
         * @type {object}
         */
        this.upgrades = {};

    }

    /**
     * Registers an upgrade function to this viper instance. An upgrade function
     * must accept a copy of a old version of a save and the current instance.
     * It should either mutate the current instance of the save or return an
     * upgraded version.
     *
     * @param version {string} Version code that indicates the version of the
     * instance returned from this upgrade function
     * @end
     *
     * @param upgrader {function} Function to upgrade old save. Prototype:
     * function( old :  Object, current : Object) : Object
     * @end
     *
     * @return {Viper} An updated Viper instance
     */
    Viper.prototype.upgrade = function(){};

    /**
     * Registers a class into the ViperDB and returns a new Viper instance
     *
     * @example
     * Viper.register(MyClass, '0.1.2', {
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
     * @return {Viper} A new viper instance
     */
    Viper.register = function(){};


    Viper.unregister    = function(){};
    Viper.manifest      = function (){};
    Viper.construct     = function (){};

    return Viper;
})();

if('undefined' !== typeof module){
    module.exports = Viper;
}
