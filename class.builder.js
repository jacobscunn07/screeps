var builder = class Builder {
    constructor(creep) {
        this.creep = creep;
    }

    create(spawn, room) {
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
                    home: room || self.spawn.room.name
                });
            }
        });
        if (name) {
          this.creep = Game.creeps[name];
          console.log("Spawning Miner, " + name + ", in room " + self.spawn.room.name);
        }
    }

    run() {
        if (this.creep.room.name != this.creep.memory.home) {
            this.creep.moveTo(this.creep.pos.findClosestByPath(this.creep.room.findExitTo(this.creep.memory.home)));
        } else {
            if (this.creep.memory.building && this.creep.carry.energy == 0) {
                this.creep.memory.building = false;
            }
            if (!this.creep.memory.building && this.creep.carry.energy == this.creep.carryCapacity) {
                this.creep.memory.building = true;
            }

            if (this.creep.memory.building) {
                var targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (this.creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(targets[0]);
                    }
                }
            } else {
                var container = this.creep.findClosestContainerWithEnergy();
                if (this.creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(container);
                }

                if (!container) {
                    var source = this.creep.findClosestSource();
                    if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(source);
                    }
                }
            }
        }
    }
};

module.exports = builder;
