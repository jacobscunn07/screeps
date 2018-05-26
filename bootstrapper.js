var CreepExtensionsRegistrar = require("extensions.creep");

class Bootstrapper
{
    static bootstrap() {
        CreepExtensionsRegistrar.register();
    }
}

module.exports = Bootstrapper;
