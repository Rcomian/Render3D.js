var inquisitiveturtle = inquisitiveturtle || function() {};
inquisitiveturtle.render3d = inquisitiveturtle.render3d || function() {};

if (typeof inquisitiveturtle.render3d.vector == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.vector.js' before including 'inquisitiveturtle.render3d.prim.cube.js'";

if (typeof inquisitiveturtle.render3d.face == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.face.js' before including 'inquisitiveturtle.render3d.prim.cube.js'";

if (typeof inquisitiveturtle.render3d.prim == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.prim.js' before including 'inquisitiveturtle.render3d.prim.cube.js'";






inquisitiveturtle.render3d.prim.cube = function() {
    this.__vector = inquisitiveturtle.render3d.vector;
    this.__face = inquisitiveturtle.render3d.face;
    
    this.init();
    
    this._points = [
      new this.__vector(-0.5,  0.5, -0.5), // 0 Left,  Top,    Back
      new this.__vector(-0.5, -0.5, -0.5), // 1 Left,  Bottom, Back
      new this.__vector(-0.5, -0.5,  0.5), // 2 Left,  Bottom, Front
      new this.__vector(-0.5,  0.5,  0.5), // 3 Left,  Top,    Front
      new this.__vector( 0.5,  0.5,  0.5), // 4 Right, Top,    Front
      new this.__vector( 0.5, -0.5,  0.5), // 5 Right, Bottom, Front
      new this.__vector( 0.5, -0.5, -0.5), // 6 Right, Bottom, Back
      new this.__vector( 0.5,  0.5, -0.5)  // 7 Right, Top,    Back
    ];
    
    this._faces = [
      new this.__face().setPoints([ this._points[0], this._points[1], this._points[2], this._points[3] ]).setColor( new this.__vector(1, 0, 0) ),     // 0 Left plane
      new this.__face().setPoints([ this._points[0], this._points[7], this._points[6], this._points[1] ]).setColor( new this.__vector(0, 1, 0) ),     // 0 Back plane
      new this.__face().setPoints([ this._points[0], this._points[3], this._points[4], this._points[7] ]).setColor( new this.__vector(0, 0, 1) ),     // 0 Top plane
      new this.__face().setPoints([ this._points[5], this._points[4], this._points[3], this._points[2] ]).setColor( new this.__vector(1, 1, 0) ),     // 0 Front plane
      new this.__face().setPoints([ this._points[5], this._points[6], this._points[7], this._points[4] ]).setColor( new this.__vector(0, 1, 1) ),     // 0 Right plane
      new this.__face().setPoints([ this._points[5], this._points[2], this._points[1], this._points[6] ]).setColor( new this.__vector(1, 0, 1) )      // 0 Bottom plane
    ];
  };
  
  
  
  
  
inquisitiveturtle.render3d.prim.cube.prototype = new inquisitiveturtle.render3d.prim();




