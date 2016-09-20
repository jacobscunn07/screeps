var helpers = require('global.helpers');

var roleBuilder = {
    create: function() {
        var tiers = [
            {body:[WORK,CARRY,MOVE]}
        ];

        _.forEach(tiers, function(tier){
            if(Game.spawns.Spawn1.canCreateCreep(tier.body, undefined, {role: 'builder'}) == OK) {
                var name = Game.spawns.Spawn1.createCreep(tier.body, undefined, {role: 'builder'});
                console.log("Spawning Builder, " + name);
            }
        });
    },
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
	    }
	    else {
	        /*
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
			*/
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

module.exports = roleBuilder;