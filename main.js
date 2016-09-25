var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMiner = require('role.miner');
var towerStructure = require('structure.tower');
var helpers = require('global.helpers');
var creepExtensions = require('creep.extensions');
var towerExtensions = require('tower.extensions');

module.exports.loop = function() {
    creepExtensions.register();
    towerExtensions.register();

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);

    if (upgraders.length < 6) {
        roleUpgrader.create();
    }

    if (builders.length < 3 && Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length > 0) {
        roleBuilder.create();
    } else if (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length == 0) {
        _.forEach(builders, function(builder) {
            builder.suicide();
        });
    }

    var needsRepairCount = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
        filter: function(s) {
            return s.hits < (s.hitsMax * .7)
        }
    }).length;
    if (repairers.length < 2 && needsRepairCount > 0) {
        roleRepairer.create();
    } else if (needsRepairCount == 0) {
        _.forEach(repairers, function(repairer) {
            repairer.suicide();
        });
    }

    if (harvesters.length < 2) {
        roleHarvester.create();
    }

    if (miners.length < 2) {
        roleMiner.create();
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
    }

    _.forEach(towers, function(tower) {
      towerStructure.run(tower);
    })
}
