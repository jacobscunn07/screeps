import Upgrader from './Upgrader';

class UpgraderMother {
    static create(spawn: StructureSpawn) {
        const body = [WORK, CARRY, MOVE, MOVE];
        const name = "Upgrader-"+Game.time;
        let memory = {
            role: "upgrader",
            upgrading: false,
            dryRun: true
        };
        if (spawn.spawnCreep(body, name, memory) == OK) {
            memory.dryRun = false;
            let creepName = spawn.createCreep(body, name, memory);
            console.log("Spawning Upgrader: " + creepName);
        }
    }
}

export default UpgraderMother;
