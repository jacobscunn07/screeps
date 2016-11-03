var agitator = class Agitator {
    constructor(obj) {
        this.creep = obj.creep;
        this.home = obj.home;
        this.destination = obj.destination;
    }

    create(spawn) {
        var tiers = [{
            body: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE]
        }];

        var name = null;
        var home = this.home;
        var destination = this.destination;
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
