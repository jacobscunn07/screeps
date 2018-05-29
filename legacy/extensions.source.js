class SourceExtensionsRegistrar {
    static register() {
        Source.prototype.findAvailableMiningSpots = function() {
            var name = this.room.name;
            var x = this.pos.x - 1;
            var y = this.pos.y - 1;
            var availableRoomPositions = [];

            for(var i = 0; i < 3; i++) {
                for(var j = 0; j < 3; j++) {
                    var pos = new RoomPosition(x, y, name);
                    var objects = pos.look();
                    var isBlocked = _.some(objects, (object => OBSTACLE_OBJECT_TYPES.includes(object.terrain)));
                    if(!isBlocked) {
                        availableRoomPositions.push(pos);
                    }
                    x++;
                }
                x = this.pos.x - 1;
                y++;
            }
            return availableRoomPositions;
        }
    }
}

module.exports = SourceExtensionsRegistrar;
