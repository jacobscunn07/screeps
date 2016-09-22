var helpers = require('global.helpers');

var roleMiner = {
    create: function() {
        var tiers = [
            {body:[WORK,CARRY,MOVE]},
            {body:[WORK,WORK,CARRY,MOVE]},
            {body:[WORK,WORK,WORK,CARRY,MOVE]},
            {body:[WORK,WORK,WORK,WORK,CARRY,MOVE]},
            {body:[WORK,WORK,WORK,WORK,WORK,CARRY,MOVE]},
            {body:[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE]}
        ];

        _.forEach(tiers, function(tier){
            if(Game.spawns.Spawn1.canCreateCreep(tier.body, undefined, {role: 'miner'}) == OK) {
                var name = Game.spawns.Spawn1.createCreep(tier.body, undefined, {role: 'miner'});
                console.log("Spawning Miner, " + name);
            }
        });
    },
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var source = null;
            if(creep.memory.targetSourceId) {
        			var source = Game.getObjectById(creep.memory.targetSourceId);
        		}
            else {
              var sources = creep.findSources();
              _.forEach(sources, function(s) {
                if(!_.any(Game.creeps), function(c) { return c.memory.targetSourceId == s.id}) {
                  source = s;
                  creep.memory.targetSourceId = source.id;
                }
        			});
          }

          if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
              creep.moveTo(source);
          }
        }
        else {
          var container = creep.findClosestContainerThatIsNotFull();
          if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(container);
          }
        }
	}
};

module.exports = roleMiner;
