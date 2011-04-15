if (typeof inquisitiveturtle == "undefined")
  inquisitiveturtle = function() {}
  
if (typeof inquisitiveturtle.render3d == "undefined")
  inquisitiveturtle.render3d = function() {}
  
if (typeof inquisitiveturtle.render3d.lighting == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.lighting.js' before including 'inquisitiveturtle.render3d.world.js'";
  


inquisitiveturtle.render3d.world = function() {

  this.prims = [];
  this.lighting = new inquisitiveturtle.render3d.lighting();
    
}


