var HarvesterStrategy = require('role.harvester');
var MinerStrategy = require('role.miner');
var UpgraderStrategy = require('role.upgrader');
var BuilderStrategy = require('role.builder');
var RepairerStrategy = require('role.repairer');

var factory = {
    register: function() {
        class CreepFactory {
            constructor(spawn, room) {
                this.spawn = spawn;
                this.room = room;
                this.rcl = Game.rooms[room].level;
                this.miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.home == room);
                this.harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.home == room);
                this.upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.home == room);
                this.repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.home == room);
                this.builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.home == room);
                this.containers = _.filter(Game.rooms[room].find(FIND_STRUCTURES), s => s.structureType == STRUCTURE_CONTAINER);
                this.storage = _.filter(Game.rooms[room].find(FIND_STRUCTURES), s => s.structureType == STRUCTURE_STORAGE);
                this.constructionSites = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
                this.energyStored = _.reduce(containers.concat(storage), function(sum, n) {
                    return sum + n.store.energy;
                }, 0);
                this.structuresNeedingRepair = _.filter(Game.rooms[room].find(FIND_STRUCTURES), (s) => s.hits < s.hitsMax * .7);
            }

            getStrategy() {
              // Test this factory
              return new Miner(this.spawn, this.room);

                // //Miner Strategy
                // if (_.contains([1, 2], rcl) && miners.length < 2 * rcl) {
                //     //modify miner strategy to take what source to set as target source id
                //     return new Miner();
                // } else if () /* else if each source does not have 5 work body parts && source has access point */ {
                //     return new Miner();
                // }
                //
                // //Harvester Strategy
                // if (harvesters.length < 2 && rcl >= 2 && containers.length > 0) {
                //     return new Harvester();
                // } else if (energyStored >= 1250 && (energyStored / 1250) >= harvesters.length && harvesters.length <= 5) {
                //     return new Harvester();
                // }
                //
                // //Upgrader Strategy
                // if (upgraders.length < 2) {
                //     return new Upgrader();
                // } else if (energyStored >= 1250 && (energyStore / 1250) >= upgraders.length && upgraders.length <= 5) {
                //     return new Upgrader();
                // }
                //
                // //Builder Strategy
                // if (constructionSites.length > 0 && (constructionSites.length / 10) >= builders.length) {
                //     //builders should repair structures if the structure they build needs repairing (ie ramparts && walls)
                //     return new Builder();
                // }
                //
                // //Repairer Strategy
                // if (structuresNeedingRepair > 0 && (structuresNeedingRepair / 10) >= repairers.length) {
                //     return new Repairer();
                // }
            }
        }
    }
};

module.exports = factory;
