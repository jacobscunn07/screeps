import Repairer from './Repairer';

class RepairerMother {
    static create(spawn: StructureSpawn) {
        const body = [WORK, CARRY, MOVE, MOVE];
            const name = "Repairer-"+Game.time;
            let memory = {
                role: "repairer",
                repairing: false,
                structure: undefined,
                dryRun: true
            };
            if (spawn.spawnCreep(body, name, memory) == OK) {
                memory.dryRun = false;
                let creepName = spawn.createCreep(body, name, memory);
                console.log("Spawning Repairer: " + creepName);
            }
    }
}

export default RepairerMother;
