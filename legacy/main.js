var Bootstrapper = require("bootstrapper");
var RoomController2Strategy = require("room.strategies.rc2");

module.exports.loop = () =>
{
    Bootstrapper.bootstrap();
    for(var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var roomStrategy = new RoomController2Strategy(room);
        roomStrategy.run();
    }
}
