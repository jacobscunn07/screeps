var helpers = require('global.helpers');

var roleMiner = {
    create: function() {
        var tiers = [
            {body:[WORK,CARRY,MOVE]},
            {body:[WORK,WORK,CARRY,MOVE]},
            {body:[WORK,WORK,WORK,CARRY,MOVE]},
            {body:[WORK,WORK,WORK,WORK,CARRY,MOVE]},
            {body:[WORK,WORK,WORK,WORK,WORK,CARRY,MOVE]},
            {body:[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE]}
        ];

        _.forEach(tiers, function(tier){
            if(Game.spawns.Spawn1.canCreateCreep(tier.body, undefined, {role: 'miner'}) == OK) {
                var name = Game.spawns.Spawn1.createCreep(tier.body, undefined, {role: 'miner'});
                console.log("Spawning Miner, " + name);
            }
        });
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