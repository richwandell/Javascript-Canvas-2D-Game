function Line(game, first, second){
	this.game = game;
	this.ctx = game.ctx;
	this.first = first;
	this.second = second;
};

Line.prototype.draw = function(){
	this.ctx.beginPath();
	this.ctx.lineWidth = 1;
	this.ctx.moveTo(this.first.center[0], this.first.center[1]);
	this.ctx.lineTo(this.second.center[0], this.second.center[1]);
	this.ctx.fillStyle = 'black';
	this.ctx.stroke();
};
