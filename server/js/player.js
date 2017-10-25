var Character = require('./character');

module.exports = Player = class Player extends Entity {
    constructor(connection, worldServer){
        super(connection.id);
        var self = this;

        this.connection = connection;
        this.worldServer = worldServer;

        this.connection.on('disconnect', function(){
            self.disconnectCallback();
        });
    }

    onDisconnect(callback){
        this.disconnectCallback = callback;
    }
}