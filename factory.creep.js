var Builder = require("class.builder");
var Miner = require("class.miner");
var Repairer = require("class.repairer");
var Transporter = require("class.transporter");
var Upgrader = require("class.upgrader");
var Agitator = require("class.agitator");

var creepFactory = class CreepFactory {
    constructor() {
    }

    getCreepToRun(creep) {
      switch(creep.memory.role) {
        case "miner":
          return new Miner(creep);
          break;
        case "harvester":
        case "transporter":
          return new Transporter(creep);
          break;
        case "repairer":
          return new Repairer(creep);
          break;
        case "builder":
          return new Builder(creep);
          break;
        case "upgrader":
          return new Upgrader(creep);
          break;
        case "agitator":
          return new Agitator({creep: creep, home: creep.memory.home, destination: creep.memory.destination});
          break;
      }
    }

    getCreepToCreate(spawn, room) {
      var rcl = Game.rooms[room].controller.level;
      var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.home == room);
      var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter' && creep.memory.home == room);
      var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.home == room);
      var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.home == room);
      var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.home == room);
      var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.home == room);
      var agitators = _.filter(Game.creeps, (creep) => creep.memory.role == 'agitator' && creep.memory.home == room);
      var containers = _.filter(Game.rooms[room].find(FIND_STRUCTURES), s => s.structureType == STRUCTURE_CONTAINER);
      var storage = _.filter(Game.rooms[room].find(FIND_STRUCTURES), s => s.structureType == STRUCTURE_STORAGE);
      var constructionSites = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
      var energyStored = _.reduce(containers.concat(storage), function(sum, n) {
          return sum + n.store.energy;
      }, 0);
      var structuresNeedingRepair = _.filter(Game.rooms[room].find(FIND_STRUCTURES), (s) => s.hits < s.hitsMax * .7 && s.hits < 100000);

      var sources = [];
      _.forEach(Game.rooms[room].find(FIND_SOURCES), function(source) {
          var srcMiners = _.filter(miners, (m) => m.memory.targetSourceId == source.id);
          var workCount = _.reduce(srcMiners, function(sum, creep) {
            return sum + creep.getActiveBodyparts(WORK);
          }, 0);
        var accessPoints = sourceAccessPoints(source);

        if(workCount < 5 && accessPoints > 0) {
          sources.push(source);
        }
      });

    //   var extractor = _.first(Game.rooms[room].find(FIND_MY_STRUCTURES, { filter: function(s) { return s.structureType == STRUCTURE_EXTRACTOR }}));
    //   if(extractor) {
    //       var extMiners = _.filter(miners, (m) => m.memory.targetSourceId == extractor.id);
    //       var workCount =  _.reduce(extMiners, function(sum, creep) {
    //         return sum + creep.getActiveBodyparts(WORK);
    //       }, 0);
    //       var extAccessPoints = sourceAccessPoints(extractor);

    //       if(workCount < 5 && extAccessPoints > 0) {
    //           sources.push(extractor);
    //       }
    //   }

      //Miner Strategy
      var src = _.first(sources);
      if (_.contains([1, 2], rcl) && miners.length < 2 * rcl) {
          return new Miner(null, src);
      } else if(rcl > 2 && src) {
          return new Miner(null, src);
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
      } else if (energyStored >= 1250 && (energyStored / 200000) >= upgraders.length && upgraders.length < 5) {
          return new Upgrader();
      }

      //Builder Strategy
      if (constructionSites.length > 0 && Math.ceil(constructionSites.length / 30) >= builders.length) {
          //builders should repair structures if the structure they build needs repairing (ie ramparts && walls)
          return new Builder();
      }

      //Repairer Strategy
      if (structuresNeedingRepair.length > 0 && Math.ceil(structuresNeedingRepair.length / 40) >= repairers.length) {
          return new Repairer();
      }
      
      for(var name in Game.flags) {
        var flag = Game.flags[name];
        switch(flag.color) {
          case 6: // Yellow
            if(_.filter(agitators, (creep) => creep.memory.destination == flag.pos.roomName).length < 2)
              return new Agitator({home: 'W67S58', destination: flag.pos.roomName});
          break;
        }
      }
    }
};

var sourceAccessPoints = function(s) {
    var name = s.room.name;
    var mySources = [];

    var x = s.pos.x - 1;
    var y = s.pos.y - 1;
    var positions = [];

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var pos = new RoomPosition(x, y, name);
            var structures = pos.lookFor(LOOK_STRUCTURES);
            var hasStructureObstacle = _.any(structures,
                function(structure) {
                    return _.filter(OBSTACLE_OBJECT_TYPES,
                        function(obstacle) {
                            return obstacle == structure.structureType;
                        }).length > 0;
                }
            );

            var terrains = pos.lookFor(LOOK_TERRAIN);
            var hasTerrainObstacle = _.any(terrains,
                function(structure) {
                    return _.filter(OBSTACLE_OBJECT_TYPES,
                        function(obstacle) {
                            return obstacle == structure;
                        }).length > 0;
                }
            );

            var creeps = pos.lookFor(LOOK_CREEPS);
            var hasCreepObstacle = creeps.length > 0;

            var position = {
                x: x,
                y: y,
                structures: structures,
                terrains: terrains,
                hasObstacle: hasStructureObstacle || hasTerrainObstacle
            };
            positions.push(position);
            x++;
        }
        x = s.pos.x - 1;
        y++;
      }

      var spacesAtSourceAvailable = _.filter(positions, function(p) {
          return !p.hasObstacle
      }).length;

      return spacesAtSourceAvailable;
};


module.exports = creepFactory;
