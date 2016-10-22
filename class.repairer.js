var repairer = class Repairer {
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
            if (spawn.canCreateCreep(tier.body, undefined, {
                    role: 'repairer'
                }) == OK) {
                name = spawn.createCreep(tier.body, undefined, {
                    role: 'repairer',
                    home: spawn.room.name
                });
            }
        });

        if (name) {
          this.creep = Game.creeps[name];
          console.log("Spawning Repairer, " + name + ", in room " + self.spawn.room.name);
        }
    }

    run() {
        if (this.creep.memory.repairing && this.creep.carry.energy == 0) {
            this.creep.memory.repairing = false;
            this.creep.memory.structure = null;
        }
        if (!this.creep.memory.repairing && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.repairing = true;
        }

        if (this.creep.memory.repairing) {
            if (this.creep.memory.structure) {
                var structure = Game.getObjectById(this.creep.memory.structure);
                if (this.creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(structure);
                }

                if (structure.hits == structure.hitsMax) {
                    this.creep.memory.structure = null;
                }
            } else {
                var structure = this.creep.findWeakestStructureOfType([STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_TOWER]);
                structure = structure || this.creep.findWeakestStructureOfType([STRUCTURE_WALL, STRUCTURE_RAMPART]);
                this.creep.memory.structure = structure.id;
            }
        } else {
            var container = this.creep.findClosestContainerWithEnergy();
            if (this.creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(container);
            }
        }
    }
};
module.exports = repairer;
