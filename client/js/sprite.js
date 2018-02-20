var SPRITE_PATH = "/client/assets/sprites/";

module.exports = Sprite = class Sprite {
    constructor(type){
        var self = this;
        this.spritePath = SPRITE_PATH+type+".png";
        this.sprite = new Image();
        this.sprite.src = this.spritePath;
        this.isLoaded = false;
        this.sprite.onload = function(){
            self.isLoaded = true;
        }
    }

    get Image(){
        return this.sprite;
    }
}