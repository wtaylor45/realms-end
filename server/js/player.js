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
        this.model = new PlayerModel(this);

        this.connection.on('disconnect', function(){
            self.disconnectCallback();
        });

        this.onLoaded(function(){
            var message = new Message.Login(self);
            self.connection.emit(
                message.type, 
                message.serialize()
            );
        });

        this.init(); // Initialize other parts of players

        this.initializeListeners(); // Initialize message listeners
    }

    init(){
        this.initializeStats(this.loadCallback);
    }

    initializeStats(callback){
        var self = this;
        DB.findOne(DB.STATS, {userId: this.id}, function(result){
            delete result.userId;
            delete result._id;

            self.setStats(result);
            callback();
        });
    }
    

    initializeListeners(){
        var self = this;
        this.connection.on(Types.Messages.MOVE, function(data){
            self.onMove(data);
        });
    }

    onLoaded(callback){
        this.loadCallback = callback;
    }

    onDisconnect(callback){
        this.disconnectCallback = callback;
    }

    onMove(data){
        this.model.move(data.vector, data.dt);
    }
}

Player.createNewPlayer = function(username, callback){
    // Write Stats
    var stats = Player.setBaseStatsFromRace(Types.Races.HUMAN);

    DB.findOne(DB.USERS, {username: username}, function(result){
        stats.userId = result._id;
        DB.writeToTable(DB.STATS, stats, callback);
    });
}

Player.setBaseStatsFromRace = function(race){
    var stats = DB.STATS_SCHEMA;
    var raceStats = Races.getBaseStats(race);
    stats.curHealth = stats.maxHealth = raceStats.health;
    stats.curSpeed = stats.maxSpeed = raceStats.speed;
    return stats;
}