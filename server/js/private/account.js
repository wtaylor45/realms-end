var crypto = require('crypto'),
    _ = require('underscore'),
    DB = require('./db'),
    Logger = require('js-logger'),
    World = require('../world'),
    Player = require('../player')

Account = {};

/**
 * Validate the credentials received and log the user in.
 */
Account.login = function(data, connection){
    Account.getUserInfo(data.username, function(result){
        if(!result){
            Logger.log('No account with credentials found.');
            connection.emit(Types.Messages.LOGIN, {success: false, reason: "Invalid username or password."}); 
            return;
        }
        Account.encryptPassword(data.password, result.salt, function(hashResult){
            if(hashResult == result.password){
                if(result.online){
                    Logger.log('Account has already logged in.');
                    connection.emit(Types.Messages.LOGIN, {success: false, reason: "Account is still logged in."}); 
                    return;
                }
                Logger.debug(data.username, "has successfully logged in.");
                connection.emit(Types.Messages.LOGIN, {success: false, reason: "Login successful! Entering the realm...", complete: false}); 
                World.addPlayerToOpenWorld(result, connection);
                
            }else{
                connection.emit(Types.Messages.LOGIN, {success: false, reason: "Invalid username or password."});
            }
        });
    });
}

Account.register = function(data, connection){
    Account.findUser(data.username, function(result){
        if(result){
            connection.emit(Types.Messages.REGISTER, {"success": false, "reason": "Username already taken."});
            Logger.debug("Username " + data.username + " already taken.");
            return;
        }

        Account.registerUser(data, connection);
    });
}

Account.registerUser = function(data, connection){
    var unencryptedData = data;
    Account.getSalt(function(salt){
        Account.encryptPassword(data.password, salt, function(password, salt){
            var account = DB.ACCOUNT_SCHEMA;
    
            account = _.mapObject(account, function(val, key){
                return data[key] || account[key];
            })
    
            account.password = password;
            account.salt = salt;
            
            DB.writeToTable(DB.USERS, account, function(data){
                Player.createNewPlayer(account.username, function(){
                    Account.login(unencryptedData, connection);
                });
            });
            connection.emit(Types.Messages.REGISTER, {success: true, reason: "Account successfully created.\nLogging in...", complete: false});
        });
    });
}

Account.encryptPassword = function(password, salt, callback){
    crypto.pbkdf2(password, salt, 2000, 64, 'sha1', function(err, result){
        callback(result.toString('base64'), salt);
    })
}

Account.getSalt = function(callback){
    crypto.randomBytes(32, function(err, salt){
        callback(salt.toString('base64'));
    });
}

Account.findUser = function(username, callback){
    DB.findOne(DB.USERS, {"username": username}, function(result){
        callback(result);
    });
}

Account.getUserInfo = function(username, callback){
    Account.findUser(username, function(result){
        if(!result){
            callback(result);
            return;
        }
        callback(result);
    })
}

module.exports = Account;