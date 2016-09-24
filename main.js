var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMiner = require('role.miner');
var helpers = require('global.helpers');

module.exports.loop = function () {
    Creep.prototype.sayHi = function(){this.say("hi")};

    Creep.prototype.findClosestSpawn = function() {
        return this.pos.findClosestByPath(FIND_MY_SPAWNS);
    };

    Creep.prototype.findClosestPlaceToDumpEnergy = function() {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
    };

    Creep.prototype.getStorage = function() {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE && structure.store.energy < structure.storeCapacity);
            }
        });
    };

    Creep.prototype.findClosestContainerThatIsNotFull = function() {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(c) {
                return c.structureType == STRUCTURE_CONTAINER && c.store.energy < c.storeCapacity;
            }
        });
    };

    Creep.prototype.findClosestContainerWithEnergy = function() {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(c) {
                return c.structureType == STRUCTURE_CONTAINER  && c.store.energy > 0;
            }
        });
    };

    Creep.prototype.findSources = function() {
          return this.room.find(FIND_SOURCES);
    };

    Creep.prototype.findClosestSource = function() {
        return this.pos.findClosestByPath(FIND_SOURCES);
    };

    Creep.prototype.findClosestStructureNeedingRepair = function() {
        return this.pos.findClosestByPath(FIND_STRUCTURES, {filter: function(s) {return s.hits < (s.hitsMax*.7)}});
    };

    Creep.prototype.findClosestConstructionSite = function() {
        return this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    };

    Creep.prototype.placeRoadUnderMe = function() {
      return this.pos.createConstructionSite(STRUCTURE_ROAD);
    };


    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');

    if(miners.length < 2) {
        roleMiner.create();
    }

    if(harvesters.length < 2) {
        roleHarvester.create();
    }

    if(upgraders.length < 6) {
        roleUpgrader.create();
    }

    if(builders.length < 3 && Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length > 0) {
        roleBuilder.create();
    }
    else if (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length == 0) {
        _.forEach(builders, function(builder) { builder.suicide(); });
    }

    var needsRepairCount = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: function(s){return s.hits < (s.hitsMax*.7)}}).length;
    if(repairers.length < 2 && needsRepairCount > 0){
        roleRepairer.create();
    }
    else if (needsRepairCount == 0) {
        _.forEach(repairers, function(repairer){ repairer.suicide(); });
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
    }
}
