

module.exports = PlayerModel = class PlayerModel extends CharacterModel {
    constructor(player){
        super(player);
        this.player = player;
    }

    move(vector, dt){
        var x = this.player.x+this.player.stats.curSpeed*dt*vector[0];
        var y = this.player.y+this.player.stats.curSpeed*dt*vector[1];
        
        this.setPosition(x, y);
    }
}