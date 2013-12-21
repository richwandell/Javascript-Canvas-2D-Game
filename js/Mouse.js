/**
 * Mouse Class
 */
function Mouse(game) {
	this.game = game;
	this.ctx = game.ctx;
	this.x = 0;
	this.y = 0;
	//Center point
	this.center = new Float32Array(2);
	//All points
	this.points = new Array(2);
	//X coordinates
	this.points[0] = new Float32Array(12);
	//Y coordinates
	this.points[1] = new Float32Array(12);
	//Bounding box
	this.bounding_box = new Float32Array(4);
	//Radius
	this.radius = 40;
	this.firing = false;
	this.pew_sound = document.getElementById("pew_sound");
};
/**
 * Finds the current mouse position. This is an event callback for moving the mouse
 * @param {Event} e 
 */
Mouse.prototype.getMousePos = function(evt) {
	this.x = evt.clientX;
	this.y = evt.clientY;
	this.center[0] = this.x;
	this.center[1] = this.y;
};
/**
 * Draw mouse method will draw the mouse based on it's current coordinates
 * This method can be called within the main loop
 */
Mouse.prototype.draw = function() {
	this.update();
	this.ctx.beginPath();
	this.ctx.lineWidth = 10;	
	//Draw circle
	this.ctx.arc(this.x, this.y, this.radius, 0, 6.283185307179586);
	//Draw left tick mark
	this.ctx.moveTo(this.points[0][0], this.points[1][0]);
	this.ctx.lineTo(this.points[0][1], this.points[1][1]);
	//Draw right tick mark
	this.ctx.moveTo(this.points[0][2], this.points[1][2]);
	this.ctx.lineTo(this.points[0][3], this.points[1][3]);
	//Draw upper tick mark
	this.ctx.moveTo(this.points[0][4], this.points[1][4]);
	this.ctx.lineTo(this.points[0][5], this.points[1][5]);
	//Draw lower tick mark
	this.ctx.moveTo(this.points[0][6], this.points[1][6]);
	this.ctx.lineTo(this.points[0][7], this.points[1][7]);
	//Stroke and set context linewidth
	this.ctx.stroke();	
	this.ctx.lineWidth = 3;
	//Draw plus in center
	this.ctx.moveTo(this.points[0][8], this.points[1][8]);
	this.ctx.lineTo(this.points[0][9], this.points[1][9]);
	this.ctx.moveTo(this.points[0][10], this.points[1][10]);
	this.ctx.lineTo(this.points[0][11], this.points[1][11]);	
	this.ctx.stroke();
};
/**
 * Weapon firing callback sets radius to 0 and sets firing flag
 * @param {Event} e
 */
Mouse.prototype.fireWeapon = function(e) {
	this.pew_sound.load();
	this.pew_sound.play();
	this.firing = true;
	this.radius = 0;
	this.temp_size = [this.game.triangle.width, this.game.triangle.height];
};
Mouse.prototype.update = function() {
	if (this.firing) {
		if (this.radius < 40) {
			this.radius += 3;
		} else {
			this.firing = false;
		}
	}
	//Calc left tick mark
	this.points[0][0] = this.x - this.radius - 10;
	this.points[1][0] = this.y;
	this.points[0][1] = this.points[0][0] + 20;
	this.points[1][1] = this.points[1][0];
	//Calc right tick mark
	this.points[0][2] = this.x + this.radius + 10;
	this.points[1][2] = this.points[1][1];
	this.points[0][3] = this.points[0][2] - 20;
	this.points[1][3] = this.points[1][2];
	//Calc upper tick mark
	this.points[0][4] = this.x;
	this.points[1][4] = this.y - this.radius - 10;
	this.points[0][5] = this.points[0][4];
	this.points[1][5] = this.points[1][4] + 20;
	//Calc lower tick mark
	this.points[0][6] = this.points[0][5];
	this.points[1][6] = this.y + this.radius + 10;
	this.points[0][7] = this.points[0][6];
	this.points[1][7] = this.points[1][6] - 20;
	//Calc plus in center
	this.points[0][8] = this.points[0][1];
	this.points[1][8] = this.points[1][3];
	this.points[0][9] = this.points[0][3];
	this.points[1][9] = this.points[1][8];
	this.points[0][10] = this.points[0][7];
	this.points[1][10] = this.points[1][5];
	this.points[0][11] = this.points[0][10];
	this.points[1][11] = this.points[1][7];
	
	this.bounding_box[0] = this.x - this.radius - 10;
	this.bounding_box[1] = this.y - this.radius - 10;
	this.bounding_box[2] = this.x + this.radius + 10;
	this.bounding_box[3] = this.y + this.radius + 10;
}; 