var crypto = require('crypto'),
    _ = require('underscore'),
    DB = require('./db')

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
    Account.validateCredentials(data.username, data.password, function(results){
        if(!results || results.length == 0){
            Logger.log('No account with credentials found.');
            connection.emit(Types.Messages.LOGIN, {success: false});
            return;
        } 

        connection.emit(Types.Messages.LOGIN, {success: true});
    })
}

Account.register = function(data, connection){
    Account.checkDuplicateUsername(data, function(result){
        var success = result.length==0;
        var reason = success ? null : "Username already taken.";
        connection.emit(Types.Messages.REGISTER, {"success": success, "reason": reason});

        //TODO: Log them in if successful. 
        if(!success){
            Logger.debug("Username " + data.username + " already taken.");
            return;
        }

        Account.registerUser(data);
    });
}

Account.validateCredentials = function(username, password, callback){
    if(!DB) throw "No connection to database currently.";
    
    DB.queryTable(Account.USERS, {"username": username, "password": password}, callback);
}

Account.checkDuplicateUsername = function(credentials, callback){
    if(!DB) throw "No connection to database currently.";

    DB.queryTable(Account.USERS, {"username": credentials.username}, callback);
}

Account.registerUser = function(data){
    Account.encryptPassword(data.password, function(password, salt){
        var account = Account.SCHEMA;

        _.mapObject(account, function(val, key){
            return data[key] || account[key];
        })

        account.password = password;
        account.salt = salt;

        DB.writeToTable(Account.USERS, account);
    });
}

Account.encryptPassword = function(password, callback){
    crypto.randomBytes(32, function(err, salt){
        crypto.pbkdf2(password, salt.toString('base64'), 2000, 64, 'sha256', function(err, result){
            callback(result, salt);
        })
    });
}

module.exports = Account;