var agitator = class Agitator {
    constructor(creep) {
        this.creep = creep;
    }

    create(spawn, home, destination) {
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
                    role: 'agitator'
                }) == OK) {
                name = spawn.createCreep(tier.body, undefined, {
                    role: 'agitator',
                    home: home || spawn.room.name,
                    destination: destination || spawn.room.name
                });
            }
        });

        if (name) {
          this.creep = Game.creeps[name];
          console.log("Spawning Agitator, " + name + ", in room " + spawn.room.name);
        }
    }

    run() {
      if (this.creep.room.name != this.creep.memory.home) {
          this.creep.moveTo(this.creep.pos.findClosestByPath(this.creep.room.findExitTo(this.creep.memory.home)));
      } else if(this.creep.room.name != this.creep.memory.destination) {
        this.creep.moveTo(this.creep.pos.findClosestByPath(this.creep.room.findExitTo(this.creep.memory.destination)));
      }
    }
};
module.exports = agitator;
