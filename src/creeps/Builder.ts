class Builder extends Creep {
    memory:BuilderMemory;

    constructor(creep: Creep) {
        super(creep.id);
        this.memory = new BuilderMemory(creep.memory);
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
        if (this.memory.building && this.carry.energy == 0) {
            this.memory.building = false;
        }
        if (!this.memory.building && this.carry.energy == this.carryCapacity) {
            this.memory.building = true;
        }
    }

    private isBuilding() {
        return this.memory.building;
    }

    private buildStructure() {
        var structures = this.room.find(FIND_CONSTRUCTION_SITES);
        if (structures.length) {
            var structure = _.first(structures);
            if (this.build(structure) == ERR_NOT_IN_RANGE) {
                this.moveTo(structure);
            }
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

class BuilderMemory implements CreepMemory {
    role:string = "builder";
    building:boolean = false;

    constructor(memory: any) {
        this.building = memory.building;
    }
}

export default Builder;
