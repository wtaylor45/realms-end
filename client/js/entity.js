var Sprite = require('./sprite'),
    EntityModel = require('../../shared/js/entityModel')

module.exports = Entity = class Entity {
    constructor(id, x, y, sprite){
        this.id = id;
        this.x = x;
        this.y = y;
        this.sprite = new Sprite(sprite);
    }

    getSprite(){
        return this.sprite.Image;
    }

    setPosition(x, y){
        EntityModel.setPosition(this, x, y);
    }

    setLocation(x, y, mapName){
        EntityModel.setLocation(this, x, y, mapName);
    }
}