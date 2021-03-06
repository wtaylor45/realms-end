var Renderer = require('./renderer'),
    Player = require('./player'),
    Socket = require('./socket')
  
var FPS = 1/60; // 60hz

module.exports = Game = class Game{
  constructor(playerData){
    var self = this;
    this.running = false;
    this.player = this.createPlayer(playerData);
    this.renderer = new Renderer(this);
    this.loop = null; // Will be the interval that handles updating.
    this.entities = {}; // All entities currently in player's area
    this.mobs = {}; // All mobs in player's area
    this.players = {}; // All players in player's area
    this.messageQueue = [];

    var readyInterval = setInterval(function(){
      if(self.player.sprite.isLoaded && self.player.map.isLoaded){
        clearInterval(readyInterval);
        self.start();
      }
    }, 10);

    Socket.on(Types.Messages.UPDATE, function(message){
      this.messageQueue.push(message.messages);
    });
  }

  start(){
    if(this.running){
      console.error('Game is already running, but is attempting to start.');
    }

    this.renderer.start();
    this.lastUpdate = Date.now();
    var gameLoop = setInterval(this.tick.bind(this), this.FPS);
  }

  tick(){
    // Calculate delta time in ms
    var dt = (Date.now() - this.lastUpdate)/1000;
    this.player.update(dt);
    this.lastUpdate = Date.now();
  }

  createPlayer(data){
    var player = new Player(data.id, data.name, data.x, data.y, data.mapName);
    player.setStats(data.stats);
    return player;
  }
}
