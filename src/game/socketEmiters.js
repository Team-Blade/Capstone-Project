import { socket } from "../../components/App";

export function sendMovementInfo(scene) {
  scene.socket.emit("playerMovement", {
    roomId: socket.roomId,
    socketId: socket.id,
    x: scene.pac.x,
    y: scene.pac.y,
    direction: scene.pac.direction,
    big: scene.pac.big,
    vulnerable: scene.pac.vulnerable
  });

}

export function sendGhostMovement(scene) {
  scene.socket.emit(
    "ghostMovement",
    {
      x: scene.og.x,
      y: scene.og.y,
      direction: scene.og.direction,
      vulnerable: scene.og.vulnerable
    },
    socket.roomId
  );
}
