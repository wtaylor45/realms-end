var Sprite = require('./sprite')

module.exports = Entity = class Entity {
    constructor(x, y, sprite){
        this.x = x;
        this.y = y;
        this.sprite = new Sprite(sprite);
    }

    getSprite(){
        return this.sprite.Image;
    }
}