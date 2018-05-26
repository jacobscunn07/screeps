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
        if (this.creep.memory.building && this.creep.carry.energy == 0) {
            this.creep.memory.building = false;
        }
        if (!this.creep.memory.building && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.building = true;
        }

        if (this.creep.memory.building) {
            var targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (this.creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(targets[0]);
                }
            }
        } else {
            var container = this.creep.findClosestContainerWithEnergyToMe();
            this.creep.tryGetEnergyFromContainer(container);

            if(!container) {
                var source = this.creep.findClosestSourceToMe();
                this.creep.tryMineEnergySource(source);
            }
        }
    }
}

module.exports = Builder;
