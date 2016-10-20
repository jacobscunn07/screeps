module.exports = {
    register: function() {
        class Builder {
            constructor(spawn, room) {
                this.spawn = spawn;
                this.room = room;
            }

            create() {
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

                var name = null;
                _.forEach(tiers, function(tier) {
                    if (self.spawn.canCreateCreep(tier.body, undefined, {
                            role: 'builder'
                        }) == OK) {
                        name = self.spawn.createCreep(tier.body, undefined, {
                            role: 'builder',
                            home: self.room || self.spawn.room.name
                        });
                    }
                });
                if (name) console.log("Spawning Miner, " + name + ", in room " + self.spawn.room.name);

            }

            run(creep) {
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
    }
};
