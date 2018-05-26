class Upgrader {
    constructor(creep) {
        this.creep = creep;
    }

    static create(spawn) {
        const body = [WORK, CARRY, MOVE, MOVE];
        const memory = {
            role: 'upgrader',
            upgrading: false,
        };
        if (spawn.canCreateCreep(body, undefined, memory) == OK) {
            let name = spawn.createCreep(body, undefined, memory);
            console.log("Spawning Upgrader: " + name);
        }
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

    updateMemory() {
        if (this.creep.memory.upgrading && this.creep.carry.energy == 0) {
            this.creep.memory.upgrading = false;
        }

        if (!this.creep.memory.upgrading && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.upgrading = true;
        }
    }

    isUpgrading() {
        return this.creep.memory.upgrading;
    }

    upgradeController() {
        if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(this.creep.room.controller);
        }
    }

    getEnergy() {
        var container = this.creep.findClosestContainerWithEnergyToMe();
        if(container) {
            console.log(this.creep.name);
            this.creep.tryGetEnergyFromContainer(container);
        }
        else {
            var source = this.creep.findClosestSourceToMe();
            this.creep.tryMineEnergySource(source);
        }
    }
}

module.exports = Upgrader;
