var claimerBuilder = {
    create: function(spawn) {
        var tiers = [{
            body: [CLAIM, MOVE]
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
            destination: 'W56S68',
            home: spawn.room.name,
            role: 'claimer'
        });
        if (name) console.log("Spawning Claimer, " + name);
    },
    run: function(creep) {
        if (creep.room.name != creep.memory.destination) {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.destination)));
        } else {
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = claimerBuilder;
