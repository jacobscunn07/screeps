interface IDictionary<T> {
    [index: string]: T
}

interface IKeyedCollection<T> {
    Add(key: string, value: T):void;
    ContainsKey(key: string): boolean;
    Count(): number;
    Item(key: string): T;
    Keys(): string[];
    Remove(key: string): T;
    Values(): T[];
}

class KeyedCollection<T> implements IKeyedCollection<T> {
    private items: { [index: string]: T } = {};

    private count: number = 0;

    public ContainsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    public Count(): number {
        return this.count;
    }

    public Add(key: string, value: T) {
        if(!this.items.hasOwnProperty(key))
             this.count++;

        this.items[key] = value;
    }

    public Remove(key: string): T {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    }

    public Item(key: string): T {
        return this.items[key];
    }

    public Keys(): string[] {
        var keySet: string[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }

    public Values(): T[] {
        var values: T[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }

        return values;
    }
}

abstract class BaseRoom extends Room {
    sources:Array<Source>;
    harvesterContainers:KeyedCollection<StructureContainer>;
    constructor(name: string) {
        super(name);
        this.sources = this.find(FIND_SOURCES);
        this.harvesterContainers = this.getHarvesterContainers();
    }

    getHarvesterContainers = ():KeyedCollection<StructureContainer> => {
        let sources = this.sources;
        let harvesterContainers:any = {};
        // let containers: Map<string, StructureContainer> = new Map<string, StructureContainer>();
        let containers = {} as IDictionary<StructureContainer>;
        let containerz = new KeyedCollection<StructureContainer>();
        for(var i = 0; i < sources.length; i++) {
            let source = sources[i];
            let name = source.room.name;
            let x = source.pos.x - 1;
            let y = source.pos.y - 1;

            for(let j = 0; j < 3; j++) {
                for(var k = 0; k < 3; k++) {
                    let pos = new RoomPosition(x, y, name);
                    let structures = pos.lookFor(LOOK_STRUCTURES);
                    let container = <StructureContainer>_.find(structures, (structure => structure.structureType === STRUCTURE_CONTAINER));
                    if(container) {
                        harvesterContainers[source.id] = container;
                        // containers.set(source.id, container);
                        containers[source.id] = container;
                        containerz.Add(source.id, container);
                    }
                    x++;
                }
                x = source.pos.x - 1;
                y++;
            }
        }
        // console.log("DICTIONARY: " + JSON.stringify(containers.length));
        return containerz;
    }

    private getSources() {
        let sources = this.find(FIND_SOURCES);
        let mySources = new Array<MySource>();
        for(var i = 0; i < sources.length; i++) {
            let mySource = new MySource(sources[i].id);
            mySources.push(mySource);
        }
        return mySources;
    }

    findContainerForSource(source: Source):StructureContainer|undefined {
        var name = source.room.name;
        var x = source.pos.x - 1;
        var y = source.pos.y - 1;

        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                let pos = new RoomPosition(x, y, name);
                let structures = pos.lookFor(LOOK_STRUCTURES);
                let container = _.find(structures, (structure => structure.structureType === STRUCTURE_CONTAINER));
                if(container) return <StructureContainer>container;
                x++;
            }
            x = source.pos.x - 1;
            y++;
        }
        return undefined;
    }
}

class MySource extends Source {
    harvesterContainer:StructureContainer|undefined = undefined;
    constructor(id: string) {
        super(id);
        this.harvesterContainer = this.findContainerForSource();
    }

    private findContainerForSource():StructureContainer|undefined {
        var name = this.room.name;
        var x = this.pos.x - 1;
        var y = this.pos.y - 1;

        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                let pos = new RoomPosition(x, y, name);
                let structures = pos.lookFor(LOOK_STRUCTURES);
                let container = _.find(structures, (structure => structure.structureType === STRUCTURE_CONTAINER));
                if(container) return <StructureContainer>container;
                x++;
            }
            x = this.pos.x - 1;
            y++;
        }
        return undefined;
    }
}

export default BaseRoom;
