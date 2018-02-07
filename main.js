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

    var io = require('socket.io')(http);
    var World = require('./server/js/world');
    var uuidV1 = require('uuid/v1');
    var CONNECTIONS = [];

    DB.init(options.dbURL);

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
        res.sendFile(__dirname + '/client/views/index.html');
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
        CONNECTIONS.push(connection);

        connection.on(Types.Messages.LOGIN, function(data){
            Account.login(data, connection)
        });

        connection.on(Types.Messages.REGISTER, function(data){
            Account.register(data, connection)
        })
    });

    World.createWorlds();

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
