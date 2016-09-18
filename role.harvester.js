var helpers = require('global.helpers');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var targets = var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
        var shouldBuild = _.every(targets, function(t){return t.hits == t.hitsMax});

        if(shouldBuild) {
            var buildingTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(buildingTargets.length) {
                if(creep.build(buildingTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildingTargets[0]);
                }
            }
        }
        else {
    	    if(creep.carry.energy < creep.carryCapacity) {
                var source = helpers.findSource(creep);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
                });

                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            }
    }
	}
};

module.exports = roleHarvester;