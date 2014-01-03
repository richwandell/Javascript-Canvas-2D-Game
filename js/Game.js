/**
 * Game class is the main class that everything will start in
 */
function Game() {
	//Context reference
	var game = this;

	//Canvas
	this.c = document.getElementsByTagName("canvas")[0];
	this.c.style.cursor = "none";
	this.ctx = this.c.getContext('2d');
	
	this.camera = new Camera(this);

	//Set Resolution
	this.c.width = screen.width;
	this.c.height = screen.height;
	this.bounding_box = this.c.getBoundingClientRect();

	//Create the game objects
	this.objects = new Array();
	this.triangle = new Triangle(this, 'blue');
	this.mouse = new Mouse(this);
	this.three_dee_box = new ThreeDeeBox(this);
	
	//Add game objects to objects array
	this.objects.push(this.mouse);
	this.objects.push(this.triangle);
	this.objects.push(this.three_dee_box);
	//this.objects.push(new Line(this, this.triangle, this.mouse));

	//Setup event handlers
	this.c.addEventListener('mousemove', function(e) {
		game.mouse.getMousePos(e);
	});
	this.c.addEventListener('mouseup', function(e) {
		game.mouse.fireWeapon(e);
	});
};

/**
 * Only drawing methods are called by the main loop on each logic tick.
 */
Game.prototype.mainLoop = function() {
	this.ctx.clearRect(0, 0, this.c.width, this.c.height);
	for (var x = 0; x < this.objects.length; x++) {
		this.objects[x].draw();
	}

	var game = this;
	window.requestAnimationFrame(function(timestamp) {
		game.mainLoop();
	});
};

/**
 * Fast matrix multiplication
 * very unsafe. no checks, must pass in compatible matrix
 * Matrix should have allocated memory before passing them into this
 * method, Also output matrix should be pre allocated.
 *  
 * @param {Array} m1 Matrix 1
 * @param {Array} m2 Matrix 2
 * @param {Array} out Output Matrix
 * 
 * 0 = 0*0 + 2*1
 * 1 = 1*0 + 3*1
 * 2 = 0*2 + 2*3
 * 3 = 1*2 + 3*3
 * 4 = 0*4 + 2*5
 * 5 = 1*4 + 3*5
 */
Game.prototype.mm = function(m1, m2, out){
	var by_2 = 0, by_2_b = 0, mod = 0;
     for (var i = 0, _len = out.length; i < _len; i++){
    		mod = i % 2;
  		out[i] = (m1[mod] * m2[by_2]) + (m1[mod+2] * m2[by_2+1]);
  		if(by_2_b === 1){
  			by_2_b = 0;
  			by_2 += 2;
  		}else{
  			by_2_b += 1;
  		}
  	}	
};
/**
 * Calculate rotation matrix
 * @param {Float32Array} m1
 * @param {Number} angle
 */
Game.prototype.calcRotationMatrix = function(m1, angle){			
	m1[0] = Math.cos(angle);  m1[2] = -Math.sin(angle);
	m1[1] = Math.sin(angle);  m1[3] = Math.cos(angle);
};
