var mongojs = require('mongojs'),
    _ = require('underscore'),
    Logger = require('js-logger')

var DB = {};
var database;

DB.init = function(url){
    database = mongojs(url);

    if(!database){
        throw "Could not establish connection with the database."
    }

    Logger.info("Connected to database...");
}

DB.writeToTable = function(table, values){
    var collection = database.collection(table);
    
    if(!collection){
        Logger.error("[writeToTable] Table", table, "not found.");
        return;
    }

    _.each(value, function(value){
        collection.save(value);
    });
}

DB.queryTable = function(table, query, callback){
    var collection = database.collection(table);
    var result;
    var cursor;

    if(!callback){
        throw "Cannot return results without callback function.";
    }

    if(!collection){
        Logger.error("[queryTable] Table", table, "not found.");
        return;
    }

    cursor = collection.find({});

    cursor.toArray(callback);
}

module.exports = DB;