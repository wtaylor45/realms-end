var mongojs = require('mongojs'),
    _ = require('underscore'),
    Logger = require('js-logger')

var DB = {};
var database;

DB.init = function(url){
    console.log('Connecting to DB')
    database = mongojs(url);

    if(!database){
        throw "Could not establish connection with the database."
    }

    console.log("Connected to database...");
}

DB.writeToTable = function(table, value){
    var collection = database.collection(table);
    
    if(!collection){
        Logger.error("[writeToTable] Table", table, "not found.");
        return;
    }
    if(!value){
        Logger.warn("[writeToTable] No values passed. Nothing to write.");
        return;
    }

    collection.save(value);
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

module.exports = DB;