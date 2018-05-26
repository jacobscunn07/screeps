var Harvester = require("harvester");
var Upgrader = require("upgrader");
var Repairer = require("repairer");
var Builder = require("builder");

class RoomController2Strategy {
    constructor(room) {
        this.room = room;
        var harvesters = _.map(this.getCreepsInRole("harvester", this.room.name), function(c) {
            return new Harvester(c);
        });
        var upgraders = _.map(this.getCreepsInRole("upgrader", this.room.name), function(c) {
            return new Upgrader(c);
        });
        var repairers =  _.map(this.getCreepsInRole("repairer", this.room.name), function(c) {
            return new Repairer(c);
        });
        var builders = _.map(this.getCreepsInRole("builder", this.room.name), function(c) {
            return new Builder(c);
        });

        this.creeps = {
            harvesters: harvesters,
            upgraders: upgraders,
            repairers:  repairers,
            builders: builders,
            all: harvesters.concat(upgraders.concat(builders))
        }
    }

    run() {
        this.createCreep();
        this.runCreeps();
    }

    getCreepsInRole(role, room) {
        return _.filter(Game.creeps, (creep) => {
            return creep.memory.role === role && creep.room.name === this.room.name;
        });
    }

    createCreep() {
        var spawn = Game.spawns["Spawn1"];
        if(this.creeps.harvesters.length < 4) {
            Harvester.create(spawn);
        }
        else if(this.creeps.upgraders.length < 2) {
            Upgrader.create(spawn);
        }
        // else if(this.creeps.repairers.length < 3) {
            // Repairer.create(spawn);
        // }
        else if(this.creeps.builders.length < 2) {
            // if(constructionSites > 0) {
                Builder.create(spawn);
            // }
        }
    }

    runCreeps() {
        this.creeps.all.forEach(function(creep) {
            creep.run();
        });
    }
}

module.exports = RoomController2Strategy;
