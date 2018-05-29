import { ErrorMapper } from "utils/ErrorMapper";
import './prototypes/Creep';
import MyRoom from './rooms/MyRoom';
import RC1Room from './rooms/RC1/RC1Room';
import RC2Room from './rooms/RC2/RC2Room';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  for(const name in Game.rooms) {
    let r = Game.rooms[name] as any;
    if(r.controller.level == 1) {
      let room = new RC1Room(Game.rooms[name]);
      room.run();
    }
    else if(r.controller.level == 2) {
      let room = new RC2Room(Game.rooms[name]);
      room.run();
    }
    else {
      let room = new MyRoom(Game.rooms[name]);
      room.run();
    }
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
