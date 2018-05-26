var globals = {
  run: function() {
    _.forEach(Game.rooms, function(room) {
      Game.memory.rooms[room.name] = {
        creeps: {
          harvesters: _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.home == room.name),
          upgraders: _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.home == room.name),
          builders: _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.home == room.name),
          repairers: _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.home == room.name),
          miners: _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.home == room.name),
          melees: _.filter(Game.creeps, (creep) => creep.memory.role == 'melee' && creep.memory.home == room.name),
          ranged: _.filter(Game.creeps, (creep) => creep.memory.role == 'ranged' && creep.memory.home == room.name),
          explorers: _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer' && creep.memory.home == room.name),
          claimers: _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.home == room.name),
          hostileCreeps: room.find(HOSTILE_CREEPS);
        },
        structures: {
          towers: _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER && structure.room.name == room.name),
          spawns: _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_SPAWN && structure.room.name == room.name),
          extensions: _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.room.name == room.name)
        }
      }
    });
  }
};
