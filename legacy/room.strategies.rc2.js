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
            all: harvesters.concat(upgraders.concat(builders.concat(repairers)))
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
        var source = this.getSourceForHarvester();
        if(source && this.creeps.harvesters.length < 4) {
            Harvester.create(spawn, source);
        }
        else if(this.creeps.upgraders.length < 2) {
            Upgrader.create(spawn);
        }
        else if(this.creeps.repairers.length < 4) {
            Repairer.create(spawn);
        }
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

    getSourceForHarvester() {
        var sources = this.room.sources(); 
        var sourcesMetaData = []; 
        sources.forEach((source) => {
            let openSpots = source.findAvailableMiningSpots().length;
            let takenSpots = _.filter(Game.creeps, creep => { 
                return creep.room.name === this.room.name && 
                    creep.memory.role === "harvester" && 
                    creep.memory.source === source.id 
            }).length;
            if(openSpots > takenSpots) {
                sourcesMetaData.push({ 
                    source: source, 
                    openSpots: openSpots, 
                    takenSpots: takenSpots
                }); 
            }
        });
        var leastAmountOfMinersFirst =  
            sourcesMetaData.sort((source1, source2) => source1.takenSpots - source2.takenSpots);
        // console.log(JSON.stringify(leastAmountOfMinersFirst));
        return leastAmountOfMinersFirst[0] ? leastAmountOfMinersFirst[0].source : null; 
    }
}

module.exports = RoomController2Strategy;
