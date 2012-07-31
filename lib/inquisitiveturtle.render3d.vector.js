var inquisitiveturtle = inquisitiveturtle || function() {};
inquisitiveturtle.render3d = inquisitiveturtle.render3d || function() {};


inquisitiveturtle.render3d.vector = function(x,y,z) {
    if (arguments.length === 0)
    {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
    else
    {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }


inquisitiveturtle.render3d.vector.clonecallers = [];

inquisitiveturtle.render3d.vector.prototype.clone = function() {
    return new inquisitiveturtle.render3d.vector(
      this.x,
      this.y,
      this.z
      );
  }




inquisitiveturtle.render3d.vector.prototype.copy = function(vother) {
    if (vother.x)
      this.x = vother.x;
    if (vother.y)
      this.y = vother.y;
    if (vother.z)
      this.z = vother.z;
    return this;
  };




inquisitiveturtle.render3d.vector.prototype.toString = function() {
    return "{" + (this.x!==null?this.x.toFixed(3):'null') + ", " + (this.y!==null?this.y.toFixed(3):'null') + ", " + (this.z!==null?this.z.toFixed(3):'null') + "}";
  };





inquisitiveturtle.render3d.vector.prototype.equals = function(vother, precision) {
    if (!precision)
      precision = 0.00000000000001;
      
    return Math.abs(this.x - vother.x) < precision &&
           Math.abs(this.y - vother.y) < precision &&
           Math.abs(this.z - vother.z) < precision;
  };





inquisitiveturtle.render3d.vector.prototype.add = function(vadd) {
    this.x += vadd.x;
    this.y += vadd.y;
    this.z += vadd.z;
    return this;
  };




inquisitiveturtle.render3d.vector.prototype.sub = function(vadd) {
    this.x -= vadd.x;
    this.y -= vadd.y;
    this.z -= vadd.z;
    return this;
  };




inquisitiveturtle.render3d.vector.prototype.mult = function(vmult) {
    this.x *= vmult.x;
    this.y *= vmult.y;
    this.z *= vmult.z;
    return this;
  };




inquisitiveturtle.render3d.vector.prototype.rotate = function(vrot) {
    if (vrot.x !== 0)
    {
        var yt = this.y;
        var cosrotx = Math.cos(vrot.x);
        var sinrotx = Math.sin(vrot.x);
        this.y = (yt * cosrotx) - (this.z * sinrotx);
        this.z = (yt * sinrotx) + (this.z * cosrotx);
    }
    if (vrot.y !== 0)
    {
        var xt = this.x;
        var cosroty = Math.cos(vrot.y);
        var sinroty = Math.sin(vrot.y);
        this.x = (xt     * cosroty) + (this.z * sinroty);
        this.z = (this.z * cosroty) - (xt     * sinroty);
    }
    if (vrot.z !== 0)
    {
        var zt = this.x;
        var cosrotz = Math.cos(vrot.z);
        var sinrotz = Math.sin(vrot.z);
        this.x = (zt * cosrotz) - (this.y * sinrotz);
        this.y = (zt * sinrotz) + (this.y * cosrotz);
    }
    return this;
  };




inquisitiveturtle.render3d.vector.prototype.length = function() {
    return Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z );
  };




inquisitiveturtle.render3d.vector.prototype.normalize = function() {
    var temp = 1/this.length();
    this.x *= temp;
    this.y *= temp;
    this.z *= temp;
    return this;
  };



inquisitiveturtle.render3d.vector.prototype.dotProduct = function(vother) {
    return ( (this.x * vother.x) + (this.y * vother.y) + (this.z * vother.z) );
  };




inquisitiveturtle.render3d.vector.prototype.crossProduct = function(vother) {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    this.x = ( y * vother.z ) - ( z * vother.y );
    this.y = ( z * vother.x ) - ( x * vother.z );
    this.z = ( x * vother.y ) - ( y * vother.x );

    return this;
  };




inquisitiveturtle.render3d.vector.prototype.angleBetween = function(vother) {
    return Math.acos(Math.min(this.dotProduct(vother), 1));
  };




inquisitiveturtle.render3d.vector.prototype.inRegion = function(planepoint, planenormal) {
    var x = this.x - planepoint.x;
    var y = this.y - planepoint.y;
    var z = this.z - planepoint.z;
    
    return ( ( (x * planenormal.x) + (y * planenormal.y) + (z * planenormal.z) ) > 0);
  };






