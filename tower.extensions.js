var towerExtensions = {
  register: function () {
    StructureTower.prototype.findClosestHostileCreep = function() {
      return this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    }
  }
};

module.exports = towerExtensions;
