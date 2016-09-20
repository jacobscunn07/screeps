var helpers = require('global.helpers');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            // var source = helpers.findSource(creep);
            // if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(source);
            // }

            var containers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, { 
                filter: function(c) { 
                    return c.structureType == STRUCTURE_CONTAINER && 
                        c.store.energy > 0;
                    }
                });
            var container = creep.pos.findClosestByRange(containers);
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);    
            }
        }
        else {
            var energy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);

            if(energy)
            {
                if(creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
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