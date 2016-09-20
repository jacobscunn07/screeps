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
            if(creep.memory.structure) {
                var structure = Game.getObjectById(creep.memory.structure);
                if(creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
                
                if(structure.hits == structure.hitsMax) {
                    creep.memory.structure = null;
                }
            }
            else {
                var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(s) {return s.hits < (s.hitsMax*.7)}});
                creep.memory.structure = structure.id;
            }
        }
        else {
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