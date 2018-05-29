import ICreepFactory from './ICreepFactory';
import Harvester from './../Harvester';
import Upgrader from './../Upgrader';
import Repairer from './../Repairer';
import Builder from './../Builder';

class CreepFactory implements ICreepFactory {

    private room: Room;

    constructor(room: Room) {
        this.room = room;
    }

    create() {
        let spawn = Game.spawns["Spawn1"];
        let harvesters = this.getCreepsInRole("harvester").length;
        let upgraders = this.getCreepsInRole("upgrader").length;
        let repairers = this.getCreepsInRole("repairer").length;
        let builders = this.getCreepsInRole("builder").length;
        if(harvesters < 4) {
            let source = this.getSourceForHarvester();
            if(source) {
                const body = [WORK, CARRY, MOVE, MOVE];
                const name = "Harvester-"+Game.time;
                const memory = {
                    role: "harvester",
                    source: source.id,
                    dryRun: true
                };
                if (spawn.spawnCreep(body, name, memory) == OK) {
                    memory.dryRun = false;
                    let creepName = spawn.createCreep(body, name, memory);
                    console.log("Spawning Harvester: " + creepName);
                }
            }
        }
        else if(upgraders < 3) {
            const body = [WORK, CARRY, MOVE, MOVE];
            const name = "Upgrader-"+Game.time;
            const memory = {
                role: "upgrader",
                upgrading: false,
                dryRun: true
            };
            if (spawn.spawnCreep(body, name, memory) == OK) {
                memory.dryRun = false;
                let creepName = spawn.createCreep(body, name, memory);
                console.log("Spawning Upgrader: " + creepName);
            }
        }
        else if(builders < 1) {
            const body = [WORK, CARRY, MOVE, MOVE];
            const name = "Builder-"+Game.time;
            let memory = {
                role: "builder",
                building: false,
                dryRun: true
            };
            if (spawn.spawnCreep(body, name, memory) == OK) {
                memory.dryRun = false;
                let creepName = spawn.createCreep(body, name, memory);
                console.log("Spawning Builder: " + creepName);
            }
        }
        else if (repairers < 2) {
            const body = [WORK, CARRY, MOVE, MOVE];
            const name = "Repairer-"+Game.time;
            let memory = {
                role: "repairer",
                repairing: false,
                structure: null,
                dryRun: true
            };
            if (spawn.spawnCreep(body, name, memory) == OK) {
                memory.dryRun = false;
                let creepName = spawn.createCreep(body, name, memory);
                console.log("Spawning Repairer: " + creepName);
            }
        }
    }

    private getCreepsInRole(role: string) {
        // return (Game.creeps as any).filter((c: any) => c.memory.role === role);
        return _.filter(Game.creeps, (c: any) => {
            return c.memory.role === role
        });
    }

    private getSourceForHarvester() {
        var sources = this.room.find(FIND_SOURCES);;
        var sourcesMetaData = [] as any;
        sources.forEach((source: any) => {
            let openSpots = this.findAvailableMiningSpots(source).length;
            let takenSpots = _.filter(Game.creeps, (creep: any) => {
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
            sourcesMetaData.sort((source1: any, source2: any) => source1.takenSpots - source2.takenSpots);
        // console.log(JSON.stringify(leastAmountOfMinersFirst));
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

export default CreepFactory;
