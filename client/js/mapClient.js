var MAP_PATH = "/client/assets/maps/";

module.exports = Map = class Map {
    constructor(imagePath){
        var self = this;
        this.image = new Image();
        this.image.src = MAP_PATH+imagePath+".png";
        this.isLoaded = false;
        this.image.onload = function(){
            self.isLoaded = true;
        }
    }

    get Image(){
        if(this.isLoaded){
            return this.image;
        }else{
            console.warn("Map image not loaded yet...");
        }
    }
}