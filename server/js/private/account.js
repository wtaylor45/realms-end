var crypto = require('crypto'),
    _ = require('underscore'),
    DB = require('./db'),
    Logger = require('js-logger'),
    World = require('../world'),
    Player = require('../player'),
    Message = require('../message')

Account = {};

/**
 * Validate the credentials received and log the user in.
 */
Account.login = function(data, connection){
    Account.getUserInfo(data.username, function(result){
        if(!result){
            Logger.info(data.username, "attempted to log in with an incorrect username.")
            connection.emit(Types.Messages.LOGIN, {success: false, reason: Message.Login.Reasons.CREDENTIALS_FAIL}); 
            return;
        }
        Account.encryptPassword(data.password, result.salt, function(hashResult){
            if(hashResult == result.password){
                if(result.online){
                    Logger.info(result.username, "attempted to log into the system, but is already online.");
                    connection.emit(Types.Messages.LOGIN, {success: false, reason: Message.Login.Reasons.LOGGED_IN_FAIL}); 
                    return;
                }
                Logger.info(data.username, "has successfully logged in.");
                connection.emit(Types.Messages.LOGIN, {success: true, reason: Message.Login.Reasons.LOGIN_SUCCESS, complete: false}); 
                World.addPlayerToOpenWorld(result, connection);                
            }else{
            }
        });
    });
}

Account.register = function(data, connection){
    Account.findUser(data.username, function(result){
        if(result){
            connection.emit(Types.Messages.LOGIN, {success: false, reason: Message.Login.Reasons.USERNAME_TAKEN_FAIL}); 
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
            connection.emit(Types.Messages.REGISTER, {success: true, reason: Message.Login.Reasons.REGISTER_SUCCESS, complete: false});
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