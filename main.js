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


        if(name == "Spawn1" &&
            _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.home == 'W56S68').length < 1) {
                var n = roleHarvester.create(spawn, 'W56S68');
            }

        // if(name == "Spawn1" &&
        //     _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.home == 'W56S68').length < 2) {
        //         var n = roleUpgrader.create(spawn, 'W56S68');
        //     }



        if (spawn.room.name == 'W56S69') {
            if(melees.length < 0) {
              roleMelee.create(spawn, 'W56S67', 'W56S69')
            } else if (claimers.length < 0) {
                roleClaimer.create(spawn);
            } else if (miners.length < 4) {
                roleMiner.create(spawn);
            } else if (harvesters.length < 2) {
                roleHarvester.create(spawn);
            } else if (upgraders.length < 2) {
                roleUpgrader.create(spawn);
            } else if (builders.length < 2 && spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
                roleBuilder.create(spawn);
            } else if (repairers.length < 1 && needsRepairCount > 0) {
                roleRepairer.create(spawn);
            }
            // else if (_.filter(explorers, (creep) => creep.targetSourceId == '57ef9d0b86f108ae6e60d2c0').length < 2) {
            //     roleExplorer.create(spawn,'W56S68','W56S67','57ef9d0b86f108ae6e60d2c0');
            // } else if (_.filter(explorers, (creep) => creep.targetSourceId == '57ef9d0b86f108ae6e60d2c2').length < 2) {
            //     roleExplorer.create(spawn,'W56S68','W56S67','57ef9d0b86f108ae6e60d2c2');
            // }
        } else if (spawn.room.name == 'W56S68') {
            if (claimers.length < 0) {
                roleClaimer.create(spawn);
            }
            if (miners.length < 2) {
                roleMiner.create(spawn);
            } else if (harvesters.length < 3) {
                roleHarvester.create(spawn);
            } else if (upgraders.length < 2) {
                roleUpgrader.create(spawn);
            } else if (builders.length < 2 && spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
                roleBuilder.create(spawn);
            } else if (repairers.length < 2 && needsRepairCount > 0) {
                roleRepairer.create(spawn);
            } else if (explorers.length < 0) {
                roleExplorer.create(spawn);
            }
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
