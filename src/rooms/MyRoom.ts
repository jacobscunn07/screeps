import IRoom from './IRoom';
import CreepFactory from './../creeps/creepFactory/CreepFactory';
import Harvester from './../creeps/Harvester';
import Upgrader from './../creeps/Upgrader';
import Repairer from './../creeps/Repairer';
import NullCreep from './../creeps/NullCreep';
import Builder from 'creeps/Builder';

class MyRoom implements IRoom {

    private room: Room;

    constructor(room: Room) {
        this.room = room;
    }

    run() {
        this.createCreep();
        this.runCreeps();
    }

    private createCreep() {
        let cf = new CreepFactory(this.room);
        cf.create();
    }

    private runCreeps() {
        for(const name in Game.creeps) {
            var creep = this.getCreepRole(Game.creeps[name] as any);
            creep.run();
        }
    }

    private getCreepRole(creep: any) {
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
}

export default MyRoom;
