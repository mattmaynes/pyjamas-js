
/**
 * A decorator for a class that will add version information to an instance of
 * an object. It provides instance methods for creating static representations
 * of an instance object. There is also a factory method provided for generating
 * an instance of an object using the static representation.
 *
 * @version 0.0.0
 */
var Versionable = (function(){

    /**
     *
     */
    var Version = (function(){



        return {

        };
    })();


    function Versionable (){}

    return Versionable;
})();

if('undefined' !== typeof module){
    module.exports = Versionable;
}
