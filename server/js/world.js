/*
 * Game server that handles all game logic, loops, etc
 */

var Logger = require('js-logger');

module.exports = World = class World{
    constructor(id, maxPlayers, server){
        this.id = id;
        this.server = server;
        this.maxPlayers = maxPlayers;

        this.playerCount = 0;
        
        this.onPlayerConnect(function(player){
            Logger.info("We did it!!!");
        });
    }

    connectPlayer(player){
        this.connectCallback(player)
    }

    onPlayerConnect(callback){
        this.connectCallback = callback;
    }
}