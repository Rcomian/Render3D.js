var inquisitiveturtle = inquisitiveturtle || function() {};
inquisitiveturtle.render3d = inquisitiveturtle.render3d || function() {};

if (typeof inquisitiveturtle.render3d.vector == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.vector.js' before including 'inquisitiveturtle.render3d.prim.js'";

if (typeof inquisitiveturtle.render3d.vector == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.face.js' before including 'inquisitiveturtle.render3d.prim.js'";






inquisitiveturtle.render3d.prim = function() {
    this.__vector = inquisitiveturtle.render3d.vector;
    this.__face = inquisitiveturtle.render3d.face;
    
    this.init();
  };




inquisitiveturtle.render3d.prim.prototype.init = function() {
    this.version = 0;
    this._pos = new this.__vector();
    this._rot = new this.__vector();
    this._scale = new this.__vector(1,1,1);
    this._points = [];
    this._faces = [];
    this._boundingBox = [
      new this.__vector(-0.5,  0.5, -0.5), // Left,  Top,    Back
      new this.__vector(-0.5, -0.5, -0.5), // Left,  Bottom, Back
      new this.__vector(-0.5, -0.5,  0.5), // Left,  Bottom, Front
      new this.__vector(-0.5,  0.5,  0.5), // Left,  Top,    Front
      new this.__vector( 0.5,  0.5,  0.5), // Right, Top,    Front
      new this.__vector( 0.5, -0.5,  0.5), // Right, Bottom, Front
      new this.__vector( 0.5, -0.5, -0.5), // Right, Bottom, Back
      new this.__vector( 0.5,  0.5, -0.5)  // Right, Top,    Back
    ];
    
    this._boundingBoxFaces = [
      new this.__face().setPoints([ this._boundingBox[0], this._boundingBox[7], this._boundingBox[6], this._boundingBox[1] ]) ,     // 0 Back plane
      new this.__face().setPoints([ this._boundingBox[5], this._boundingBox[4], this._boundingBox[3], this._boundingBox[2] ]) ,     // 0 Front plane
      new this.__face().setPoints([ this._boundingBox[0], this._boundingBox[1], this._boundingBox[2], this._boundingBox[3] ]) ,     // 0 Left plane
      new this.__face().setPoints([ this._boundingBox[0], this._boundingBox[3], this._boundingBox[4], this._boundingBox[7] ]) ,     // 0 Top plane
      new this.__face().setPoints([ this._boundingBox[5], this._boundingBox[6], this._boundingBox[7], this._boundingBox[4] ]) ,     // 0 Right plane
      new this.__face().setPoints([ this._boundingBox[5], this._boundingBox[2], this._boundingBox[1], this._boundingBox[6] ])       // 0 Bottom plane
    ];
    
    this._detailLevel = 1.0; // Between 1.0 (max detail) and 0.0 (min detail)
    this._lowerDetailLevel = null;
    this._currentDetailLevel = null;
    this._upperDetailLevel = null;
    
    this._emptyVector = new this.__vector(0,0,0);
  };




inquisitiveturtle.render3d.prim.prototype.getPosition = function() {
    return this._pos;
  };




inquisitiveturtle.render3d.prim.prototype.getRotation = function() {
    return this._rot;
  };




inquisitiveturtle.render3d.prim.prototype.getScale = function() {
    return this._scale;
  };




inquisitiveturtle.render3d.prim.prototype.getPoints = function() {
    return this._points;
  };




inquisitiveturtle.render3d.prim.prototype.getFaces = function() {
    return this._faces;
  };




inquisitiveturtle.render3d.prim.prototype.getBoundingBox = function() {
    return this._boundingBox;
  };


inquisitiveturtle.render3d.prim.prototype.getBoundingBoxFace = function(face) {
    return this._boundingBoxFaces[face];
  };

inquisitiveturtle.render3d.prim.prototype.getBoundingBoxFaceCount = function(face) {
    return this._boundingBoxFaces.length;
  };

inquisitiveturtle.render3d.prim.prototype.moveTo = function(pos) {
    this.version++;
    this._pos.copy(pos);
    return this;
  };




inquisitiveturtle.render3d.prim.prototype.moveBy = function(pos) {
    this.version++;
    this._pos.add(pos);
    return this;
  };




inquisitiveturtle.render3d.prim.prototype.rotateTo = function(rot) {
    this.version++;
    this._rot.copy(rot);
    return this;
  };




inquisitiveturtle.render3d.prim.prototype.rotateBy = function(rot) {
    this.version++;
    this._rot.add(rot);
    return this;
  };




inquisitiveturtle.render3d.prim.prototype.scaleTo = function(scale) {
    this.version++;
    this._scale.copy(scale);
    return this;
  };




inquisitiveturtle.render3d.prim.prototype.scaleBy = function(scale) {
    this.version++;
    this._scale.mult(scale);
    return this;
  };





inquisitiveturtle.render3d.prim.prototype.calcModelDetail = function(modelDetailLevel, worldDetailLevel) {
    return modelDetailLevel * worldDetailLevel;
  };





inquisitiveturtle.render3d.prim.prototype.setDetailLevel = function(modelDetailLevel, worldDetailLevel) {
    if (this._levels)
    {
      var detailLevel = this.calcModelDetail(modelDetailLevel, worldDetailLevel);
      
      if (this._lowerDetailLevel && detailLevel < this._lowerDetailLevel.detail)
      {
        this.changeDetailLevel(detailLevel);
      }
      else if (this._upperDetailLevel && detailLevel > this._upperDetailLevel.detail)
      {
        this.changeDetailLevel(detailLevel);
      }
    }
  };



inquisitiveturtle.render3d.prim.prototype.changeDetailLevel = function( newLevel ) {

  this.version++;
  
  if (newLevel < 1.0)
  {
    var level;
    for (var i = 0, ii = this._levels.length; i < ii; i++)
    {
      level = this._levels[i];
      if (level.detail >= newLevel)
      {
        this._points = level.points;
        this._faces = level.faces;
        
        if (i > 0)
          this._lowerDetailLevel = this._levels[i-1];
        else
          this._lowerDetailLevel = null;
        
        if (i < (this._levels.length-1))
          this._upperDetailLevel = this._levels[i+1];
        else
          this._upperDetailLevel = null;
        
        return;
      }
    }
  }

  this._points = this._levels[this._levels.length-1].points;
  this._faces = this._levels[this._levels.length-1].faces;
  this._upperDetailLevel = null;
  this._lowerDetailLevel = this._levels[this._levels.length-2];
};




inquisitiveturtle.render3d.prim.prototype.mapBoundingWorldPoints = function() {
    if (this._worldPointsVersion != this.version)
    {
    
      var cosrotx,cosroty,cosrotz;
      var sinrotx,sinroty,sinrotz;

      if (this._rot.x !== 0)
      {
        cosrotx = Math.cos(this._rot.x);
        sinrotx = Math.sin(this._rot.x);
      }
      
      if (this._rot.y !== 0)
      {
        cosroty = Math.cos(this._rot.y);
        sinroty = Math.sin(this._rot.y);
      }
      
      if (this._rot.z !== 0)
      {
        cosrotz = Math.cos(this._rot.z);
        sinrotz = Math.sin(this._rot.z);
      }
      
      var point = null;
      var x,y,z;
      var xt,yt;
      for (var i = 0, ii = this._boundingBox.length; i < ii; i++)
      {
        point = this._boundingBox[i];
        if (!point.world)
          point.world = new this.__vector();
          
        x = point.x * this._scale.x;
        y = point.y * this._scale.y;
        z = point.z * this._scale.z;
        
        if (this._rot.x !== 0)
        {
          yt = y;
          y = (yt * cosrotx) - (z * sinrotx);
          z = (yt * sinrotx) + (z * cosrotx);
        }
        if (this._rot.y !== 0)
        {
          xt = x;
          x = (xt     * cosroty) + (z * sinroty);
          z = (z * cosroty) - (xt     * sinroty);
        }
        if (this._rot.z !== 0)
        {
          xt = x;
          x = (xt * cosrotz) - (y * sinrotz);
          y = (xt * sinrotz) + (y * cosrotz);
        }
        
        point.world.x = x + this._pos.x;
        point.world.y = y + this._pos.y;
        point.world.z = z + this._pos.z;
      }

    }
};





inquisitiveturtle.render3d.prim.prototype.mapWorldPoints = function() {
    if (this._worldPointsVersion != this.version)
    {
      this._worldPointsVersion = this.version;

      var cosrotx,cosroty,cosrotz;
      var sinrotx,sinroty,sinrotz;

      if (this._rot.x !== 0)
      {
        cosrotx = Math.cos(this._rot.x);
        sinrotx = Math.sin(this._rot.x);
      }
      
      if (this._rot.y !== 0)
      {
        cosroty = Math.cos(this._rot.y);
        sinroty = Math.sin(this._rot.y);
      }
      
      if (this._rot.z !== 0)
      {
        cosrotz = Math.cos(this._rot.z);
        sinrotz = Math.sin(this._rot.z);
      }
      
      var point = null;
      var x,y,z;
      var xt,yt;
      
      for (var i = 0, ii = this._points.length; i < ii; i++)
      {
        point = this._points[i];
        
        if (!point.world)
          point.world = new this.__vector();
          
        x = point.x * this._scale.x;
        y = point.y * this._scale.y;
        z = point.z * this._scale.z;
        
        if (this._rot.x !== 0)
        {
          yt = y;
          y = (yt * cosrotx) - (z * sinrotx);
          z = (yt * sinrotx) + (z * cosrotx);
        }
        if (this._rot.y !== 0)
        {
          xt = x;
          x = (xt     * cosroty) + (z * sinroty);
          z = (z * cosroty) - (xt     * sinroty);
        }
        if (this._rot.z !== 0)
        {
          xt = x;
          x = (xt * cosrotz) - (y * sinrotz);
          y = (xt * sinrotz) + (y * cosrotz);
        }
        
        point.world.x = x + this._pos.x;
        point.world.y = y + this._pos.y;
        point.world.z = z + this._pos.z;
      }
      
      for (i = 0, ii = this._faces.length; i < ii; i++)
      {
        this._faces[i].calcNormal();
      }
    }
  };




inquisitiveturtle.render3d.prim.prototype.inRegion = function(planepoint, planenormal) {
    var pointList = this._boundingBox;
    
    var worldpoint = null;
    var totalPoints = pointList.length;
    var inRegion = 0;
    for (var i = 0, ii = totalPoints; i < ii; i++)
    {
      worldpoint = pointList[i].world;
      if (worldpoint.inRegion(planepoint, planenormal))
        inRegion++;
    }
    
    if (inRegion === 0)
      return 0; // Not in region at all
    if (inRegion == totalPoints)
      return 2; // Fully in region
    
    return 1; // Partially in region
  }






inquisitiveturtle.render3d.prim.prototype.lookAt = function(pos, off) 
{
  this._cached = false;
  
  var dx = pos.x - this._pos.x;
  var dy = pos.y - this._pos.y;
  var dz = pos.z - this._pos.z;

  if (!off)
  {
    off = this._emptyVector;
  }

  if (off.y !== null)
  {
    if (dz === 0)
    {
      if (dx > 0)
        this._rot.y = Math.PI - ((Math.PI * 1.5)+ off.y);
      else
        this._rot.y = Math.PI - ((Math.PI * 0.5)+ off.y);
    }
    else
    {
      if (dz < 0)
      {
        this._rot.y = Math.PI - ((Math.atan(-dx/dz) + Math.PI)+ off.y);
      }
      else
      {
        this._rot.y = (Math.atan(dx/dz) + Math.PI)+ off.y;
      }
    }
  }

  if (off.x !== null)
  {
    if (dy === 0)
    {
      this._rot.x = 0;
    }
    else
    {
      if (dy > 0)
      {
        this._rot.x = (Math.atan(Math.sqrt(dx*dx + dz*dz)/-dy)+(Math.PI/2)) + off.x;
      }
      else
      {
        this._rot.x = (Math.atan(Math.sqrt(dx*dx + dz*dz)/-dy)-(Math.PI/2)) + off.x;
      }
    }
  }

  if (off.z !== null)
    this._rot.z = off.z;
    
  return this;
};


