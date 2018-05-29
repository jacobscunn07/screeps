import ICreep from './ICreep';

class Repairer implements ICreep {

    private creep: any;

    constructor(creep: any) {
        this.creep = creep;
    }

    run() {
        this.updateMemory();
        if(this.isRepairing()) {
            this.repairStructure();
        }
        else {
            this.getEnergy();
        }
    }

    private isRepairing() {
        return this.creep.memory.repairing;
    }

    private updateMemory() {
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
            var structure = this.findStructureNeedingMostRepair();
            this.creep.memory.structure = structure ? structure.id : null;
        }
        if(this.creep.memory.repairing && this.creep.memory.structure == null) {
            var structure = this.findStructureNeedingMostRepair();
            this.creep.memory.structure = structure ? structure.id : null;
        }
    }

    private findStructureNeedingMostRepair() {
        var structureTypes = [STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_TOWER] as any;

        var structures = this.creep.room.find(FIND_STRUCTURES, {
            filter: function(s: any) {
                return s.hits < (s.hitsMax * .7) && structureTypes.includes(s.structureType);
            }
        });
        return structures[0];
    }

    private repairStructure() {
        var structure = Game.getObjectById(this.creep.memory.structure) as Structure;
        if(structure) {
            if (this.creep.repair(structure) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(structure);
            }
            if (structure.hits == structure.hitsMax) {
                this.creep.memory.structure = null;
            }
        }
    }

    private getEnergy() {
        var container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(c: any) {
                return c.structureType == STRUCTURE_CONTAINER && c.store.energy > 0;
            }
        });
        if (this.creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(container);
        }
    }
}

export default Repairer;
