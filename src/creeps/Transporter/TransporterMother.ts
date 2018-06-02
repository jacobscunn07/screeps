import Transporter from './Transporter';

class TransporterMother {
    static create(spawn: StructureSpawn) {
        const body = [CARRY, CARRY, MOVE, MOVE];
            const name = "Transporter-"+Game.time;
            let memory = {
                role: "transporter",
                dryRun: true
            };
            if (spawn.spawnCreep(body, name, memory) == OK) {
                memory.dryRun = false;
                let creepName = spawn.createCreep(body, name, memory);
                console.log("Spawning Transporter: " + creepName);
            }
    }
}

export default TransporterMother;
