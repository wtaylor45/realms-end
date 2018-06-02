/**
 * Creating the file server and a game server
 */

 var fs = require('fs'),
     Logger = require('js-logger'),
     _ = require('underscore'),
     DB = require('./server/js/private/db'),
     Types = require('./shared/js/types'),
     Account = require('./server/js/private/account')

function main(options){
    // File server variables
    var express = require('express');
    const app = express(); // The express file server app
    var http = require('http').Server(app);

    const PORT = options.port || 2000; // the port the local server will run on 
    var io = require('socket.io')(http);
    var World = require('./server/js/world');
    var uuidV1 = require('uuid/v1');
    var CONNECTIONS = [];

    // STEP 0: Initialize the logger.
    // Logger level set in config.json
    initializeLogger(options.debugLevel);
    Logger.time("Total startup time");

    // STEP 1: Establish connection with the database.
    // TODO: Allow for use of local test DB when offline
    Logger.time('Database initialization');
    DB.init(options.dbURL);
    Logger.timeEnd('Database initialization');

    /*****************************/
    /*        FILE SERVER        */
    /*****************************/
    Logger.time('File server intialization')
    Logger.info('Starting file server...');

    app.get('/', function(req, res){
        res.sendFile(__dirname + '/client/views/index.html');
    });
    app.use('/client', express.static(__dirname + '/client'));

    http.listen(PORT); // Start the file server

    Logger.info('File server successfully started!')
    Logger.timeEnd('File server intialization')

    /*****************************/
    /*        GAME SERVER        */
    /*****************************/
    Logger.info('Starting game server...');
    Logger.time('Game server startup time');

    DB.updateEntry("re_users", {}, {$set: {online: false}}, true);

    io.sockets.on('connection', function(connection){
        CONNECTIONS.push(connection);

        connection.on(Types.Messages.LOGIN, function(data){
            Account.login(data, connection)
        });

        connection.on(Types.Messages.REGISTER, function(data){
            Account.register(data, connection)
        })
    });

    World.createWorlds(options.numWorlds, options.playersPerWorld, io.sockets);

    Logger.info("Game server succesfully started!");
    Logger.timeEnd('Game server startup time');
    Logger.timeEnd('Total startup time');
    Logger.info("Startup completed! Waiting for connections.")
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

function initializeLogger(level){
    switch(level){
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
    Logger.setHandler(Logger.createDefaultHandler({
        formatter: function(messages, context) {
            var level = context.level.name;
            messages.unshift("["+new Date().toUTCString()+"] "+level+":");
        }
    }));
    Logger.info("Logger set to",JSON.stringify(Logger.getLevel())+".");
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
