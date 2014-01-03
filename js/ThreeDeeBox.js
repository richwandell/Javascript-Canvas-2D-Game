function ThreeDeeBox(game){
     this.game = game;
     this.ctx = game.ctx;
     this.toDraw = [];
     this.vertices = [
          {x:100, y:100, z: 100},
          {x:-100, y:100, z: 100},
          {x:-100, y:-100, z: 100},
          {x:100, y:-100, z: 100},
          {x:100, y:100, z: -100},
          {x:-100, y:100, z: -100},
          {x:-100, y:-100, z: -100},
          {x:100, y:-100, z: -100},
          
          {x: 50, y:40, z: -500, offset:0},
          {x: -50, y:40, z: -500, offset:0},
          {x: -50, y:-40, z: -500, offset:0},
          {x: 50, y:-40, z: -500, offset:0},
          {x: 0, y:0, z: -600, offset:-100},
          
          {x: 0, y:0, z: -400, offset:50},
          {x: 0, y:150, z: -600, offset:-100},
          {x: 150, y:0, z: -600, offset:-100},
          
     ];
     
     this.points = [
          {p:0},
          {p:1},
          {p:2},
          {p:3},
          {p:4},
          {p:5},
          {p:6},
          {p:7}
     ];
     for(var i=0; i < this.points.length; i++){
          var point = this.points[i];
          point.p = this.vertices[point.p];
     }
};

ThreeDeeBox.prototype.update = function(){          
     this.game.mouse.z = this.game.mouse.z > 0 ? this.game.mouse.z : 0;
     this.game.mouse.z = this.game.mouse.z < 25 ? this.game.mouse.z : 25;
     var offset = (this.game.mouse.z)*20;
     
     this.game.camera.ry = -(this.game.triangle.x / this.game.c.width /*- 0.5*/) * Math.PI*2;
     this.game.camera.rx = (this.game.triangle.y / this.game.c.height /*- 0.5*/) * Math.PI;
     
     this.game.camera.y = -Math.sin(this.game.camera.rx)*(700);
     var ryRadius = Math.cos(this.game.camera.rx)*(700);

     this.game.camera.x = Math.sin(this.game.camera.ry) * ryRadius;
     this.game.camera.z = -Math.cos(this.game.camera.ry) * ryRadius;

     for(var i = 0; i < this.vertices.length; i++){
          var vertex = this.vertices[i];
          
          var dx = vertex.x - this.game.camera.x;
          var dy = vertex.y - this.game.camera.y;
          var dz = vertex.z - this.game.camera.z;
          
          var d1x = Math.cos(this.game.camera.ry)*dx + Math.sin(this.game.camera.ry)*dz;
          var d1y = dy;
          var d1z = Math.cos(this.game.camera.ry)*dz - Math.sin(this.game.camera.ry)*dx;
          
          var d2x = d1x;
          var d2y = Math.cos(this.game.camera.rx)*d1y - Math.sin(this.game.camera.rx)*d1z;
          var d2z = Math.cos(this.game.camera.rx)*d1z + Math.sin(this.game.camera.rx)*d1y;
          
          var d3x = Math.cos(this.game.camera.rz)*d2x + Math.sin(this.game.camera.rz)*d2y;
          var d3y = Math.cos(this.game.camera.rz)*d2y - Math.sin(this.game.camera.rz)*d2x;
          var d3z = d2z;
               
          var scale = this.game.camera.depth / d3z;    
          vertex.posX = (this.game.c.width / 2) - (scale * d3x + this.game.camera.offsetX);
          vertex.posY = (this.game.c.height / 2) - (scale * d3y + this.game.camera.offsetY);
          vertex.posZ = scale;
     }
     
     this.toDraw = [];
     for(var i = 0; i < this.points.length; i++){
          var point = this.points[i];
          if(point.p.posZ){
               this.toDraw.push({
                    type: "point",
                    posX: point.p.posX,
                    posY: point.p.posY,
                    posZ: point.p.posZ,
                    color: point.c || "red",
               });
          }
     }
     
     this.toDraw.sort(function(a, b){
          return a.posZ - b.posZ;
     });
     
};

ThreeDeeBox.prototype.draw = function(){
     this.update();
     this.ctx.strokeStyle = "red";
     this.ctx.font = "20px Sans-Serif";
     this.ctx.textBaseline = "middle";
     this.ctx.textAlign = "center";
     this.ctx.lineWidth = "2";
     
     for(var i = 0; i < this.toDraw.length; i++){
          var item = this.toDraw[i];
          this.ctx.beginPath();
          this.ctx.fillStyle = item.color;
          
          var x1 = item.posX - 15 * item.posZ,
          y1 = item.posY - 15 * item.posZ,
          x2 = 10*item.posZ,
          y2 = 10*item.posZ;
          
          this.ctx.fillRect(x1, y1, x2, y2);
          //this.ctx.arc(x1, y1, 2, 0, 6.283185307179586);
     }
     //this.ctx.fill();
};

