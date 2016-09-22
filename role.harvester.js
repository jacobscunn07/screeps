var helpers = require('global.helpers');

var roleHarvester = {
    create: function() {
        var tiers = [
            {body:[WORK,CARRY,MOVE]}
        ];

        _.forEach(tiers, function(tier){
            if(Game.spawns.Spawn1.canCreateCreep(tier.body, undefined, {role: 'harvester'}) == OK) {
                var name = Game.spawns.Spawn1.createCreep(tier.body, undefined, {role: 'harvester'});
                console.log("Spawning Harvester, " + name);
            }
        });
    },
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var energy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if(energy)
            {
                if(creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy);
                }
            }
            else {
                var container = creep.findClosestContainerWithEnergy();
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
        }
        else {
            var target = creep.findClosestPlaceToDumpEnergy();
            if(target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(target);
            }
        }
    }
};

module.exports = roleHarvester;
