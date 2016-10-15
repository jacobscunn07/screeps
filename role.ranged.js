var rangedBuilder = {
    create: function(spawn) {
        var tiers = [{
            body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, MOVE]
        }, {
            body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE]
        }, {
            body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE]
        }];

        var body = null;
        _.forEach(tiers, function(tier) {
            if (spawn.canCreateCreep(tier.body, undefined, {
                    role: 'ranged'
                }) == OK) {
                body = tier.body;
            }
        });
        var name = spawn.createCreep(body, undefined, {
            role: 'ranged',
            home: spawn.room.name
        });
        if (name) console.log("Spawning Ranged Attacker, " + name);
    },
    run: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (target && creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        // else if (!target) {
        //     creep.moveTo(creep.room.controller);
        // }
    }
};

module.exports = rangedBuilder;
