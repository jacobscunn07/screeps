var tower = {
  run: function(tower) {
    var creep = tower.findClosestHostileCreep();
    tower.attack(creep);
  }
};

module.exports = tower;
