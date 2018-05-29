var CreepExtensionsRegistrar = require("extensions.creep");
var SourceExtensionsRegistrar = require("extensions.source");
var RoomExtensionsRegistrar = require("extensions.room");

class Bootstrapper
{
    static bootstrap() {
        CreepExtensionsRegistrar.register();
        SourceExtensionsRegistrar.register();
        RoomExtensionsRegistrar.register();
    }
}

module.exports = Bootstrapper;
