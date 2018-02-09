var crypto = require('crypto'),
    _ = require('underscore'),
    DB = require('./db'),
    Logger = require('js-logger')

Account = {};

Account.USERS = "re_users";

Account.SCHEMA = {
    username: "",
    password: "",
    salt: "",
    email: "",
    online: false,
}

/**
 * Validate the credentials received and log the user in.
 */
Account.login = function(data, connection){
    Account.getUserPasswordInfo(data.username, function(password, salt){
        if(!password || !salt){
            Logger.log('No account with credentials found.');
            connection.emit(Types.Messages.LOGIN, {success: false, reason: "Invalid username or password."});
            return;
        }
        Account.encryptPassword(data.password, salt, function(hashResult){
            if(hashResult == password){
                Logger.debug(data.username, "has successfully logged in.");
                connection.emit(Types.Messages.LOGIN, {success: true, reason: "Login successful.\nEntering the realm..."});
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
    Account.getSalt(function(salt){
        Account.encryptPassword(data.password, salt, function(password, salt){
            var account = Account.SCHEMA;
    
            account = _.mapObject(account, function(val, key){
                return data[key] || account[key];
            })
    
            account.password = password;
            account.salt = salt;
            
            DB.writeToTable(Account.USERS, account);

            connection.emit(Types.Messages.REGISTER, {success: true, reason: "Account successfully created.\nEntering the realm..."});
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
        Logger.debug(salt)
        callback(salt.toString('base64'));
    });
}

Account.findUser = function(username, callback){
    DB.findOne(Account.USERS, {"username": username}, function(result){
        callback(result);
    });
}

Account.getUserPasswordInfo = function(username, callback){
    Account.findUser(username, function(result){
        if(!result){
            callback(result);
            return;
        }
        callback(result.password, result.salt);
    })
}

module.exports = Account;