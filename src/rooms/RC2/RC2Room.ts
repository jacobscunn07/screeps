import IRoom from './../IRoom';
import CreepFactory from './../../creeps/creepFactory/CreepFactory';
import Harvester from './../../creeps/Harvester';
import Upgrader from './../../creeps/Upgrader';
import Repairer from './../../creeps/Repairer';
import NullCreep from './../../creeps/NullCreep';
import Builder from './../../creeps/Builder';
import Queue from './Queue';
import CreepRole from './../../creeps/constants';
import HarvesterMother from './../../creeps/HarvesterMother';
import UpgraderMother from './../../creeps/UpgraderMother';
import BuilderMother from './../../creeps/BuilderMother';
import RepairerMother from './../../creeps/RepairerMother';

import BaseRoom from './../BaseRoom';

class RC2Room extends BaseRoom {
    private stats: any;

    constructor(room: Room) {
        super(room.name);
        this.stats = {
            sources: this.find(FIND_SOURCES),
            creeps: {
                harvesters: _.filter(Game.creeps, (c: any) => c.room.name === this.name && c.memory.role === 'harvester'),
                upgraders: _.filter(Game.creeps, (c: any) => c.room.name === this.name && c.memory.role === 'upgrader'),
                builders: _.filter(Game.creeps, (c: any) => c.room.name === this.name && c.memory.role === 'builder'),
                repairers: _.filter(Game.creeps, (c: any) => c.room.name === this.name && c.memory.role === 'repairer'),
            },
            strucutures: {
                constructionSites: null,
                buildings: null,
            }
        }

        // console.log(JSON.stringify(this.getHarvesterContainers().length));
        // for(var name in this.harvesterContainers) {
        //     console.log(name);
        //     console.log(JSON.stringify(this.harvesterContainers[name]));
        // }
    }

    run() {
        this.createCreep();
        this.runCreeps();
    }

    private createCreep() {
        if(this.stats.creeps.harvesters.length < 1) {
            let spawn = Game.spawns["Spawn1"];
            let source = this.getSourceForHarvester();
            if(source) {
                HarvesterMother.create(spawn, source);
            }
        }
        else if(this.stats.creeps.upgraders.length < 1) {
            let spawn = Game.spawns["Spawn1"];
            UpgraderMother.create(spawn);
        }
        else if(this.stats.creeps.builders.length < 1) {
            let spawn = Game.spawns["Spawn1"];
            BuilderMother.create(spawn);
        }
        else if(this.stats.creeps.repairers.length < 1) {
            let spawn = Game.spawns["Spawn1"];
            RepairerMother.create(spawn);
        }
        else if(this.stats.creeps.harvesters.length < 4) {
            let spawn = Game.spawns["Spawn1"];
            let source = this.getSourceForHarvester();
            if(source) {
                HarvesterMother.create(spawn, source);
            }
        }
        else if(this.stats.creeps.upgraders.length < 2) {
            let spawn = Game.spawns["Spawn1"];
            UpgraderMother.create(spawn);
        }
        else if(this.stats.creeps.builders.length < 2) {
            let spawn = Game.spawns["Spawn1"];
            BuilderMother.create(spawn);
        }
        else if(this.stats.creeps.repairers.length < 2) {
            let spawn = Game.spawns["Spawn1"];
            RepairerMother.create(spawn);
        }
    }

    private runCreeps() {
        for(const name in Game.creeps) {
            var creep = this.getCreepRole(Game.creeps[name]);
            creep.run();
        }
    }

    private getCreepRole(creep: Creep) {
        switch(creep.memory.role) {
            case "harvester":
                return new Harvester(creep);
            case "upgrader":
                return new Upgrader(creep);
            case "repairer":
                return new Repairer(creep);
            case "builder":
                return new Builder(creep);
            default:
                return new NullCreep(creep);
        }
    }

    private getSourceForHarvester() {
        var sources = this.find(FIND_SOURCES);
        var sourcesMetaData = [] as any;
        sources.forEach((source: Source) => {
            let openSpots = this.findAvailableMiningSpots(source).length;
            let takenSpots = _.filter(Game.creeps, (creep: any) => {
                return creep.room.name === this.name &&
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
            sourcesMetaData.sort((source1: any, source2: any) => source1.takenSpots - source2.takenSpots);
        return leastAmountOfMinersFirst[0] ? leastAmountOfMinersFirst[0].source : null;
    }

    private findAvailableMiningSpots = function(source: Source) {
        var name = source.room.name;
        var x = source.pos.x - 1;
        var y = source.pos.y - 1;
        var availableRoomPositions = [];

        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                var pos = new RoomPosition(x, y, name);
                var objects = pos.look();
                var isBlocked = _.some(objects, (object => (OBSTACLE_OBJECT_TYPES as any).includes(object.terrain)));
                if(!isBlocked) {
                    availableRoomPositions.push(pos);
                }
                x++;
            }
            x = source.pos.x - 1;
            y++;
        }
        return availableRoomPositions;
    }
}

export default RC2Room;
