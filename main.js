var Bootstrapper = require("bootstrapper");
var Harvester = require("harvester");
var Upgrader = require("upgrader");
var Repairer = require("repairer");
var Builder = require("builder");

module.exports.loop = () =>
{
    Bootstrapper.bootstrap();
    var spawn = Game.spawns["Spawn1"];
    // console.log(spawn);
    // console.log(JSON.stringify(Harvester));
    // Harvester.create(spawn);
    // Upgrader.create(spawn);
    // Repairer.create(spawn);
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length;
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
    // var constructionSites = Game.rooms["W1S57"].find(FIND_CONSTRUCTION_SITES).length;
    // console.log(builders + " builders");
    // console.log(constructionSites + " construction sites");

    if(harvesters < 4) {
        Harvester.create(spawn);
    }
    else if(upgraders < 2) {
        Upgrader.create(spawn);
    }
    // else if(repairers < 3) {
        // Repairer.create(spawn);
    // }
    else if(builders < 2) {
        // if(constructionSites > 0) {
            Builder.create(spawn);
        // }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == "harvester") {
            var harvester = new Harvester(creep);
            harvester.run();
        }
        if(creep.memory.role == "upgrader") {
            var upgrader = new Upgrader(creep);
            upgrader.run();
        }
        if(creep.memory.role == "repairer") {
            var repairer = new Repairer(creep);
            // repairer.run();
        }
        if(creep.memory.role == "builder") {
            var builder = new Builder(creep);
            builder.run();
        }
    }
}
