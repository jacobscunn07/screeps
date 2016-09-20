var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMiner = require('role.miner');
var helpers = require('global.helpers');

module.exports.loop = function () {
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

    if(upgraders.length < 2) {
        roleUpgrader.create();
    }

    if(builders.length < 1 && Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length > 0) {
        roleBuilder.create();
    }
    else if (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length == 0) {
        _.forEach(builders, function(builder) { builder.suicide(); });
    }

    var needsRepairCount = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: function(s){return s.hits < (s.hitsMax*.45)}}).length;
    if(Game.spawns['Spawn1'].canCreateCreep([WORK,CARRY,MOVE], undefined, {role: 'repairer'}) && needsRepairCount > 0 && repairers.length < 1) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'repairer'});
        console.log('Spawning new repairer: ' + newName);
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