// import TransporterMemory from './TransporterMemory';

// class Transporter extends Creep {
//     memory:TransporterMemory;

//     constructor(creep: Creep) {
//         super(creep.id);
//         this.memory = new TransporterMemory(creep.memory);
//     }

//     run() {
//         this.updateMemory();
//         if(this.isTransporting()) {
//             this.depositEnergyIntoSpawnOrStorage();
//         }
//         else {
//             this.getEnergyFromContainerNearSource();
//         }
//     }

//     private updateMemory() {

//     }

//     private isTransporting() {
//         return this.carry.energy === this.carryCapacity;
//     }

//     private depositEnergyIntoSpawnOrStorage() {
//         let target = this.getClosestSpawnOrExtension() || this.getClosestStorage();

//         if(target) {
//             if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//                 this.moveTo(target);
//             }
//         }
//     }

//     private getClosestSpawnOrExtension() {
//         return this.pos.findClosestByPath(FIND_STRUCTURES, {
//             filter: (structure: any) => {
//                 return (structure.structureType == STRUCTURE_EXTENSION ||
//                     structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
//             }
//         });
//     }

//     private getClosestStorage() {
//         return this.pos.findClosestByPath(FIND_STRUCTURES, {
//             filter: (c: any) => {
//                 return c.structureType == STRUCTURE_CONTAINER && c.store.energy < c.storeCapacity;
//             }
//         });
//     }
// }



// export default Transporter;
