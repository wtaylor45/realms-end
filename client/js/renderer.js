var _ = require('underscore');

module.exports = Renderer = class Renderer{
  constructor(game, options){
    this.running = false; // Is the renderer currently updating
    this.canvas = null; // The canvas we render on to
    this.ctx = null; // The canvas context used for rendering
    this.nextTick = null; // The next animation frame that will be requested
    this.font = "Cinzel" // Default font to use
    this.lastUpdate = null; // Time of the last update of FPS
    this.frameCount = 0;
    this.realFPS = 0; // The actual amount of frames per second
    this.WIDTH = null; // The width of the canvas
    this.HEIGHT = null; // The height of the canvas
    this.game = game;
    // A list of options for what the renderer should/shouldn't draw
    options = options || {};
    this.options = {
      showFPS: options.showFPS || true,
      renderScale: options.renderScale || 2
    }
    this.renderScale = this.options.renderScale;

    this.init(); // Start 'er up
  }

  /**
   * Initialize the renderer.
   */
  init(){
    // Let's create the canvas here...
    this.WIDTH = $('#game').width();
    this.HEIGHT = $('#game').height();
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.ctx = this.canvas.getContext('2d');
    document.getElementById('game').append(this.canvas);

    this.ctx.mozImageSmoothingEnabled = false;	
    this.ctx.msImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    //Listen for resize 
    window.addEventListener('resize', this.onResize.bind(this));
  }

  setRenderScale(scale){
    this.renderScale = scale;
  }

  /**
   * Start rendering.
   */
  start(){
    if(this.running){
      console.warn('Renderer already running, but attempting to be started again.');
    }

    this.running = true;

    this.tick();
  }

  /**
   * What to do every time a new frame is to be rendered.
   */
  tick(){
    if(!this.running) return;
    this.clearCanvas();
    this.drawBackground();
    this.drawMapLow();
    this.drawEntities();
    this.drawPlayer();

    if(this.options.showFPS) this.drawFPS();

    window.requestAnimationFrame(this.tick.bind(this));
  }

  /** 
   * Clear the canvas and all of its contents. 
   */
  clearCanvas(){
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
  }

  drawMapLow(){
    var map = this.game.player.map.Image;
    var width = map.width*this.renderScale;
    var height = map.height*this.renderScale;
    this.ctx.drawImage(map,0,0, width, height);
  }

  drawEntities(){
    _.each(this.game.entities, this.drawEntity);
  }

  drawPlayer(){
    this.drawEntity(this.game.player);
  }

  /**
   * Draw an entity.
   * 
   * @param {Object}  entity  The entity to be drawn.    
   */
  drawEntity(entity){
    var sprite = entity.getSprite();
    var width = sprite.width*this.renderScale;
    var height = sprite.height*this.renderScale;
    this.ctx.drawImage(sprite, entity.x, entity.y, width, height);
  }

  /**
   * Draw the provided text on the canvas.
   * 
   * @param {string}  text    The text to be added to the canvas.
   * @param {number}  x       The x coordinate of the text to be drawn.
   * @param {number}  y       The y coordinate of the text to be drawn. 
   * @param {number}  size    The size in pixels of the text to be drawn.
   * @param {string}  color   The color of the text to be drawn.    
   */
  drawText(text, x, y, size, font, color){
    if(!text) console.error('No text to draw.');
    if(!x || !y) console.error('Need the x and y coordinates of where to draw text.');

    var size = size || 12;
    var font = font || this.font;
    
    this.ctx.font = size+"px "+font;
    this.ctx.fillStyle = color || "white";
    this.ctx.fillText(text, x+size, y+size)
  }

  /**
   * Draw the frames per second on the canvas.
   */
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
  /**
   * Draw a black background on the entire canvas.
   */
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

  setCanvasWidth(width){
    this.WIDTH = this.canvas.width = width;
  }

  setCanvasHeight(height){
    this.HEIGHT = this.canvas.height = height;
  }

  onResize(){
    this.setCanvasWidth($('#game').width());
    this.setCanvasHeight($('#game').height());
    this.ctx.mozImageSmoothingEnabled = false;	
    this.ctx.msImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
  }
}
