import TransporterMemory from './TransporterMemory';

class Transporter extends Creep {
    memory:TransporterMemory;

    constructor(creep: Creep) {
        super(creep.id);
        this.memory = new TransporterMemory(creep.memory);
    }

    isTransporting() {
        return this.carry.energy === this.carryCapacity;
    }

    depositEnergy(target:StructureSpawn|StructureExtension|StructureContainer|StructureStorage) {
        if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }

    getEnergy(container:StructureContainer) {
        if(this.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(container);
        }
    }
}



export default Transporter;
