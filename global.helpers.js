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
			_(sources).forEach(function(source) {
				var count = _.filter(Game.creeps, function(c) { return c.targetSourceId == source.id }).length;
				sourceCounts.push({source: source, count: count});
			});
			//sourceCounts = _.orderBy(sourceCounts, ['count']);
			var source = _.minBy(sourceCounts, function(s){return s.count})[0].source;
			//var source = sourceCounts[0].source;
			creep.memory.targetSourceId = source.id;
			return source;
		}
	}
};

module.exports = helpers;