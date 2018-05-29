import ICreep from './ICreep';

class Harvester implements ICreep {

    private creep: any;

    constructor(creep: any) {
        this.creep = creep;
    }

    run() {
        if(this.isFull()) {
            this.depositEnergy();
        }
        else {
            this.mineEnergy();
        }
    }

    private isFull() {
        return this.creep.carry.energy === this.creep.carryCapacity;
    }

    private mineEnergy() {
        var source = Game.getObjectById(this.creep.memory.source);
        if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(source);
        }
    }

    private depositEnergy() {
        let target = this.findAvailableSpawnOrExtension() || this.findAvailableContainer();
        if (this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(target);
        }
    }

    private findAvailableSpawnOrExtension() {
        return this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure: any) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
            }
        });
    }

    private findAvailableContainer() {
        return this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (c: any) => {
                return c.structureType == STRUCTURE_CONTAINER && c.store.energy < c.storeCapacity;
            }
        });
    }
}

export default Harvester;
