class Builder {
    constructor(creep) {
        this.creep = creep;
    }

    static create(spawn) {
        const body = [WORK, CARRY, MOVE, MOVE];
        const memory = {
            role: 'builder',
            building: false,
        };
        if (spawn.canCreateCreep(body, undefined, memory) == OK) {
            let name = spawn.createCreep(body, undefined, memory);
            console.log("Spawning Builder: " + name);
        }
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

    updateMemory() {
        if (this.creep.memory.building && this.creep.carry.energy == 0) {
            this.creep.memory.building = false;
        }
        if (!this.creep.memory.building && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.building = true;
        }
    }

    isBuilding() {
        return this.creep.memory.building;
    }

    buildStructure() {
        var structures = this.creep.room.find(FIND_CONSTRUCTION_SITES);
        if (structures.length) {
            var structure = _.first(structures);
            if (this.creep.build(structure) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(structure);
            }
        }
    }

    getEnergy() {
        var container = this.creep.findClosestContainerWithEnergyToMe();
        if(container) {
            this.creep.tryGetEnergyFromContainer(container);
        }
        else {
            var source = this.creep.findClosestSourceToMe();
            this.creep.tryMineEnergySource(source);
        }
    }
}

module.exports = Builder;
