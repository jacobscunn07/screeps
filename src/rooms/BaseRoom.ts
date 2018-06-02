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
    containers:RoomContainerList;
    extensions:Array<StructureExtension>;
    constructor(name: string) {
        super(name);
        this.sources = this.find(FIND_SOURCES);
        this.extensions = this.getExtensions();
        this.containers = this.findContainers();

    }

    private getExtensions():Array<StructureExtension> {
        let extensions = _.filter(this.find(FIND_MY_STRUCTURES), (s) => s.structureType === STRUCTURE_EXTENSION);
        return _.map(extensions, (ext) => new StructureExtension(ext.id));
    }

    private findContainers() {
        const containers = <Array<StructureContainer>>_.filter(this.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER);
        let harvesterContainers:Array<StructureContainer> = new Array<StructureContainer>();
        let storageContainers:Array<StructureContainer> = new Array<StructureContainer>();
        let temp = {
            harvsterContainers: new Array<RoomHarvesterContainer>(),
            storageContainers: new Array<RoomStorageContainer>()
        }
        let cs = new RoomContainerList();
        for(var i = 0; i < containers.length; i++) {
            let container = <StructureContainer>containers[i];
            let name = container.room.name;
            let x = container.pos.x - 1;
            let y = container.pos.y - 1;
            let sources = this.find(FIND_SOURCES);

            for(var j = 0; j < 3; j++) {
                for(var k = 0; k < 3; k++) {
                    let pos = new RoomPosition(x, y, name);
                    let source = <Source>_.find(sources, (s:Source) => s.pos.x == pos.x && s.pos.y == pos.y);
                    if(source) {
                        harvesterContainers.push(container);
                        temp.harvsterContainers.push({
                            source: source.id,
                            container: container
                        });
                        cs.harvesterContainers.push(new RoomHarvesterContainer(source.id, container));

                    }
                    x++;
                }
                y++;
                x = container.pos.x - 1;
            }
        }
        let ids = _.map(cs.harvesterContainers, c => c.container.id);
        cs.storageContainers = _.map(_.filter(containers, c => !_.includes(ids, c.id)), co => new RoomStorageContainer(co));
        return cs;
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

class RoomHarvesterContainer {
    source:string = "";
    container:StructureContainer;

    constructor(source:string, container:StructureContainer) {
        this.source = source;
        this.container = container;
    }
}

class RoomStorageContainer {
    container:StructureContainer;

    constructor(container:StructureContainer) {
        this.container = container;
    }
}

class RoomContainerList {
    harvesterContainers:Array<RoomHarvesterContainer> = new Array<RoomHarvesterContainer>();
    storageContainers:Array<RoomStorageContainer> = new Array<RoomStorageContainer>();
}

export default BaseRoom;
