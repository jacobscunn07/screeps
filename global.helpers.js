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
			console.log('Sources: ' + JSON.stringify(sources));
			var sourceCounts = [];
			_.forEach(sources, function(source) {
				console.log("Looping Source: " + JSON.stringify(source));
				var count = _.filter(Game.creeps, function(c) { return c.targetSourceId == source.id }).length;
				var sourceObject = {source: source, count: count};
				console.log("Looping Source Object: " + JSON.stringify(sourceObject));
				sourceCounts.push(sourceObject);
			});
			//sourceCounts = _.orderBy(sourceCounts, ['count']);
			console.log('Sources: ' + JSON.stringify(sourceCounts));
			var s = _.min(sourceCounts, 'count');
			console.log('Source: ' + JSON.stringify(s));
			s = s.source;
			//var source = sourceCounts[0].source;
			creep.memory.targetSourceId = s.id;
			return s;
		}
	}
};

module.exports = helpers;