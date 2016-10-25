var transporter = class Transporter {
    constructor(creep) {
        this.creep = creep;
    }

    create(spawn, room) {
        var tiers = [{
            body: [CARRY, CARRY, MOVE, MOVE]
        }, {
            body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        }, {
            body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }, ];

        var name = null;
        _.forEach(tiers, function(tier) {
            if (spawn.canCreateCreep(tier.body, undefined, {
                    role: 'transporter'
                }) == OK) {
                name = spawn.createCreep(tier.body, undefined, {
                    role: 'transporter',
                    home: room || self.spawn.room.name
                });
            }
        });
        if (name) {
          this.creep = Game.creeps[name];
          console.log("Spawning Transporter, " + name + ", in room " + spawn.room.name);
        }
    }

    run() {
        if (this.creep.carry.energy > 0) {
            var target = this.creep.findClosestPlaceToDumpEnergy();
            if (target && this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target);
            }
        } else if (this.creep.carry.energy == 0) {
            if (this.creep.room.name != this.creep.memory.home) {
                this.creep.moveTo(this.creep.pos.findClosestByPath(this.creep.room.findExitTo(this.creep.memory.home)));
            } else {
                var energy = this.creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                if (energy && this.creep.targetIsInRange(energy, 4)) {
                    if (this.creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(energy);
                    }
                } else {
                    var container = this.creep.findClosestContainerWithEnergy();
                    if (this.creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(container);
                    }
                }
            }
        } else {
            roleUpgrader.run(this.creep);
        }
    }
};
module.exports = transporter;
