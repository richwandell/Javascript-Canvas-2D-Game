/**
 * Game class is the main class that everything will start in
 */
function Game(node) {
	if(node){
		return this;
	}
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

	//Allocate memory
	this.midpoint = new Float32Array(2);
	this.midpoint3d = new Float32Array(3);

	//Create the game objects
	this.objects = new Array();
	this.triangle = new Triangle(this, 'blue');
	this.three_dee_box = new ThreeDeeBox(this);
	this.mouse = new Mouse(this);
	
	//Add game objects to objects array
	this.objects.push(this.triangle);
	this.objects.push(this.three_dee_box);
	this.objects.push(this.mouse);
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
 * 2d matrix multiplication
 * unsafe. no checks, must pass in compatible matrix
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
 */
Game.prototype.mm2d = function(m1, m2, out){
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
 * 3d Matrix multiplication
 * homogeneous coordinates (4 dimensions)
 * 
 * @param {Array} m1 Matrix 1
 * @param {Array} m2 Matrix 2
 * @param {Array} out Output Matrix
 * 
 * 0 = 0*0 + 1*4 + 2*8 + 3*12
 * 1 = 0*1 + 1*5 + 2*9 + 3*13
 * 2 = 0*2 + 1*6 + 2*10 + 3*14
 * 3 = 0*3 + 1*7 + 2*11 + 3*15
 * 
 * 4 = 4*0 + 5*4 + 6*8 + 7*12
 * 5 = 4*1 + 5*5 + 6*9 + 7*13
 * 6 = 4*2 + 5*6 + 6*10 + 7*14
 * 7 = 4*3 + 5*7 + 6*11 + 7*15
 * 
 * 8 = 8*0 + 9*4 + 10*8 + 11*12
 * 9 = 8*1 + 9*5 + 10*9 + 11*13
 * 10 = 8*2 + 9*6 + 10*10 + 11*14
 * 11 = 8*3 + 9*7 + 10*11 + 11*15
 * 
 * 12 = 12*0 + 13*4 + 14*8 + 15*12
 * 13 = 12*1 + 13*5 + 14*9 + 15*13
 * 14 = 12*2 + 13*6 + 14*10 + 15*14
 * 15 = 12*3 + 13*7 + 14*11 + 15*15
 */
Game.prototype.mm3d = function(m1, m2, out){
	var by_2 = 0 | 0, b4n = 0 | 0, mod = 0 | 0;
    for (var i = 0 | 0, _len = out.length; i < _len; i++){
    		mod = i % 4;
    		out[i] = (m1[b4n] * m2[mod])+(m1[b4n+1] * m2[mod+4])+(m1[b4n+2] * m2[mod+8])+(m1[b4n+3] * m2[mod+12]);
  		//console.log(b4n, mod, b4n+1, mod+4, b4n+2, mod+8, b4n+3, mod+12);
  		if(mod === 3){
  			b4n+=4;
  		}
  	}
};
/**
 * Calculate rotation matrix
 * @param {Float32Array} m1
 * @param {Number} angle
 */
Game.prototype.crm2d = function(m1, angle){			
	m1[0] = Math.cos(angle);  m1[2] = -Math.sin(angle);
	m1[1] = Math.sin(angle);  m1[3] = Math.cos(angle);
};
/**
 * Calculate 3d Rotation matrix
 * 
 * @param {Float32Array} m1 Matrix to use for calculation
 * @param {String} abl Alpha beta or lambda
 * @param {Number} angle The angle
 */
Game.prototype.crm3d = function(m1, abl, angle){
	switch(abl){
		case "α": case "alpha":
			m1[0] = 1; m1[1] = 0; m1[2] = 0; m1[3] = 0;
			m1[4] = 0; m1[5] = Math.cos(angle); m1[6] = -Math.sin(angle); m1[7] = 0;
			m1[8] - 0; m1[9] = Math.sin(angle); m1[10] = Math.cos(angle); m1[11] = 0;
			m1[12] = 0; m1[13] = 0; m1[14] = 0; m1[15] = 1;
		break;
		case "β": case "beta":
			m1[0] = Math.cos(angle); m1[1] = 0; m1[2] = Math.sin(angle); m1[3] = 0;
			m1[4] = 0; m1[5] = 1; m1[6] = 0; m1[7] = 0;
			m1[8] = -Math.sin(angle); m1[9] = 0; m1[10] = Math.cos(angle); m1[11] = 0;
			m1[12] = 0; m1[13] = 0; m1[14] = 0; m1[15] = 1;
		break;
		case "λ": case "lambda":
			m1[0] = Math.cos(angle); m1[1] = -Math.sin(angle); m1[2] = 0; m1[3] = 0;
			m1[4] = Math.sin(angle); m1[5] = Math.cos(angle); m1[6] = 0; m1[7] = 0;
			m1[8] = 0; m1[9] = 0; m1[10] = 1; m1[11] = 0;
			m1[12] = 0; m1[13] = 0; m1[14] = 0; m1[15] = 1;
		break;
	}
};
/**
 * Find the midpoint of 2 points
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 */
Game.prototype.mp2d = function(x1, y1, x2, y2){
	this.midpoint[0] = (x1 + x2) / 2;
	this.midpoint[1] = (y1 + y2) / 2;
	return this.midpoint;
};
/**
 * Find 3d Midpoint
 * @param {Float32Array} m Matrix
 * @param {Number} p1 Point 1 in the matrix
 * @param {Number} p2 Point 2 in the matrix
 */
Game.prototype.mp3d = function(m, p1, p2){
	var n = 3 * p1, n1 = 3 * p2;
	this.midpoint3d[0] = (m[n] + m[n1]) / 2;
	this.midpoint3d[1] = (m[n + 1] + m[n1 + 1]) / 2;
	this.midpoint3d[2] = (m[n + 2] + m[n1 + 2]) / 2;
	return this.midpoint3d;
};


if(typeof require !== "undefined"){
	console.log("im probably in node");
	var g = new Game(true);
	var m1 = new Array(
			1.000, 1.000, 1.000, 1.000, 
			1.000, 1.000, 1.000, 1.000, 
			2.000, 2.000, 2.000, 2.000,
			3.000, 3.000, 3.000, 3.000
	);
	var m2 = new Array(
		1.000, 1.000, 1.000, 1.000,
		2.000, 2.000, 2.000, 2.000,
		2.000, 2.000, 3.000, 3.000,
		3.000, 3.000, 3.000, 3.000
	);
	var out = new Array(
		0,0,0,0,
		0,0,0,0,
		0,0,0,0,
		0,0,0,0
	);
	g.mm3d(m1, m2, out);
	console.log(out);
}

