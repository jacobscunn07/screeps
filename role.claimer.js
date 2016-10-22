var claimerBuilder = {
    create: function(spawn, destination) {
        var tiers = [{
            body: [CLAIM, CLAIM, MOVE, MOVE]
        }];

        var body = null;
        _.forEach(tiers, function(tier) {
            if (spawn.canCreateCreep(tier.body, undefined, {
                    role: 'claimer'
                }) == OK) {
                body = tier.body;
            }
        });
        var name = spawn.createCreep(body, undefined, {
            destination: destination || spawn.room.name,
            home: spawn.room.name,
            role: 'claimer'
        });
        if (name) console.log("Spawning Claimer, " + name);
    },
    run: function(creep) {
        if (creep.room.name != creep.memory.destination) {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.destination)));
        } else {
            var result = creep.claimController(creep.room.controller);
            //console.log(result);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = claimerBuilder;
