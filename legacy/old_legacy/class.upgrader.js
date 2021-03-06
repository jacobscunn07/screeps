var upgrader = class Upgrader {
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

        var name = null
        _.forEach(tiers, function(tier) {
            if (spawn.canCreateCreep(tier.body, undefined, {
                    role: 'upgrader'
                }) == OK) {
                name = spawn.createCreep(tier.body, undefined, {
                    role: 'upgrader',
                    home: room || spawn.room.name
                });
            }
        });
        if (name) {
          this.creep = Game.creeps[name];
          console.log("Spawning Upgrader, " + name + ", in room " + spawn.room.name);
        }
    }

    run() {
        if (this.creep.room.name != this.creep.memory.home) {
            this.creep.moveTo(this.creep.pos.findClosestByPath(this.creep.room.findExitTo(this.creep.memory.home)));
        } else {
            if (this.creep.memory.upgrading && this.creep.carry.energy == 0) {
                this.creep.memory.upgrading = false;
            }
            if (!this.creep.memory.upgrading && this.creep.carry.energy == this.creep.carryCapacity) {
                this.creep.memory.upgrading = true;
            }

            if (this.creep.memory.upgrading) {
                if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(this.creep.room.controller);
                }
            } else {
                //console.log(JSON.stringify(this.creep.getStorage()));
                var container = this.creep.pos.findClosestByPath(Game.structures, {
                    filter: function(s){
                        return _.contains([STRUCTURE_STORAGE, STRUCTURE_CONTAINER], s.structureType) && s.store.energy > 0
                    }
                })

                /*this.creep.findClosestContainerWithEnergy() || this.creep.getStorage();*/
                if (this.creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(container);
                } else if (!container) {
                    var source = this.creep.findClosestSource();
                    if (source && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(source);
                    }
                }
            }
        }
    }
};
module.exports = upgrader;
