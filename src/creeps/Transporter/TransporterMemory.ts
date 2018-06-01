class TransporterMemory implements CreepMemory {
    role:string = "transporter";
    transporting:boolean = false;

    constructor(memory: any) {
        this.transporting = memory.transporting;
    }
}

export default TransporterMemory;
