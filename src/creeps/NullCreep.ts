import ICreep from './ICreep';

class Repairer implements ICreep {

    private creep: any;

    constructor(creep: any) {
        this.creep = creep;
    }

    run() {
        console.log("NullCreep: " + this.creep.name);
    }
}

export default Repairer;
