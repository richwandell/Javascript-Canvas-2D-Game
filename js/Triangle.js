/**
 * Triangel class requires a context containing class
 * @param {Game} game The context for this object
 * @param {String} color The color
 */
function Triangle(game, color) {
	this.game = game;
	this.color = color;
	this.ctx = game.ctx;

	this.angle = 0;
	//Speed
	this.speed = 10;
	//Moving Right?
	this.up = false;
	//Moving left?
	this.left = false;
	//Upper left corner
	this.x = 0;
	this.y = 0;
	//Center point
	this.center = new Float32Array(2);
	//Width from center point is around 7% of the screen width
	this.width = 0.072916 * this.game.c.width;
	//Height from center point is around 2% of the screen height
	this.height = 0.027 * this.game.c.height;
	//Am I Moving?
	this.moving = false;
	//Array of points for this triangle
	this.points = new Float32Array(6);
	//Temp points used durring matrix transformation
	this.ttp = new Float32Array(6);
	//Temp points used durring matrix rotation/scaling
	this.rtp = new Float32Array(6);
	//Matrix points
	this.m1 = new Float32Array(4);
};
/**
 * Translates the points from their position to points around the origin.
 */
Triangle.prototype.translateToOrigin = function(){
	//Translate to origin
	this.ttp[0] = this.points[0] - this.center[0];
	this.ttp[1] = this.points[1] - this.center[1];
	this.ttp[2] = this.points[2] - this.center[0];
	this.ttp[3] = this.points[3] - this.center[1];
	this.ttp[4] = this.points[4] - this.center[0];
	this.ttp[5] = this.points[5] - this.center[1];
};
/**
 * Translates back from the origin to the original distance from the origin
 */
Triangle.prototype.translateBack = function(){	
	//Translate back
	this.points[0] = this.rtp[0] + this.center[0];
	this.points[1] = this.rtp[1] + this.center[1];
	this.points[2] = this.rtp[2] + this.center[0];
	this.points[3] = this.rtp[3] + this.center[1];
	this.points[4] = this.rtp[4] + this.center[0];
	this.points[5] = this.rtp[5] + this.center[1];	
};
/**
 * Scales the triangle by x in the x direction and y in the y direction
 * @param {Number} x The x scaling number
 * @param {Number} y The y scaling number
 */
Triangle.prototype.scale = function(x, y){
	this.width += x;
	this.height += y;
};

/**
 * Rotates the triangle clockwise 
 * - First we calculate the rotation matrix
 * - Then we translate the triangle back to the origin
 * - Multiply the rotation matrix by the points matrix
 * - Translate the triangle back into position
 */
Triangle.prototype.rotate = function(){		
	this.game.crm2d(this.m1, this.angle);
	this.translateToOrigin();
	this.game.mm2d(this.m1, this.ttp, this.rtp);
	this.translateBack();	
};

/**
 * Update the triangle 1 logic tick
 */
Triangle.prototype.update = function() {
	if (this.x > this.game.c.width) {
		this.left = true;
	} else if (this.x < 0) {
		this.left = false;
	}
	if (this.y > this.game.c.height) {
		this.up = true;
	} else if (this.y < 0) {
		this.up = false;
	}

	if (this.up == false) {
		this.y += this.speed;
	} else {
		this.y -= this.speed;
	}
	if (this.left == false) {
		this.x += this.speed;
	} else {
		this.x -= this.speed;
	}
	var xh = this.x;
	var yh = this.y;
	this.center[0] = xh + (this.width / 2);
	this.center[1] = yh + (this.height / 2);
	this.points[0] = xh;
	this.points[1] = yh;
	this.points[2] = xh + this.width;
	this.points[3] = yh + this.height;
	this.points[4] = xh;
	this.points[5] = yh + this.height;
	 
	this.calculateAngle();
	this.rotate();
};
/**
 * Calculates the angle from the triangle to the mouse cursor
 */
Triangle.prototype.calculateAngle = function(){
	var dy = this.game.mouse.y - this.y;
	var dx = this.game.mouse.x - this.x;
	this.angle = Math.atan2(dy, dx);
};
/**
 * Draw the triangle.
 */
Triangle.prototype.draw = function() {
	this.update();
	this.ctx.beginPath();

	this.ctx.moveTo(this.points[0], this.points[1]);
	this.ctx.lineTo(this.points[2], this.points[3]);
	this.ctx.lineTo(this.points[4], this.points[5]);
	this.ctx.fillStyle = this.color;
	this.ctx.fill();
	
}; 