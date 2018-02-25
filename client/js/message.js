var Socket = require('./socket');

module.exports = Message = {};

Message.Move = class MoveMessage {
    constructor(player, movementVector, dt){
        this.player = player;
        this.movementVector = movementVector;
        this.dt = dt;
    }

    send(){
        var message = {
            time: Date.now(),
            id: this.player.id,
            vector: this.movementVector,
            dt: this.dt
        }

        Socket.emit(Types.Messages.MOVE, message);
    }
}