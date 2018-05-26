var _ = require('lodash');

var helpers = {
	findSource: function(creep)
	{
		if(creep.memory.targetSourceId) {
			var source = Game.getObjectById(creep.memory.targetSourceId);
			return source;
		}
		else
		{
			/*var sources = creep.room.find(FIND_SOURCES);
			var sourceCounts = [];
			_.forEach(sources, function(source) {
				var count = _.filter(Game.creeps, function(c) { return c.memory.targetSourceId == source.id }).length;
				var sourceObject = {source: source, count: count};
				sourceCounts.push(sourceObject);
			});
			var s = _.min(sourceCounts, 'count');
			s = s.source;
			creep.memory.targetSourceId = s.id;
			return s;*/

			var source = creep.pos.findClosestByPath(FIND_SOURCES);
			creep.memory.targetSourceId = source.id;
			return source;
		}
	},
	findClosestContainer: function(creeper) {
		var containers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
			filter: function(c) { return c.structureType == STRUCTURE_CONTAINER && c.store.energy < c.storeCapacity && c.store.energy > 0  }});
		var container = creeper.pos.findClosestByRange(containers);
		/*if (!container) {
    		var extensions = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
		        filter: function(c) { return c.structureType == STRUCTURE_EXTENSION && c.energy < c.energyCapacity }});
		    container = creeper.pos.findClosestByRange(extensions);
		}*/
	    return container;
	},
	findSpawn: function(creeper) {
	        var targets = creeper.room.find(FIND_STRUCTURES, {
	            filter: (structure) => {
	                return structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity;
	            }
	        });

    		var spawn = creeper.pos.findClosestByRange(targets);


    	    return spawn;
	}
};

module.exports = helpers;
