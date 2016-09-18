var _ = require('lodash');

var helpers = {
	findSource: function(creep)
	{
		if(creep.memory.targetSourceId) {
			var source = Game.getObjectById(creep.memory.targetSourceId);
			console.log(creep.name + " heading to source " + source.id);
			return source;
		}
		else
		{
			var sources = creep.room.find(FIND_SOURCES);
			var sourceCounts = [];
			_.forEach(sources, function(source) {
				var count = _.filter(Game.creeps, function(c) { return c.memory.targetSourceId == source.id }).length;
				var sourceObject = {source: source, count: count};
				sourceCounts.push(sourceObject);
			});
			console.log('Sources: ' + JSON.stringify(sourceCounts));
			var s = _.min(sourceCounts, 'count');
			console.log('Source: ' + JSON.stringify(s));
			s = s.source;
			creep.memory.targetSourceId = s.id;
			return s;
		}
	}
};

module.exports = helpers;