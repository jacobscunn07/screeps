class CreepExtensionsRegistrar {
    static register() {
        Creep.prototype.findClosestContainerWithEnergyToMe = function() {
            return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(c) {
                    return c.structureType == STRUCTURE_CONTAINER && c.store.energy > 0;
                }
            });
        }

        Creep.prototype.findClosestSourceToMe = function() {
            return this.pos.findClosestByPath(FIND_SOURCES);
        }
    }
}

module.exports = CreepExtensionsRegistrar;
