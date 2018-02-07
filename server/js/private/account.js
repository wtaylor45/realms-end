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
            connection.emit(Types.Messages.LOGIN, {success: false});
            return;
        }
        Account.encryptPassword(data.password, salt, function(hashResult){
            if(hashResult == password){
                Logger.debug(data.username, "has successfully logged in.");
                connection.emit(Types.Messages.LOGIN, {success: true});
            }else{
                connection.emit(Types.Messages.LOGIN, {success: false});
            }
        });
    });
}

Account.register = function(data, connection){
    Account.findUser(data.username, function(result){
        if(result){
            var reason = "Username already taken.";
            connection.emit(Types.Messages.REGISTER, {"success": false, "reason": reason});
            Logger.debug("Username " + data.username + " already taken.");
            return;
        }

        Account.registerUser(data);
    });
}

Account.registerUser = function(data){
    Account.getSalt(function(salt){
        Account.encryptPassword(data.password, salt, function(password, salt){
            var account = Account.SCHEMA;
    
            account = _.mapObject(account, function(val, key){
                return data[key] || account[key];
            })
    
            account.password = password;
            account.salt = salt;
            Logger.debug(password);
            DB.writeToTable(Account.USERS, account);
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