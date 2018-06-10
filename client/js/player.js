var Types = require('../../shared/js/types'),
    Character = require('./character'),
    Sprite = require('./sprite'),
    Map = require('./mapClient'),
    Input = require('./input'),
    Message = require('./message'),
    PlayerModel = require('../../shared/js/playerModel'),
    _ = require('underscore')
    
module.exports = Player = class Player extends Character {
    constructor(id, name, x, y, mapName){
        super(id, name, x, y, Types.Sprites.PLAYER0);
        this.map = new Map(mapName);
        Input.init();
    }

    update(dt){
        this.applyInputs(dt);
    }

    applyInputs(dt){
        var vector = Input.getVector();
        var isStationary = vector[0] == 0 && vector[1] == 0;

        if(!isStationary){
            var position = PlayerModel.move(this, vector, dt); 
            this.setPosition(position.x, position.y);
            new Message.Move(this, vector, dt).send();
        }
    }
}