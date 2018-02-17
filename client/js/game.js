var Renderer = require('./renderer')
  
var FPS = 1/60; // 60hz

module.exports = Game = class Game{
  constructor(){
    this.running = false;
    this.player = null;
    this.renderer = new Renderer();
    this.loop = null; // Will be the interval that handles updating.

    this.start();
  }

  start(){
    if(this.running){
      console.error('Game is already running, but is attempting to start.');
    }

    this.renderer.start();

    var gameLoop = setInterval(this.tick.bind(this), this.FPS);
  }

  tick(){}
}
