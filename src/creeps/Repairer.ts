class Repairer extends Creep {
    memory:RepairerMemory;

    constructor(creep: Creep) {
        super(creep.id);
        this.memory = new RepairerMemory(creep.memory);
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
        return this.memory.repairing;
    }

    private updateMemory() {
        if (this.memory.repairing && this.carry.energy == 0) {
            this.memory.repairing = false;
            this.memory.structure = undefined;
        }
        if(!this.memory.repairing && this.carry.energy == 0) {
            this.memory.repairing = false;
            this.memory.structure = undefined;
        }
        if(!this.memory.repairing && this.carry.energy == this.carryCapacity) {
            this.memory.repairing = true;
            var structure = this.findStructureNeedingMostRepair();
            this.memory.structure = structure ? structure.id : undefined;
        }
        if(this.memory.repairing && this.memory.structure == null) {
            var structure = this.findStructureNeedingMostRepair();
            this.memory.structure = structure ? structure.id : undefined;
        }
    }

    private findStructureNeedingMostRepair() {
        var structureTypes = [STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_TOWER] as any;

        var structures = this.room.find(FIND_STRUCTURES, {
            filter: function(s: any) {
                return s.hits < (s.hitsMax * .7) && structureTypes.includes(s.structureType);
            }
        });
        return structures[0];
    }

    private repairStructure() {
        var structure = Game.getObjectById(this.memory.structure) as Structure;
        if(structure) {
            if (this.repair(structure) == ERR_NOT_IN_RANGE) {
                this.moveTo(structure);
            }
            if (structure.hits == structure.hitsMax) {
                this.memory.structure = undefined;
            }
        }
    }

    private getEnergy() {
        var container = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(c: any) {
                return c.structureType == STRUCTURE_CONTAINER && c.store.energy > 0;
            }
        });
        if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(container);
        }
    }

}

class RepairerMemory implements CreepMemory {
    role:string = "repairer";
    repairing:boolean = false;
    structure:string|undefined;

    constructor(memory: any) {
        this.repairing = memory.repairing;
        this.structure = memory.structure;
    }
}

export default Repairer;
