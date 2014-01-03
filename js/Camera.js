function Camera(game){     
     this.x = 0;
     this.y = 0;
     this.z = 400;
     this.rx = 0;
     this.ry = 0;
     this.rz = 0;
     this.depth = 350;
     this.game = game;
     this.ctx = game.ctx;
     //this.screen: Demo.ctx,
     this.width = game.c.width;
     this.height = game.c.height;
     this.offsetX = game.c.width/2;
     this.offsetY = game.c.height/2;
}