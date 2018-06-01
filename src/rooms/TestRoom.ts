import BaseRoom from './BaseRoom';

class TestRoom extends BaseRoom {
    constructor(room: Room) {
        super(room.name);
    }
}
