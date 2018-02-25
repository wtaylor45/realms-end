var Sprite = require('./sprite'),
    EntityModel = require('../../shared/js/entityModel')

module.exports = Entity = class Entity {
    constructor(id, x, y, sprite){
        this.id = id;
        this.x = x;
        this.y = y;
        this.sprite = new Sprite(sprite);
        this.model = new EntityModel(this);
    }

    getSprite(){
        return this.sprite.Image;
    }
}