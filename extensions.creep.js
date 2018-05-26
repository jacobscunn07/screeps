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

        Creep.prototype.tryMineEnergySource = function(source) {
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        }
    }
}

module.exports = CreepExtensionsRegistrar;
