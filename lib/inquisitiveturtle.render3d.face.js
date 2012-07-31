var inquisitiveturtle = inquisitiveturtle || function() {};
  
inquisitiveturtle.render3d = inquisitiveturtle.render3d || function() {};
  
if (typeof inquisitiveturtle.render3d.vector == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.vector.js' before including 'inquisitiveturtle.render3d.face.js'";
  



inquisitiveturtle.render3d.face = function() {
    this.__vector = inquisitiveturtle.render3d.vector;

    this.init();
  };




inquisitiveturtle.render3d.face.prototype.init = function() {
    this.points = [];
    this.normal = new this.__vector();
    this.color = new this.__vector();
  };




inquisitiveturtle.render3d.face.prototype.setPoints = function(points) {
    this.points = points;
    return this;  
  };




inquisitiveturtle.render3d.face.prototype.getPoints = function() {
    return this.points;
  };




inquisitiveturtle.render3d.face.prototype.calcNormal = function() {

    var world0 = this.points[0].world;
    var world1 = this.points[1].world;
    var world2 = this.points[2].world;
    
    var v1x = world1.x - world2.x;
    var v1y = world1.y - world2.y;
    var v1z = world1.z - world2.z;
    
    var v2x = world1.x - world0.x;
    var v2y = world1.y - world0.y;
    var v2z = world1.z - world0.z;

    this.normal.x = ( v1y * v2z ) - ( v1z * v2y );
    this.normal.y = ( v1z * v2x ) - ( v1x * v2z );
    this.normal.z = ( v1x * v2y ) - ( v1y * v2x );
    
    this.normal.normalize();
    return this;
  };




inquisitiveturtle.render3d.face.prototype.setColor = function(color) {
    this.color = color;
    return this;
  };




inquisitiveturtle.render3d.face.prototype.getColor = function() {
    return this.color;
  };




inquisitiveturtle.render3d.face.prototype.resetSpares = function() {
    this._sparesIndex = 0;
  };
  
  
inquisitiveturtle.render3d.face.prototype.getSpare = function() {
    if (!this._spares)
      this._spares = [];
      
    if (this._sparesIndex === 0)
      this._sparesIndex = 0;
      
    if (this._sparesIndex >= this._spares.length)
    {
      this._spares[this._sparesIndex] = new this.__vector();
    }
    return this._spares[this._sparesIndex++];
  };




inquisitiveturtle.render3d.face.prototype.clipTo = function( points, planepoint, planenormal ) {
    // SutherlandHodgmanPolygonClip
    // From Computer Graphics Principles and Practice, second edition, pg 128
    
    // Added caching so we don't call inRegion more than once
    
    var inLength = points.length;
    
    var s,p;  // Start, end points of current polygon edge
    var i;    // Intersection point with a clip boundary
    
    var output = [];
    
    if (inLength === 0)
      return output;
    
    s = points[inLength-1];
    s.__tmp_inRegion = s.inRegion(planepoint, planenormal);
    for (var j = 0; j < inLength; j++)
    {
      p = points[j];
      
      p.__tmp_inRegion = p.inRegion(planepoint, planenormal);
      if (p.__tmp_inRegion)
      {
        if (s.__tmp_inRegion)
        {
          output.push(p);
        }
        else
        {
          i = this.lineIntersect(s, p, planepoint, planenormal, this.getSpare());
          output.push(i);
          output.push(p);
        }
      }
      else
      {
        if (s.__tmp_inRegion)
        {
          i = this.lineIntersect(s, p, planepoint, planenormal, this.getSpare());
          output.push(i);
        }
      }
      
      s = p;
    }
    
    return output;
  };




inquisitiveturtle.render3d.face.prototype.lineIntersect = function( linepointA, linepointB, planepoint, planenormal, ret ) {
    // http://en.wikipedia.org/wiki/Line-plane_intersection @11:09, 31 January 2009
    
    var pnx = planenormal.x;
    var pny = planenormal.y;
    var pnz = planenormal.z;

    var lax = linepointA.x;
    var lay = linepointA.y;
    var laz = linepointA.z;
    
    var d = (planepoint.x * pnx) + (planepoint.y * pny) + (planepoint.z * pnz);
    var num = d - (pnx * lax) - (pny * lay) - (pnz * laz);
    var den = (pnx * (linepointB.x - lax)) + (pny * (linepointB.y - lay)) + (pnz * (linepointB.z - laz));

    if (num === 0 && den === 0)
      return linepointA; // Entire line in is plane

    if (den === 0)
      return null; // Line is parallel to plane

    var t = num/den;
    
    ret.x = linepointA.x + ( (linepointB.x - linepointA.x) * t );
    ret.y = linepointA.y + ( (linepointB.y - linepointA.y) * t );
    ret.z = linepointA.z + ( (linepointB.z - linepointA.z) * t );
    return ret;
  };





