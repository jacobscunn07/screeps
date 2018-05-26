class CreepExtensionsRegistrar {
    static register() {
        Creep.prototype.findClosestSourceToMe = function() {
            return this.pos.findClosestByPath(FIND_SOURCES);
        }
    }
}

module.exports = CreepExtensionsRegistrar;
