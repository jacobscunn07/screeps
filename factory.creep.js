var Builder = require("class.builder");
var Miner = require("class.miner");
var Repairer = require("class.repairer");
var Transporter = require("class.transporter");
var Upgrader = require("class.upgrader");

var creepFactory = class CreepFactory {
    constructor() {
    }

    getCreepToRun(creep) {
      switch(creep.memory.role) {
        case "miner":
          return new Miner(creep);
          break;
        case "transporter":
          return new Transporter(creep);
          break;
        case "repairer":
          return new Repairer(creep);
          break;
        case "builder":
          return new Builder(creep);
          break;
      }
    }

    getCreepToCreate(spawn, room) {
      rcl = Game.rooms[room].level;
      miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.home == room);
      transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter' && creep.memory.home == room);
      harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.home == room);
      upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.home == room);
      repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.home == room);
      builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.home == room);
      containers = _.filter(Game.rooms[room].find(FIND_STRUCTURES), s => s.structureType == STRUCTURE_CONTAINER);
      storage = _.filter(Game.rooms[room].find(FIND_STRUCTURES), s => s.structureType == STRUCTURE_STORAGE);
      constructionSites = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
      energyStored = _.reduce(containers.concat(storage), function(sum, n) {
          return sum + n.store.energy;
      }, 0);
      structuresNeedingRepair = _.filter(Game.rooms[room].find(FIND_STRUCTURES), (s) => s.hits < s.hitsMax * .7);

      //Miner Strategy
      if (_.contains([1, 2], rcl) && miners.length < 2 * rcl) {
          //modify miner strategy to take what source to set as target source id
          return new Miner();
      } else if () /* else if each source does not have 5 work body parts && source has access point */ {
          return new Miner();
      }

      //Transporter Strategy
      if ((transporters.length + harvesters.length) < 2 && rcl >= 2 && containers.length > 0) {
          return new Transporter();
      } else if (energyStored >= 1250 && (energyStored / 1250) >= (transporters.length + harvesters.length) && (transporters.length + harvesters.length) <= 5) {
          return new Transporter();
      }

      //Upgrader Strategy
      if (upgraders.length < 2) {
          return new Upgrader();
      } else if (energyStored >= 1250 && (energyStore / 1250) >= upgraders.length && upgraders.length <= 5) {
          return new Upgrader();
      }

      //Builder Strategy
      if (constructionSites.length > 0 && (constructionSites.length / 10) >= builders.length) {
          //builders should repair structures if the structure they build needs repairing (ie ramparts && walls)
          return new Builder();
      }

      //Repairer Strategy
      if (structuresNeedingRepair > 0 && (structuresNeedingRepair / 10) >= repairers.length) {
          return new Repairer();
      }
    }
}

module.exports = creepFactory;
