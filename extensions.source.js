var findCreepsThatMineMe = function() {
  return _.filter(Game.creeps, (creep) => creep.memory.targetSourceId == this.id);
};

var sourceExtensions = {
  register: function () {
    Source.prototype.findCreepsThatMineMe = findCreepsThatMineMe;
  }
};

module.exports = sourceExtensions;
