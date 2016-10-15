var helpers = require('global.helpers');

var roleRepairer = {
    create: function(spawn) {
        var tiers = [{
            body: [WORK, CARRY, MOVE, MOVE]
        }, {
            body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        }, {
            body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
        }, {
            body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }, {
            body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }];

        _.forEach(tiers, function(tier) {
            if (spawn.canCreateCreep(tier.body, undefined, {
                    role: 'repairer'
                }) == OK) {
                var name = spawn.createCreep(tier.body, undefined, {
                    role: 'repairer',
                    home: spawn.room.name
                });
                console.log("Spawning Repairer, " + name);
            }
        });
    },
    run: function(creep) {
        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.memory.structure = null;
        }
        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
        }

        if (creep.memory.repairing) {
            if (creep.memory.structure) {
                var structure = Game.getObjectById(creep.memory.structure);
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }

                if (structure.hits == structure.hitsMax) {
                    creep.memory.structure = null;
                }
            } else {
                var structure = creep.findWeakestStructureOfType([STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_TOWER]);
                structure = structure || creep.findWeakestStructureOfType([STRUCTURE_WALL, STRUCTURE_RAMPART]);
                creep.memory.structure = structure.id;
            }
        } else {
            var container = creep.findClosestContainerWithEnergy();
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        }
    }
};

module.exports = roleRepairer;
