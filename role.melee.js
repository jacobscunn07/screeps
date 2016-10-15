var helpers = require('global.helpers');

var meleeBuilder = {
    create: function(spawn, destination, home) {
        var tiers = [{
            body: [TOUGH, TOUGH, ATTACK, MOVE, MOVE, MOVE]
        }, {
            body: [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]
        }, {
            body: [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE]
        }];

        var body = null;
        _.forEach(tiers, function(tier) {
            if (spawn.canCreateCreep(tier.body, undefined, {
                    role: 'melee'
                }) == OK) {
                body = tier.body;
            }
        });
        var name = spawn.createCreep(body, undefined, {
            role: 'melee',
            destination: destination || spawn.room.name,
            home: home || spawn.room.name
        });
        if (name) console.log("Spawning Attacker, " + name);
    },
    run: function(creep) {
      if (creep.room.name != creep.memory.destination) {
          creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.destination)));
      } else {
        var target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        if(!target) target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        
        if (target && creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
      }
        // else if (!target) {
        //     creep.moveTo(creep.room.controller);
        // }
    }
};

module.exports = meleeBuilder;
