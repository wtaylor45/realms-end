var SPRITE_PATH = "/client/assets/sprites/";

module.exports = Sprite = class Sprite {
    constructor(type){
        var self = this;
        this.spritePath = SPRITE_PATH+type+".png";
        this.sprite = new Image();
        this.sprite.src = this.spritePath;
        this.isLoaded = false;
        this.sprite.onload = function(){
            self.width = this.width;
            self.height = this.height;
            self.isLoaded = true;
        }
    }

    get Image(){
        return this.sprite;
    }
}