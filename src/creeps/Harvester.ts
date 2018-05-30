class Harvester extends Creep {
    memory:HarvesterMemory;

    constructor(creep: Creep) {
        super(creep.id);
        this.memory = new HarvesterMemory(creep.memory);
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
        return this.carry.energy === this.carryCapacity;
    }

    private mineEnergy() {
        var source = <Source>Game.getObjectById(this.memory.source);
        if (this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source);
        }
    }

    private depositEnergy() {
        let target = this.findAvailableSpawnOrExtension() || this.findAvailableContainer();
        if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }

    private findAvailableSpawnOrExtension() {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure: any) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
            }
        });
    }

    private findAvailableContainer() {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (c: any) => {
                return c.structureType == STRUCTURE_CONTAINER && c.store.energy < c.storeCapacity;
            }
        });
    }
}

class HarvesterMemory implements CreepMemory {
    role:string = "harvester";
    source:string|undefined = undefined;

    constructor(memory: any) {
        this.source = memory.source;
    }
}

export default Harvester;
