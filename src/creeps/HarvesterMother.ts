import IMother from './IMother';
import Harvester from './Harvester';

class HarvesterMother {
    static create(spawn: StructureSpawn, source: Source) {
        const body = [WORK, CARRY, MOVE, MOVE];
        const name = "Harvester-"+Game.time;
        const memory = {
            role: "harvester",
            source: source.id,
            dryRun: true
        };
        if (spawn.spawnCreep(body, name, memory) == OK) {
            memory.dryRun = false;
            let creepName = spawn.createCreep(body, name, memory);
            console.log("Spawning Harvester: " + creepName);
        }
    }
}

export default HarvesterMother;
