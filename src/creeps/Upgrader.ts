class Upgrader extends Creep {
    memory:UpgraderMemory;

    constructor(creep: Creep) {
        super(creep.id);
        this.memory = new UpgraderMemory(creep.memory);
    }

    run() {
        this.updateMemory();
        if(this.isUpgrading()) {
            this.upgradeTheController();
        }
        else {
            this.getEnergy();
        }
    }

    private updateMemory() {
        if (this.memory.upgrading && this.carry.energy == 0) {
            this.memory.upgrading = false;
        }

        if (!this.memory.upgrading && this.carry.energy == this.carryCapacity) {
            this.memory.upgrading = true;
        }
    }

    private isUpgrading() {
        return this.memory.upgrading;
    }

    private upgradeTheController() {
        if(this.upgradeController(<StructureController>this.room.controller) === ERR_NOT_IN_RANGE) {
            this.moveTo((this.room.controller as StructureController).pos);
        }
    }

    private getEnergy() {
        let container = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s: any) => s.structureType === STRUCTURE_CONTAINER && s.store.energy > 0,
        });
        let source = this.pos.findClosestByPath(FIND_SOURCES);
        if(this.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(container);
        }
        else if (this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source);
        }
    }
}

class UpgraderMemory implements CreepMemory {
    role:string = "upgrader";
    upgrading:boolean = false;

    constructor(memory: any) {
        this.upgrading = memory.upgrading;
    }
}

export default Upgrader;
