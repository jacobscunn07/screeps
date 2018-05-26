class Upgrader {
    constructor(creep) {
        this.creep = creep;
    }

    static create(spawn) {
        const body = [WORK, CARRY, MOVE, MOVE];
        const memory = {
            role: 'upgrader',
            upgrading: false,
        };
        if (spawn.canCreateCreep(body, undefined, memory) == OK) {
            let name = spawn.createCreep(body, undefined, memory);
            console.log("Spawning Upgrader: " + name);
        }
    }

    run() {
        this._updateUpgradingStatus();
        if(this._upgrading()) {
            this._upgradeController();
        }
        else {
            this._mineEnergy();
        }
    }

    _updateUpgradingStatus() {
        if (this.creep.memory.upgrading && this.creep.carry.energy == 0) {
            this.creep.memory.upgrading = false;
        }

        if (!this.creep.memory.upgrading && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.upgrading = true;
        }
    }

    _upgrading() {
        return this.creep.memory.upgrading;
    }

    _getEnergyForUpgrading() {
        var target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(c) {
                return c.structureType == STRUCTURE_CONTAINER && c.store.energy > 0;
            }
        });
        if (this.creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(target);
        }
    }

    _upgradeController() {
        if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(this.creep.room.controller);
        }
    }

    _mineEnergy() {
        var source = this.creep.findClosestSourceToMe();
        if (this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(source);
        }
    }
}

module.exports = Upgrader;
