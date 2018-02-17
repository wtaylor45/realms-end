

module.exports = Renderer = class Renderer{
  constructor(fps){
    this.fps = fps;
    this.running;
    this.canvas = null;
    this.ctx = null; // The canvas context used for rendering
    this.nextTick = null; // The next animation frame that will be requested
    this.font = "Cinzel" // Default font to use
    this.lastUpdate = null; 
    this.frameCount = 0;
    this.realFPS = 0;
    this.WIDTH = null;
    this.HEIGHT = null;
    this.options = {
      showFPS: true
    }

    this.init();
  }

  init(){
    // Let's create the canvas here...
    this.WIDTH = $('#game').width();
    this.HEIGHT = $('#game').height();
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.ctx = this.canvas.getContext('2d');
    document.getElementById('game').append(this.canvas);
  }

  start(){
    if(this.running){
      console.warn('Renderer already running, but attempting to be started again.');
    }

    this.running = true;

    this.tick();
  }

  tick(){
    if(!this.running) return;
    this.clearCanvas();
    this.drawBackground();

    if(this.options.showFPS) this.drawFPS();

    window.requestAnimationFrame(this.tick.bind(this));
  }

  clearCanvas(){
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
  }

  drawText(text, x, y, size, font, color){
    if(!text) console.error('No text to draw.');
    if(!x || !y) console.error('Need the x and y coordinates of where to draw text.');

    var size = size || 12;
    var font = font || this.font;
    
    this.ctx.font = size+"px "+font;
    this.ctx.fillStyle = color || "white";
    this.ctx.fillText(text, x+size, y+size)
  }

  drawFPS(){
    var dt = Date.now() - this.lastUpdate;

    // Has it been > 1 second?
    if(dt >= 1000){
      this.realFPS = this.frameCount;
      this.frameCount = 0;
      this.lastUpdate = Date.now();
    }

    this.frameCount++;

    this.drawText("FPS: "+this.realFPS, 10, 10, 12, null, "yellow");
  }

  drawBackground(){
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
  }

  /** 
   * Stop rendering and leave everything as it appears on screen when called. 
   */
  freeze(){
    if(!this.running) console.warn('Renderer already frozen.');
    this.running = false;
  }

  /**
   * Continue rendering new frames.
   */
  unfreeze(){
    if(this.running) console.warn('Renderer already running.')
    this.running = true;
  }
}
