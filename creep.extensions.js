var extensions = {
    register: function() {
        Creep.prototype.findClosestSpawn = function() {
            return this.pos.findClosestByPath(FIND_MY_SPAWNS);
        };

        Creep.prototype.findClosestPlaceToDumpEnergy = function() {
            return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
        };

        Creep.prototype.getStorage = function() {
            return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE && structure.store.energy < structure.storeCapacity);
                }
            });
        };

        Creep.prototype.findClosestContainerThatIsNotFull = function() {
            return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(c) {
                    return c.structureType == STRUCTURE_CONTAINER && c.store.energy < c.storeCapacity;
                }
            });
        };

        Creep.prototype.findClosestContainerWithEnergy = function() {
            return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(c) {
                    return c.structureType == STRUCTURE_CONTAINER && c.store.energy > 0;
                }
            });
        };

        Creep.prototype.findSources = function() {
            return this.room.find(FIND_SOURCES);
        };

        Creep.prototype.findClosestSource = function() {
            return this.pos.findClosestByPath(FIND_SOURCES);
        };

        Creep.prototype.findClosestStructureNeedingRepair = function() {
            return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(s) {
                    return s.hits < (s.hitsMax * .7)
                }
            });
        };

        Creep.prototype.findClosestConstructionSite = function() {
            return this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        };

        Creep.prototype.placeRoadUnderMe = function() {
            return this.pos.createConstructionSite(STRUCTURE_ROAD);
        };
    }
};

module.exports = extensions;
