var agitator = class Agitator {
    constructor(obj) {
        this.creep = obj.creep;
        this.home = obj.home;
        this.destination = obj.destination;
    }

    create(spawn) {
        var tiers = [{
            body: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, HEAL, MOVE]
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
      //if in destination
        //if health > 80%
          //move toward controller
        //else go back home
      //if in home
        //if health not max
          //heal
        //else go to destination


      if(this.creep.room.name == this.creep.memory.home) {
        if(this.creep.hits < this.creep.hitsMax) {
          this.creep.heal(this.creep);
        } else {
          this.creep.moveTo(this.creep.pos.findClosestByPath(this.creep.room.findExitTo(this.creep.memory.destination)));
        }
      } else if(this.creep.room.name == this.creep.memory.destination) {
        if(this.creep.hits >= this.creep.hits*.8) {
          this.creep.moveTo(this.creep.room.controller);
        } else {
          this.creep.moveTo(this.creep.pos.findClosestByPath(this.creep.room.findExitTo(this.creep.memory.home)));
        }
      } else {
        this.creep.moveTo(this.creep.pos.findClosestByPath(this.creep.room.findExitTo(this.creep.memory.destination)));
      }


      // if (this.creep.room.name != this.creep.memory.home) {
      //     this.creep.moveTo(this.creep.pos.findClosestByPath(this.creep.room.findExitTo(this.creep.memory.home)));
      // } else if(this.creep.room.name != this.creep.memory.destination) {
      //   this.creep.moveTo(this.creep.pos.findClosestByPath(this.creep.room.findExitTo(this.creep.memory.destination)));
      // }
    }
};
module.exports = agitator;
