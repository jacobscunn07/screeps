var CreepExtensionsRegistrar = require("extensions.creep");
var SourceExtensionsRegistrar = require("extensions.source");

class Bootstrapper
{
    static bootstrap() {
        CreepExtensionsRegistrar.register();
        SourceExtensionsRegistrar.register();
    }
}

module.exports = Bootstrapper;
