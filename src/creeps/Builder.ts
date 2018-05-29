import ICreep from './ICreep';

class Builder implements ICreep {

    private creep: any;

    constructor(creep: any) {
        this.creep = creep;
    }

    run() {
        this.updateMemory();
        if(this.isBuilding()) {
            this.buildStructure();
        }
        else {
            this.getEnergy();
        }
    }

    private updateMemory() {
        if (this.creep.memory.building && this.creep.carry.energy == 0) {
            this.creep.memory.building = false;
        }
        if (!this.creep.memory.building && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.building = true;
        }
    }

    private isBuilding() {
        return this.creep.memory.building;
    }

    private buildStructure() {
        var structures = this.creep.room.find(FIND_CONSTRUCTION_SITES);
        if (structures.length) {
            var structure = _.first(structures);
            if (this.creep.build(structure) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(structure);
            }
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

export default Builder;
