var mongojs = require('mongojs'),
    _ = require('underscore'),
    Logger = require('js-logger')

var DB = {};
var database;

DB.USERS = "re_users";
DB.STATS = "re_userStats";

DB.STATS_SCHEMA = {
    userId: "",
    maxHealth: 0,
    curHealth: 0,
    maxSpeed: 0,
    curSpeed: 0
}

DB.ACCOUNT_SCHEMA = {
    username: "",
    password: "",
    salt: "",
    email: "",
    online: false,
    map: "",
    x: "",
    y: ""
}

DB.init = function(url){
    console.log('Connecting to DB')
    database = mongojs(url);

    if(!database){
        throw "Could not establish connection with the database."
    }

    console.log("Connected to database...");
}

DB.writeToTable = function(table, value, callback){
    var collection = database.collection(table);
    
    if(!collection){
        Logger.error("[writeToTable] Table", table, "not found.");
        return;
    }
    if(!value){
        Logger.warn("[writeToTable] No values passed. Nothing to write.");
        return;
    }
    if(!callback) callback = function(){};
    collection.insert(value, callback);
}

DB.queryTable = function(table, query, callback){
    var collection = database.collection(table);
    var result;

    if(!callback){
        throw "Cannot return results without callback function.";
    }

    if(!collection){
        console.error("[queryTable] Table", table, "not found.");
        return;
    }
    
    collection.find(query, function(err, docs){
        callback(docs);
    })
}

DB.findOne = function(table, query, callback){
    var collection = database.collection(table);
    var result;

    if(!callback){
        throw "Cannot return results without callback function.";
    }

    if(!collection){
        console.error("[findOne] Table", table, "not found.");
        return;
    }
    
    collection.findOne(query, function(err, docs){
        callback(docs);
    })
}

DB.updateEntry = function(table, query, value, multi){
    var collection = database.collection(table);

    if(!collection){
        Logger.error('No table with name '+table+" found.");
    }
    if(!query || !value){
        Logger.error('Query and value to set are both required when updating an entry.');
    }

    collection.update(query, value, {multi: multi || false});
}

module.exports = DB;