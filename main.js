var towerStructure = require('structure.tower');
var creepExtensions = require('extensions.creep');
var towerExtensions = require('extensions.tower');
var sourceExtensions = require('extensions.source');

var CreepFactory = require("factory.creep");
var Agitator = require("class.agitator");

module.exports.loop = function() {
    creepExtensions.register();
    towerExtensions.register();
    sourceExtensions.register();

    var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
    var creepFactory = new CreepFactory();

    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        var creep = creepFactory.getCreepToCreate(spawn, spawn.room.name);
        if(creep) creep.create(spawn, spawn.room.name);
    }

    for (var name in Game.creeps) {
        var creep = creepFactory.getCreepToRun(Game.creeps[name]);
        if(creep) {
            creep.run();
        }

        // if(hostileCreepsCount > 0) {
        //     var max = 3;
        //     var min = 1;
        //     var num = Math.floor(Math.random() * (max - min + 1)) + min;

        //     switch(num) {
        //         case 1:
        //             msg = "Ayuda me!";
        //             break;
        //         case 2:
        //             msg = "Help!";
        //             break;
        //         case 3:
        //             msg = "Invaders!"
        //             break;
        //     }

        //     if(Math.floor(Math.random()*10) % 3 == 0) {
        //         creep.say(msg, true);
        //     }
        // }
    }

    _.forEach(towers, function(tower) {
        towerStructure.run(tower);
    })
}
