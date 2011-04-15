if (typeof inquisitiveturtle == "undefined")
  inquisitiveturtle = function() {}
  
if (typeof inquisitiveturtle.render3d == "undefined")
  inquisitiveturtle.render3d = function() {}
  
if (typeof inquisitiveturtle.render3d.vector == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.vector.js' before including 'inquisitiveturtle.render3d.prim.camera.js'"

if (typeof inquisitiveturtle.render3d.face == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.face.js' before including 'inquisitiveturtle.render3d.prim.camera.js'"

if (typeof inquisitiveturtle.render3d.prim == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.prim.js' before including 'inquisitiveturtle.render3d.prim.camera.js'"






inquisitiveturtle.render3d.prim.camera = function() {
    this.__vector = inquisitiveturtle.render3d.vector;
    this.__face = inquisitiveturtle.render3d.face;
    
    this.init();
    
    this._id = inquisitiveturtle.render3d.prim.camera.nextId++;
    
    this._points = [
      new this.__vector(0, 0, -0.5),        // 0 View center
      new this.__vector(0, 0,  0),     // 1 Projection point
      new this.__vector(-0.5, -0.5, -0.5),  // 2 Bottom Left
      new this.__vector(-0.5,  0.5, -0.5),  // 3 Top Left
      new this.__vector( 0.5, -0.5, -0.5),  // 4 Bottom Right
      new this.__vector( 0.5,  0.5, -0.5)   // 5 Top Right 
    ];
    
    this._faces = [
      new this.__face().setPoints([ this._points[1], this._points[2], this._points[3] ]).setColor( new vector(1, 0, 0) ),                     // 0 Left plane
      new this.__face().setPoints([ this._points[1], this._points[5], this._points[4] ]).setColor( new vector(0, 1, 0) ),                     // 1 Right plane
      new this.__face().setPoints([ this._points[1], this._points[3], this._points[5] ]).setColor( new vector(0, 0, 1) ),                     // 2 Top plane
      new this.__face().setPoints([ this._points[1], this._points[4], this._points[2] ]).setColor( new vector(1, 1, 0) ),                     // 3 Bottom plane
      new this.__face().setPoints([ this._points[2], this._points[3], this._points[5], this._points[4] ]).setColor( new vector(0, 1, 1) )     // 4 Front plane
    ];
    
    this.superMapWorldPoints = this.mapWorldPoints;
    this.mapWorldPoints = this.overrideMapWorldPoints;
    this._detailLevel = 0.5;
  }
  
  
  
inquisitiveturtle.render3d.prim.camera.nextId = 0;




inquisitiveturtle.render3d.prim.camera.prototype = new inquisitiveturtle.render3d.prim();





inquisitiveturtle.render3d.prim.camera.prototype.mapWorldPointToView = function( v ) {
    
    if (v.view == null)
      v.view = new this.__vector();

    if (this.lastrotx != this._rot.x) {
        this.sinrotx = Math.sin(this._rot.x);
        this.cosrotx = Math.cos(this._rot.x);
        this.lastrotx = this._rot.x;
    }

    if (this.lastroty != this._rot.y) {
        this.sinroty = Math.sin(this._rot.y);
        this.cosroty = Math.cos(this._rot.y);
        this.lastroty = this._rot.y;
    }

    if (this.lastrotz != this._rot.z) {
        this.sinrotz = Math.sin(this._rot.z);
        this.cosrotz = Math.cos(this._rot.z);
        this.lastrotz = this._rot.z;
    }

    var plane = this._points[0].world;
    var dpx = v.x - plane.x;
    var dpy = v.y - plane.y;
    var dpz = v.z - plane.z;

    var a1 = (this.sinrotz * dpy + this.cosrotz * dpx);
    var a2 = (this.cosroty * dpz + this.sinroty * a1);
    var a3 = (this.cosrotz * dpy - this.sinrotz * dpx);

    v.view.x = this.cosroty * a1 - this.sinroty * dpz;
    v.view.y = this.sinrotx * a2 + this.cosrotx * a3;
    v.view.z = this.cosrotx * a2 - this.sinrotx * a3;
  }
  




inquisitiveturtle.render3d.prim.camera.prototype.overrideMapWorldPoints = function( v ) {
    if (this._worldPointsVersion != this.version)
    {
      this.superMapWorldPoints();
    }    
  }
  




inquisitiveturtle.render3d.prim.camera.prototype.mapViewToDisplay = function( v ) {
    if (this._camDepthVersion != this.version)
    {
      this._camDepthVersion = this.version;
      this._camDepth = this._scale.z/2;
    }
    
    var pointz = (this._camDepth - v.view.z)
    var scale = this._camDepth / pointz;
    
    if (v.display == null)
      v.display = new this.__vector();
    
    v.display.x = v.view.x * scale;
    v.display.y = v.view.y * scale;
    v.display.z = Math.sqrt( (pointz*pointz) + (v.view.x * v.view.x) + (v.view.y*v.view.y) );
    
  }
  
  



inquisitiveturtle.render3d.prim.camera.prototype.extractFaces = function( prims, renderer ) {
    var facecount = 0;
    var prim;
    var projectionpoint = this._points[1].world;
    var leftclip, rightclip, topclip, bottomclip;
    var primfaces, primface, facepoints, facepoint;
    var leftedge = this._faces[0];
    var rightedge = this._faces[1];
    var topedge = this._faces[2];
    var bottomedge = this._faces[3];
    var maxcamdepth;
    var worldboundingboxface;
    var totaldisplaypixels = this._scale.x * this._scale.y * 4;
    
    var minx, maxx, miny, maxy;
    
    for (var i = 0, ii = prims.length; i < ii; i++)
    {
      prim = prims[i];
      prim.mapBoundingWorldPoints();
      
      // Clip against view edges
      leftclip = prim.inRegion( projectionpoint, leftedge.normal );
      rightclip = leftclip>0?prim.inRegion( projectionpoint, rightedge.normal ):0;
      topclip = rightclip>0?prim.inRegion( projectionpoint, topedge.normal ):0;
      bottomclip = topclip>0?prim.inRegion( projectionpoint, bottomedge.normal ):0;
      
      if (bottomclip == 0) // If this is the case, then prim isn't visible
      {
        // Not in view
        continue;
      }
     
      // Clip the front and back faces of the world bounding box and get the view bounding box
      minx = this._scale.x;
      maxx = -this._scale.x;
      miny = this._scale.y;
      maxy = -this._scale.y;
      
      for (var k = 0, kk = prim.getBoundingBoxFaceCount().length; k < kk; k++)
      {
        worldboundingboxface = prim.getBoundingBoxFace(k);
        var clipped = [];
        
        for (var m = 0, mm = worldboundingboxface.getPoints().length; m < mm; m++)
        {
          clipped[m] = worldboundingboxface.getPoints()[m].world;
        }
        
        // Clip each face if it might need it
        woldboundingboxface.resetSpares();
        if (leftclip == 1)
        {
          clipped = worldboundingboxface.clipTo(clipped, projectionpoint, leftedge.normal);
        }
        if (rightclip == 1 && clipped.length > 0)
        {
          clipped = worldboundingboxface.clipTo(clipped, projectionpoint, rightedge.normal);
        }
        if (topclip == 1 && clipped.length > 0)
        {
          clipped = worldboundingboxface.clipTo(clipped, projectionpoint, topedge.normal);
        }
        if (bottomclip == 1 && clipped.length > 0)
        {
          clipped = worldboundingboxface.clipTo(clipped, projectionpoint, bottomedge.normal);
        }

        for (var l = 0, ll = clipped.length; l < ll; l++)
        {
          clippedpoint = clipped[l];
          this.mapWorldPointToView(clippedpoint);
          this.mapViewToDisplay(clippedpoint);
          
          if (clippedpoint.display.x < minx)
            minx = clippedpoint.display.x;
            
          if (clippedpoint.display.x > maxx)
            maxx = clippedpoint.display.x;
            
          if (clippedpoint.display.y < miny)
            miny = clippedpoint.display.y;
            
          if (clippedpoint.display.y > maxy)
            maxy = clippedpoint.display.y;
            
        }

      }

      // Given the view bounding box, work out what proportion of the screen is potentially covered by the prim
      var sqr = Math.max((maxx - minx) * (maxx - minx), (maxy - miny) * (maxy - miny));
      prim.setDetailLevel(sqr / totaldisplaypixels, this._detailLevel);
      prim.mapWorldPoints();

      primfaces = prim._faces;
      
      for (var j = 0, jj = primfaces.length; j < jj; j++)
      {
        primface = primfaces[j];
        
        facepoints = primface.getPoints();
        var clipped = null, clippedpoint;
        
        if (projectionpoint.inRegion(facepoints[0].world, primface.normal)) // Backface culling
        {
          clipped = [];
          for (var k = 0, kk = facepoints.length; k < kk; k++)
          {
            clipped[k] = facepoints[k].world;
          }
          
          // Clip each face if it might need it
          primface.resetSpares();
          if (leftclip == 1)
          {
            clipped = primface.clipTo(clipped, projectionpoint, leftedge.normal);
          }
          if (rightclip == 1 && clipped.length > 0)
          {
            clipped = primface.clipTo(clipped, projectionpoint, rightedge.normal);
          }
          if (topclip == 1 && clipped.length > 0)
          {
            clipped = primface.clipTo(clipped, projectionpoint, topedge.normal);
          }
          if (bottomclip == 1 && clipped.length > 0)
          {
            clipped = primface.clipTo(clipped, projectionpoint, bottomedge.normal);
          }
          
          if (clipped.length > 0) // Check face not clipped away
          {
            if (primface.views == null)
              primface.views = [];
              
            if (primface.views[this._id] == null)
              primface.views[this._id] = {};
              
            primface.views[this._id].clipped = clipped;
            
            // Translate the points into viewspace coordinates
            maxcamdepth = 0;
            for (var k = 0, kk = clipped.length; k < kk; k++)
            {
              clippedpoint = clipped[k];
              this.mapWorldPointToView(clippedpoint);
              this.mapViewToDisplay(clippedpoint);
              if (clippedpoint.display.z > maxcamdepth)
              {
                maxcamdepth = clippedpoint.display.z;
              }
            }

            primface.views[this._id].maxcamdepth = maxcamdepth;
                        
            renderer.render(primface, this._id);
            facecount++;
          }
        }
      }
      
    }
    
    return facecount;
  }


