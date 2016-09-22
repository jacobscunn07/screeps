var helpers = require('global.helpers');

var roleRepairer = {
    create: function() {
        var tiers = [
            {body:[WORK,CARRY,MOVE]}
        ];

        _.forEach(tiers, function(tier){
            if(Game.spawns.Spawn1.canCreateCreep(tier.body, undefined, {role: 'repairer'}) == OK) {
                var name = Game.spawns.Spawn1.createCreep(tier.body, undefined, {role: 'repairer'});
                console.log("Spawning Repairer, " + name);
            }
        });
    },
    run: function(creep) {

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
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
                var structure = creep.findClosestConstructionSite();
                creep.memory.structure = structure.id;
            }
        }
        else {
          var container = creep.findClosestContainerWithEnergy();
          if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(container);
          }
        }
    }
};

module.exports = roleRepairer;
