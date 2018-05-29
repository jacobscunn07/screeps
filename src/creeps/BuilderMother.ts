import Builder from './Builder';

class BuilderMother {
    static create(spawn: StructureSpawn) {
        const body = [WORK, CARRY, MOVE, MOVE];
            const name = "Builder-"+Game.time;
            let memory = {
                role: "builder",
                building: false,
                dryRun: true
            };
            if (spawn.spawnCreep(body, name, memory) == OK) {
                memory.dryRun = false;
                let creepName = spawn.createCreep(body, name, memory);
                console.log("Spawning Builder: " + creepName);
            }
    }
}

export default BuilderMother;
