var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMiner = require('role.miner');
var roleMelee = require('role.melee');
var roleRanged = require('role.ranged');
var roleExplorer = require('role.explorer');
var roleClaimer = require('role.claimer');
var towerStructure = require('structure.tower');
var helpers = require('global.helpers');
var creepExtensions = require('extensions.creep');
var towerExtensions = require('extensions.tower');
var sourceExtensions = require('extensions.source');

module.exports.loop = function() {
    creepExtensions.register();
    towerExtensions.register();
    sourceExtensions.register();

    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.home == spawn.room.name);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.home == spawn.room.name);
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.home == spawn.room.name);
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.home == spawn.room.name);
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.home == spawn.room.name);
        var melees = _.filter(Game.creeps, (creep) => creep.memory.role == 'melee' && creep.memory.home == spawn.room.name);
        var ranged = _.filter(Game.creeps, (creep) => creep.memory.role == 'ranged' && creep.memory.home == spawn.room.name);
        var explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer' && creep.memory.home == spawn.room.name);
        var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.home == spawn.room.name);
        var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
        var needsRepairCount = spawn.room.find(FIND_STRUCTURES, {
            filter: function(s) {
                return s.hits < (s.hitsMax * .7);
            }
        }).length;
        var hostileCreepsCount = spawn.room.find(FIND_HOSTILE_CREEPS).length;

            if (miners.length < 1) {
                roleMiner.create(spawn);
            } else if (harvesters.length < 0) {
                roleHarvester.create(spawn);
            } else if (upgraders.length < 2) {
                roleUpgrader.create(spawn);
            } else if (builders.length < 2 && spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
                roleBuilder.create(spawn);
            } else if (repairers.length < 1 && needsRepairCount > 0) {
                roleRepairer.create(spawn);
            }

        if (needsRepairCount == 0) {
            _.forEach(repairers, function(repairer) {
                repairer.suicide();
            });
        }

        if (spawn.room.find(FIND_CONSTRUCTION_SITES).length == 0) {
            _.forEach(builders, function(builder) {
                builder.suicide();
            });
        }
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
        if (creep.memory.role == 'melee') {
            roleMelee.run(creep);
        }
        if (creep.memory.role == 'ranged') {
            roleRanged.run(creep);
        }
        if (creep.memory.role == 'explorer') {
            roleExplorer.run(creep);
        }
        if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
    }

    _.forEach(towers, function(tower) {
        towerStructure.run(tower);
    })
}
