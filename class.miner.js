var sourceAccessPoints = function(s) {
    var sources = creep.findSources();
    var name = creep.room.name;
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

var miner = class Miner {
    constructor(spawn, room, creep) {
        this.spawn = spawn;
        this.room = room;
        this.creep = creep;
    }

    create() {
        var tiers = [{
            body: [WORK, CARRY, MOVE]
        }, {
            body: [WORK, WORK, CARRY, MOVE]
        }, {
            body: [WORK, WORK, WORK, CARRY, MOVE]
        }, {
            body: [WORK, WORK, WORK, WORK, CARRY, MOVE]
        }, {
            body: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]
        }];

        var sourcesNeedingWork = [];

        _.forEach(Game.sources, function(source) {
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.targetSourceId == source.id);
            var workCount = _.reduce(creeps, function(sum, creep) {
                return sum + creep.getActiveBodyparts(WORK);
            }, 0);
            var sourceAccessPoints = sourceAccessPoints(source);


            if (workCount < 5 && sourceAccessPoints > 0) {
                sourcesNeedingWork.push({
                    source: source,
                    worksNeeded: 5 - workCount
                });
            }
        });

        // var sourceTiers = [];
        // _.forEach(sourcesNeedingWork, function(source) {
        //     var filteredTiers = _.filter(tiers, (tier) => _.reduce(tier.body, function(sum, t) {
        //         return t == WORK ? sum + 1 : sum;
        //     }, 0).length <= source.worksNeeded);
        //     sourceTiers.push({
        //         source: source,
        //         tiers: filteredTiers
        //     });
        // });

        _.forEach(sourcesNeedingWork, function(source) {
            var name = null;
            _.forEach(tiers, function(tier) {
                if (spawn.canCreateCreep(tier.body, undefined, {
                        role: 'miner'
                    }) == OK) {
                    name = spawn.createCreep(tier.body, undefined, {
                        role: 'miner',
                        home: room || self.spawn.room.name,
                        targetSourceId: source.id
                    });
                }
            });

            if (name) {
              this.creep = Game.creeps[name];
              console.log("Spawning Miner, " + name + ", in room " + self.spawn.room.name);
            }
        });
    }

    run() {
        if (this.creep.carry.energy < this.creep.carryCapacity) {
            var source = null;
            if (this.creep.memory.targetSourceId) {
                source = Game.getObjectById(this.creep.memory.targetSourceId);
            } else {
                source = findSourceToHarvest(creep);
                this.creep.memory.targetSourceId = source ? source.id : null;
            }

            if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source);
            }
        } else {
            var container = this.creep.findClosestContainerThatIsNotFull();
            if (container && this.creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(container);
            } else if (!container) {
                var target = this.creep.findClosestPlaceToDumpEnergy();
                if (target && this.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target);
                }
            }
        }
    }
};
module.exports = miner;
