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
			var s = _.min(sourceCounts, 'count');
			console.log('Source: ' + JSON.stringify(source));
			s = s.source;
			//var source = sourceCounts[0].source;
			creep.memory.targetSourceId = s.id;
			return s;
		}
	}
};

module.exports = helpers;