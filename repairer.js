class Repairer {
    constructor(creep) {
        this.creep = creep;
    }

    static create(spawn) {
        const body = [WORK, CARRY, MOVE, MOVE];
        const memory = {
            role: 'repairer',
            repairing: false,
            structure: null,
        };
        if (spawn.canCreateCreep(body, undefined, memory) == OK) {
            let name = spawn.createCreep(body, undefined, memory);
            console.log("Spawning Repairer: " + name);
        }
    }

    run() {
        this._updateMemory();
        if(this.creep.memory.repairing) {
            this._repairStructure();
        }
        else {
            this._getEnergyForRepair();
        }
    }

    _findStructureNeedingMostRepair() {
        var structureTypes = [STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_TOWER];

        var structures = this.creep.room.find(FIND_STRUCTURES, {
            filter: function(s) {
                return s.hits < (s.hitsMax * .7) && structureTypes.includes(s.structureType);
            }
        });
        return structures[0];
    }

    _updateMemory() {
        if (this.creep.memory.repairing && this.creep.carry.energy == 0) {
            this.creep.memory.repairing = false;
            this.creep.memory.structure = null;
        }
        if(!this.creep.memory.repairing && this.creep.carry.energy == 0) {
            this.creep.memory.repairing = false;
            this.creep.memory.structure = null;
        }
        if(!this.creep.memory.repairing && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.repairing = true;
            this.creep.memory.structure = this._findStructureNeedingMostRepair().id;
        }
        if(this.creep.memory.repairing && this.creep.memory.structure == null) {
            this.creep.memory.structure = this._findStructureNeedingMostRepair().id;
        }
    }

    _repairStructure() {
        var structure = Game.getObjectById(this.creep.memory.structure);
        if (this.creep.repair(structure) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(structure);
        }
        if (structure.hits == structure.hitsMax) {
            this.creep.memory.structure = null;
        }
    }

    _getEnergyForRepair() {
        var target = this.creep.findClosestContainerWithEnergyToMe();
        if (this.creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(target);
        }
    }
}

module.exports = Repairer;
