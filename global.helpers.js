var _ = require('lodash');

var helpers = {
	findSource: function(creep)
	{
		if(creep.memory.targetSourceId) {
			return Game.getObjectById(creep.memory.targetSourceId);
		}
		else
		{
			var sources = creep.room.find(FIND_SOURCES);
			var sourceCounts = [];
			_.forEach(sources, function(source) {
				var count = _.filter(Game.creeps, function(c) { return c.targetSourceId == source.id }).length;
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