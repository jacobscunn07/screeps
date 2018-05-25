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
        // console.log("Harvester " + this.creep.name + " running...")
        if(this._fullLoad()) {
            this._dumpEnergySomewhere();
        }
        else {
            this._mineEnergy();
        }
    }

    _fullLoad() {
        return this.creep.carry.energy === this.creep.carryCapacity;
    }

    _mineEnergy() {
        var source = this._findClosestEnergySource();
        if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(source);
        }
    }

    _dumpEnergySomewhere() {
        var target = this._findAvailableSpawnOrExtension() || this._findAvailableContainer();

        if (target && this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(target);
        }
    }

    _findClosestEnergySource() {
        return this.creep.pos.findClosestByPath(FIND_SOURCES);
    }

    _findAvailableSpawnOrExtension() {
        return this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
            }
        });
    }

    _findAvailableContainer() {
        return this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(c) {
                return c.structureType == STRUCTURE_CONTAINER && c.store.energy < c.storeCapacity;
            }
        });
    }
}

module.exports = Harvester;
