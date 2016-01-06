
var Versionable = (function(){
    var Version = (function(){})();

    function Versionable (){}

    return Versionable;
})();

if('undefined' !== typeof module){
    module.exports = Versionable;
}
