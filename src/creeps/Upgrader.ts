import ICreep from './ICreep';

class Upgrader implements ICreep {

    private creep: any;

    constructor(creep: any) {
        this.creep = creep;
    }

    run() {
        this.updateMemory();
        if(this.isUpgrading()) {
            this.upgradeController();
        }
        else {
            this.getEnergy();
        }
    }

    private updateMemory() {
        if (this.creep.memory.upgrading && this.creep.carry.energy == 0) {
            this.creep.memory.upgrading = false;
        }

        if (!this.creep.memory.upgrading && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.upgrading = true;
        }
    }

    private isUpgrading() {
        return this.creep.memory.upgrading;
    }

    private upgradeController() {
        if(this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
            this.creep.moveTo(this.creep.room.controller);
        }
    }

    private getEnergy() {
        let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s: any) => s.structureType === STRUCTURE_CONTAINER && s.store.energy > 0,
        });
        let source = this.creep.pos.findClosestByPath(FIND_SOURCES);
        if(this.creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.creep.moveTo(container);
        }
        else if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(source);
        }
    }
}

export default Upgrader;
