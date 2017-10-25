var mongojs = require('mongojs'),
    _ = require('underscore'),
    Logger = require('js-logger')

var DB = {};
var database;

DB.init = function(url){
    database = mongojs(url);
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

DB.queryTable = function(table, query){
    var collection = database.collection(table);
    var result;
    var cursor;

    if(!collection){
        Logger.error("[queryTable] Table", table, "not found.");
        return;
    }

    cursor = collection.find({});

    cursor.toArray(function(err, documents){
        result = documents.length;
        return result;
    });
}

module.exports = DB;