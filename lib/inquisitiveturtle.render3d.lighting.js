if (typeof inquisitiveturtle == "undefined")
  inquisitiveturtle = function() {}
  
if (typeof inquisitiveturtle.render3d == "undefined")
  inquisitiveturtle.render3d = function() {}
  
if (typeof inquisitiveturtle.render3d.vector == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.vector.js' before including 'inquisitiveturtle.render3d.lighting.js'";
  

inquisitiveturtle.render3d.lighting = function() {
  this.__vector = inquisitiveturtle.render3d.vector;
  
  this.ambient = new this.__vector( 0.2, 0.2, 0.2 );
  this.suns = [
    {
      color: new this.__vector( 1, 1, 1 ),
      position: new this.__vector(1,1,1).normalize()
    }];
  
}



inquisitiveturtle.render3d.lighting.prototype.lightSurface = function( facecolor, facenormal, res ) {

  res.x = 0;
  res.y = 0;
  res.z = 0;
  var sun;
  var suncount = this.suns.length;
  
  for (var i = 0, ii = suncount; i < ii; i++)
  {  
    sun = this.suns[i];
    var lightAngle = Math.PI-facenormal.angleBetween(sun.position);
    
    var co = Math.max(lightAngle/Math.PI) / suncount;
    res.x += (sun.color.x * co);
    res.y += (sun.color.y * co);
    res.z += (sun.color.z * co);
  }
  
  res.x = Math.max(res.x, this.ambient.x);
  res.y = Math.max(res.y, this.ambient.y);
  res.z = Math.max(res.z, this.ambient.z);

  res.mult(facecolor);

  return res;
}

