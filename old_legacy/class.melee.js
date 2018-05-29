var melee = class Melee {
    constructor(obj) {
        this.creep = obj.creep;
        this.home = obj.home;
        this.destination = obj.destination;
    }

    create(spawn) {
      var tiers = [{
          body: [TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE]
      }, {
          body: [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]
      }
      ];

        var name = null;
        var home = this.home;
        var destination = this.destination;
        _.forEach(tiers, function(tier) {
            if (spawn.canCreateCreep(tier.body, undefined, {
                    role: 'melee'
                }) == OK) {
                  name = spawn.createCreep(body, undefined, {
                      role: 'melee',
                      destination: destination || spawn.room.name,
                      home: home || spawn.room.name
                  });
            }
        });

        if (name) {
          this.creep = Game.creeps[name];
          console.log("Spawning Agitator, " + name + ", in room " + spawn.room.name);
        }
    }

    run() {
      if (this.creep.room.name != this.creep.memory.destination) {
          this.creep.moveTo(this.creep.pos.findClosestByPath(this.creep.room.findExitTo(this.creep.memory.destination)));
      } else {
        //var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var target = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: function(s) { return s.structureType == STRUCTURE_TOWER}});
        if(!target) target = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: function(s) { return s.structureType == STRUCTURE_SPAWN}});
        if(!target) target = this.creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

        if (target && this.creep.attack(target) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(target);
        }
    }
  }
};
module.exports = melee;
