var mongojs = require('mongojs'),
    _ = require('underscore'),
    Logger = require('js-logger')

var DB = {};
var database;

DB.USERS = "re_users";
DB.STATS = "re_userStats";
DB.LOCATION = "re_location";

/**
 * PK _id
 * FK userId (re_user._id)
 * 
 * Every stat has a current and a max. Current is what the stat is currently at,
 * while current is what the current level of that stat is (e.g. affected by slowness, 
 * speed is currently 1, max 5).
 */
DB.STATS_SCHEMA = {
    userId: "",
    maxHealth: 0,
    curHealth: 0,
    maxSpeed: 0,
    curSpeed: 0
}

/**
 * PK _id
 * 
 * Stores usernames, hashed passwords, and salt for login purposes.
 */
DB.ACCOUNT_SCHEMA = {
    username: "",
    password: "",
    salt: "",
    email: "",
    online: false,
}

/**
 * PK _id
 * FK userId (re_user)
 * 
 * Where the user currently is in the world. Updated on log out only.
 */
DB.LOCATION_SCHEMA = {
    userId: "",
    map: "",
    x: 0,
    y: 0
}

/**
 * 
 * @param {String} url          The URL of the database.
 * 
 * Establish a connection the database.
 */
DB.init = function(url){
    Logger.info("Attempting to connect to the database @ "+url+".");
    database = mongojs(url);

    if(!database){
        throw "Could not establish connection with the database."
    }

    Logger.info("Connection established with MongoDB!")
}

/**
 * 
 * @param {String} table            The table to write to.
 * @param {Object} value            The value to write to the table. 
 * @param {Object} callback         The function to run once the write operation has completed. 
 * 
 * Write a given value or set of values to the given table.
 */
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

/**
 * 
 * @param {String} table            The table to run the query on.
 * @param {Object} query            The MongoDB formatted query to run. 
 * @param {*} callback              The function to run ocne the query has completed.
 */
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