var helpers = require('global.helpers');

var roleBuilder = {
    create: function(spawn, room) {
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
                    role: 'builder'
                }) == OK) {
                var name = spawn.createCreep(tier.body, undefined, {
                    role: 'builder',
home: room || spawn.room.name
                });
                console.log("Spawning Builder, " + name);
            }
        });
    },
    run: function(creep) {
        if (creep.room.name != creep.memory.home) {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.home)));
        } else {

            if (creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
            }
            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
            }

            if (creep.memory.building) {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            } else {
                var container = creep.findClosestContainerWithEnergy();
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }

                if (!container) {
                    var source = creep.findClosestSource();
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;
