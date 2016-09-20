var helpers = require('global.helpers');

var roleMiner = {
    create: function() {
        var tiers = [
            [WORK,WORK,WORK,CARRY,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,MOVE],
            [WORK,WORK,CARRY,MOVE],
            [WORK,CARRY,MOVE]
        ];

        for(var tier in tiers) {
            if(Game.spawns.Spawn1.canCreateCreep(tier, undefined, {role: 'miner'})) {
                var name = Game.spawns.Spawn1.createCreep(tier, undefined, {role: 'miner'});
                console.log("Spawning Miner, " + name);
            }
        }
    },
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var source = helpers.findSource(creep);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            var container = helpers.findClosestContainer(creep);
            if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);    
            }
        }
	}
};

module.exports = roleMiner;