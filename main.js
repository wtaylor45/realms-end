/**
 * Creating the file server and a game server
 */

 var fs = require('fs'),
     Logger = require('js-logger'),
     _ = require('underscore'),
     DB = require('./server/js/db')

function main(options){
    // File server variables
    var express = require('express');
    const app = express(); // The express file server app
    var http = require('http').Server(app);

    var io = require('socket.io')(http);
    var world = require('./server/js/world');
    var worlds = []; // List of all active worlds
    var uuidV1 = require('uuid/v1');
    var CONNECTIONS = [];

    DB.init(options.dbURL);

    console.log(DB.queryTable("re_user", {"username": {"$eq": "test"}}));

    const PORT = options.port || 2000; // the port the local server will run on 

    Logger.useDefaults();

    switch(options.debugLevel){
        case 'info':
            Logger.setLevel(Logger.INFO);
            break;
        case 'debug':
            Logger.setLevel(Logger.DEBUG);
            break;
        case 'warn':
            Logger.setLevel(Logger.WARN);
            break;
        case 'error':
            Logger.setLevel(Logger.ERROR);
            break;
        default:
            Logger.setLevel(Logger.INFO);
            break;
    }

    Logger.info('Starting file server...');

    /*****************************/
    /*        FILE SERVER        */
    /*****************************/

    app.get('/', function(req, res){
        res.sendFile(__dirname + '/client/index.html');
    });
    app.use('/client', express.static(__dirname + '/client'));

    http.listen(PORT); // Start the file server

    Logger.info('SUCCESS')

    /*****************************/
    /*        GAME SERVER        */
    /*****************************/

    Logger.info('-----------------------');
    Logger.info('Starting game server...');
    Logger.time('Game server startup time');

    io.sockets.on('connection', function(connection){
        var world = _.detect(worlds, function(world){
            return world.playerCount < world.maxPlayers;
        });

        if(!world){
            Logger.info("All worlds currently full.");
        }else{
            world.connectPlayer(new Player(connection, world));            
        }
    });

    _.each(_.range(options.numWorlds), function(i){
        worlds[i] = new World("world"+(i+1), options.playersPerWorld, io.sockets);
        Logger.info('World', i, 'created.')
    });

    Logger.timeEnd('Game server startup time');
    Logger.info('-----------------------');
}

function getConfig(path, callback){
    fs.readFile(path, 'utf8', function(err, result){
        if(err){
            Logger.error("Could not open configuration file:", err);
            callback(null);
        }else{
            var json = JSON.parse(result);
            callback(json);
        }
    })
}

var configPath = "./server/config.json";

process.argv.forEach(function (val, index, array) {
    if(index === 2) {
        configPath = val;
    }
});

getConfig(configPath, function(file){
    if(!file) 
        throw "Configuration file not found. A configuration file is required."

    main(file);
});
