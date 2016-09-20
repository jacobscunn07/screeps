var helpers = require('global.helpers');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	        creep.say('repairing');
	    }

	    if(creep.memory.repairing) {
            var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(s) {return s.hits < (s.hitsMax*.7)}});

            if(creep.repair(structure) == ERR_NOT_IN_RANGE) {
                creep.say("repairing...")
                creep.moveTo(structure);
            }
        }
        else {
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
	}
};

module.exports = roleRepairer;