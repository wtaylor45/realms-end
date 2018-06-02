var Character = require('./character'),
    DB = require('./private/db'),
    Logger = require('js-logger'),
    Message = require('./message'),
    Types = require('../../shared/js/types'),
    Races = require('../../shared/js/races'),
    PlayerModel = require('../../shared/js/playerModel')

module.exports = Player = class Player extends Character {
    constructor(id, username, x, y, map, connection, worldServer){
        super(id, username, x, y, map);
        var self = this;
        this.connection = connection;
        this.worldServer = worldServer;

        this.connection.on('disconnect', function(){
            self.disconnectCallback();
        });

        this.onLoaded(function(){
            var message = new Message.Login(self, Message.Login.Reasons.LOGIN_SUCCESS);
            self.connection.emit(
                message.type, 
                message.serialize()
            );
        });

        this.init(); // Initialize other parts of players
    }

    init(){
        var self=this;
        var statsReady, locationReady;
        this.initializeStats(function(){
            statsReady = true;
        });
        this.initializeLocation(function(){
            locationReady = true;
        });

        var onReady = setInterval(function(){
            if(statsReady && locationReady){
                clearInterval(onReady);
                self.initializeListeners();
            }
        }, 10);
        this.loaded();
    }

    initializeStats(callback){
        var self = this;
        DB.findOne(DB.STATS, {userId: this.id}, function(result){
            // Prune the result object
            delete result.userId;
            delete result._id;

            var stats = result;
            
            if(!stats){
                Logger.info("No stats for", self.name, "found. Creating their statistics...");
                var stats = Player.setBaseStatsFromRace(Types.Races.HUMAN);
                stats.userId = self.id;
                DB.writeToTable(DB.STATS, stats, callback);
            }

            self.setStats(stats);
            if(callback) callback();
        });
    }

    initializeLocation(callback){
        var self = this;
        DB.findOne(DB.LOCATION, {userId: this.id}, function(result){
            var location = result;
            if(!location){
                Logger.info("No location found for "+this.name+". Setting to base location...");
                location = Player.setBaseLocationFromRace(Types.Races.HUMAN);
                location.userId = self.id;
                DB.writeToTable(DB.LOCATION, location, callback);
            }

            self.setPosition(result.x, result.y);
            Logger.debug(self.model)
            if(callback) callback();
        });
    }

    initializeListeners(){
        var self = this;
        this.connection.on(Types.Messages.MOVE, function(data){
            self.onMove(data);
        });
    }

    loaded(){
        if(this.loadCallback) this.loadCallback();
    }

    onLoaded(callback){
        this.loadCallback = callback;
    }

    onDisconnect(callback){
        this.disconnectCallback = callback;
    }

    onMove(data){
        PlayerMode.move(this, data.vector, data.dt);
    }
}

Player.createNewPlayer = function(username, callback){
    // Write Stats
    var stats = Player.setBaseStatsFromRace(Types.Races.HUMAN);
    var location = Player.setBaseLocationFromRace(Types.Races.HUMAN);
    var statsReady, locationReady;

    DB.findOne(DB.USERS, {username: username}, function(result){
        stats.userId = result._id;
        location.userId = result._id;
        DB.writeToTable(DB.STATS, stats, function(){
            statsReady = true;
        });
        DB.writeToTable(DB.LOCATION, location, function(){
            locationReady = true;
        });
    });

    var onReady = setInterval(function(){
        if(statsReady && locationReady){
            cancelInterval(onReady);
            callback();
        }
    }, 10);
}

Player.setBaseStatsFromRace = function(race){
    var stats = PlayerModel.STATS;
    var raceStats = Races.getBaseStats(race);
    stats.curHealth = stats.maxHealth = raceStats.health;
    stats.curSpeed = stats.maxSpeed = raceStats.speed;
    return stats;
}

Player.setBaseLocationFromRace = function(race){
    Logger.debug(race);
    var raceLocation = Races.getBaseLocation(race);
    return raceLocation;
}