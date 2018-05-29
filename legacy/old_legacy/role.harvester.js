var helpers = require('global.helpers');
var roleUpgrader = require('role.upgrader');

var roleHarvester = {
    create: function(spawn, room) {
        var tiers = [{
            body: [CARRY, CARRY, MOVE, MOVE]
        }, {
            body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        }, {
            body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }, ];

        _.forEach(tiers, function(tier) {
            if (spawn.canCreateCreep(tier.body, undefined, {
                    role: 'harvester'
                }) == OK) {
                var name = spawn.createCreep(tier.body, undefined, {
                    role: 'harvester',
                    home: room || spawn.room.name
                });
                console.log("Spawning Harvester, " + name);
            }
        });
    },
    run: function(creep) {
        if (creep.carry.energy > 0) {
            var target = creep.findClosestPlaceToDumpEnergy();
            if (target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else if (creep.carry.energy == 0) {
            if (creep.room.name != creep.memory.home) {
                creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.home)));
            } else {
                var energy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                if (energy && creep.targetIsInRange(energy, 4)) {
                    if (creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(energy);
                    }
                } else {
                    var container = creep.findClosestContainerWithEnergy();
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            }
        } else {
            roleUpgrader.run(creep);
        }
    }
};

module.exports = roleHarvester;
