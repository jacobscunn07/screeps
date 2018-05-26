class Harvester {
    constructor(creep) {
        this.creep = creep;
    }

    static create(spawn) {
        const body = [WORK, CARRY, MOVE];
        const memory = {
            role: 'harvester',
        };
        if (spawn.canCreateCreep(body, undefined, memory) == OK) {
            let name = spawn.createCreep(body, undefined, memory);
            console.log("Spawning Harvester: " + name);
        }
    }

    run() {
        if(this.fullLoad()) {
            this.depositEnergy();
        }
        else {
            this.mineEnergy();
        }
    }

    fullLoad() {
        return this.creep.carry.energy === this.creep.carryCapacity;
    }

    mineEnergy() {
        var source = this.creep.findClosestSourceToMe();
        this.creep.tryMineEnergySource(source);
    }

    depositEnergy() {
        var target = this.findAvailableSpawnOrExtension() || this.findAvailableContainer();
        this.creep.tryDepositEnergyIntoStructure(target);
    }

    findAvailableSpawnOrExtension() {
        return this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
            }
        });
    }

    findAvailableContainer() {
        return this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(c) {
                return c.structureType == STRUCTURE_CONTAINER && c.store.energy < c.storeCapacity;
            }
        });
    }
}

module.exports = Harvester;
