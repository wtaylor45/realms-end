/*
 * Game server that handles all game logic, loops, etc
 */

var Logger = require('js-logger'),
    _ = require('underscore'),
    Player = require('./player')

module.exports = World = class World{
    constructor(id, maxPlayers, server){
        var self = this;

        this.id = id;
        this.server = server;
        this.maxPlayers = maxPlayers;
        this.playerCount = 0;

        // The list of all entities, players, etc
        this.players = [];
        this.entities = [];

        // The message queue for each player
        this.outgoingMessages = [];
        
        this.onPlayerConnect(function(player){
            self.incrementPlayerCount();

            Logger.info("Player", player.id, "added.");
            Logger.info(self.id, "capacity:",
                self.playerCount+"/"+self.maxPlayers);
            
            player.onDisconnect(function(){
                self.removePlayer(player);
                self.decrementPlayerCount();

                Logger.info("Player", player.id,"removed.") 
                Logger.info(self.id, "capacity:",
                    self.playerCount+"/"+self.maxPlayers);
            });

            self.outgoingMessages[player.id] = {};
        });
    }

    connectPlayer(player){
        this.connectCallback(player)
    }

    onPlayerConnect(callback){
        this.connectCallback = callback;
    }

    incrementPlayerCount(){
        this.playerCount++;
    }

    decrementPlayerCount(){
        this.playerCount--;

        if(this.playerCount < 0){
            Logger.warn("WARNING: Player count currently", this.playerCount
                +". Player counts should never fall below 0.");
        }
    }

    addEntity(entity){
        this.entities[entity.id] = entity;
    }

    removeEntity(entity){
        delete this.entities[entity.id];
    }

    addPlayer(player){
        this.players[player.id] = player;
        this.outgoingMessages[player.id] = [];
    }

    removePlayer(player){
        delete this.players[player.id];
        delete this.outgoingMessages[player.id];

        this.removeEntity(player);
    }
}