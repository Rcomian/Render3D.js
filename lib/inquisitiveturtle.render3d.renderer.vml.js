var inquisitiveturtle = inquisitiveturtle || function() {};
inquisitiveturtle.render3d = inquisitiveturtle.render3d || function() {};

if (typeof inquisitiveturtle.render3d.renderer == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.renderer.js' before including 'inquisitiveturtle.render3d.render.vml.js'" ; 

if (typeof inquisitiveturtle.render3d.vector == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.vector.js' before including 'inquisitiveturtle.render3d.render.vml.js'";

if (typeof inquisitiveturtle.render3d.face == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.face.js' before including 'inquisitiveturtle.render3d.render.vml.js'";






inquisitiveturtle.render3d.renderer.vml = function( containerid, width, height ) {
    if (document.namespaces && !document.namespaces.rvml) {
        document.namespaces.add("rvml","urn:schemas-microsoft-com:vml");
        document.createStyleSheet().addRule("rvml\\:*", "behavior:url(#default#VML)");
    }
                    
    if (!width)
      width = 320;
    if (!height)
      height = 200;
      
    this.width = width;
    this.height = height;
    this.centerx = width / 2;
    this.centery = height / 2;
    
    this.container = null;
    if (typeof containerid === "string") {
        this.container = document.getElementById(containerid);
    }
    if (typeof containerid == "object") {
        this.container = containerid;
    }

    var container = this.container;
    var containerstyle = container.style;
    containerstyle.width = width;
    containerstyle.height = height;

    var border = document.createElement("rvml:rect");
    var borderstyle = border.style;
    borderstyle.top = 0;
    borderstyle.left = 0;
    borderstyle.width = width-1;
    borderstyle.height = height-1;
    border.filled = false;
    border.stroked = false;
    this.border = border;
    
    var canvas = document.createElement("rvml:group");
    var canvasstyle = canvas.style;
    canvasstyle.position = "absolute";
    canvasstyle.width = width;
    canvasstyle.height = height;
    canvas.coordsize = parseFloat(width) + " " + parseFloat(height);
    canvas.coordorigin = "0 0";
    this.canvas = canvas;
    
    var canvasholder = document.createElement("div");
    var canvasholderstyle = canvasholder.style;
    canvasholderstyle.clip = "rect(0 " + width + " " + height + " 0)";
    canvasholderstyle.top = "0px";
    canvasholderstyle.left = "0px";
    canvasholderstyle.position = "absolute";
    canvasholderstyle.width = width;
    canvasholderstyle.height = height;
    
    var positioner = document.createElement("div");
    positioner.style.position = "relative";
    
    canvas.appendChild(border);
    canvasholder.appendChild(canvas);
    positioner.appendChild(canvasholder);
    
    this.container.appendChild(positioner);
    
    this.toRender = [];
  };
  
  
  
  
  
  
  
inquisitiveturtle.render3d.renderer.vml.isSupported = function() {
      if (typeof inquisitiveturtle.render3d.renderer.vml.isSupported.supported == "undefined") {
          var a = document.body.appendChild(document.createElement('div'));
          a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
          var b = a.firstChild;
          b.style.behavior = "url(#default#VML)";
          inquisitiveturtle.render3d.renderer.vml.isSupported.supported = b ? typeof b.adj == "object": true;
          a.parentNode.removeChild(a);
      }
      return inquisitiveturtle.render3d.renderer.vml.isSupported.supported;
  };






inquisitiveturtle.render3d.renderer.register.push( {
    name:"VML",
    author:'Jim Tupper',
    version:1.0,
    description:'Renders the scene as a VML image directly in the browser.',
    links:[],
    capabilities:['rendertriangle','startstop'],
    constructor: inquisitiveturtle.render3d.renderer.vml,
    supported: inquisitiveturtle.render3d.renderer.vml.isSupported
    
  });







inquisitiveturtle.render3d.renderer.vml.prototype.htmlFromColorVector = function( colorVector ) {
  var htmlRGB = '#';
  
  var r = Math.round(colorVector.x * 255.0);
  if (r < 16) 
    htmlRGB += "0";
  htmlRGB += r.toString(16);
  var g = Math.round(colorVector.y * 255.0);
  if (g < 16) 
    htmlRGB += "0";
  htmlRGB += g.toString(16);
  var b = Math.round(colorVector.z * 255.0);
  if (b < 16) 
    htmlRGB += "0";
  htmlRGB += b.toString(16);

  return htmlRGB;
};






inquisitiveturtle.render3d.renderer.vml.prototype.render = function( face, viewid ) {
    this.toRender.push({
      view: face.views[viewid],
      color: this.lighting.lightSurface(face.getColor(), face.normal, new inquisitiveturtle.render3d.vector() )
      });
    
    // Note: coords come in assuming y increases upwards and origin is in center
    //       svg canvas has origin top left, with y increasing downwards
    //       hence y must be inverted and everthing offset into the center

  };
  
  

inquisitiveturtle.render3d.renderer.vml.prototype.startFrame = function( viewid, lighting ) {
    this.toRender = [];
    this.lighting = lighting;
  };




inquisitiveturtle.render3d.renderer.vml.compareFaces = function( a, b ) {
    return b.view.maxcamdepth - a.view.maxcamdepth;
  };
  




inquisitiveturtle.render3d.renderer.vml.prototype.endFrame = function( viewid ) {
    this.canvas.style.display = "none";
    
    var face;
    var pathObj = this.border.nextSibling;
    var points;
    var centerx = this.centerx;
    var centery = this.centery;
    var point;
    
    this.toRender = this.toRender.sort( inquisitiveturtle.render3d.renderer.vml.compareFaces );
    
    for (var i = 0, ii = this.toRender.length; i < ii; i++)
    {
      face = this.toRender[i];
      points = face.view.clipped;
      var pointcount = points.length;
      var color = this.htmlFromColorVector(face.color);
      
      if (!pathObj)
      {
        // Out of renderable objects, need to create one
        var shape = document.createElement("rvml:shape");
        var shapestyle =  shape.style;
        shapestyle.width = this.width + "px";
        shapestyle.height = this.height + "px";
        shape.path = "";
        shape.coordsize = this.coordsize;
        shape.coordorigin = this.coordorigin;
        shapestyle.position = "absolute";
        shapestyle.left = 0;
        shapestyle.top = 0;
        
        var fill = document.createElement("rvml:fill");
        fill.on = true;
        shape._it_fill = fill;
        shape.appendChild(fill);
        
        var stroke = document.createElement("rvml:stroke");
        stroke.on = true;
        shape._it_stroke = stroke;
        shape.appendChild(stroke);
        
        shape.isHidden = false;
        this.canvas.appendChild(shape);
        
        pathObj = shape;
      }
      
      if (pathObj.__itr3d_color != color)
      {
        pathObj.__itr3d_color = color;
        pathObj._it_fill.color = color;
        pathObj._it_stroke.color = color;
      }
      
      if (pathObj.isHidden)
      {
        pathObj.isHidden = false;
        pathObj.style.display = "block";
      }
      
      var pathstring = "m" + Math.round(points[0].display.x + centerx) + " " + Math.round((-points[0].display.y)+centery);
      for (var j = 1; j < pointcount; j++)
      {
        point = points[j].display;
        pathstring += "l" + Math.round(point.x + centerx) + " " + Math.round(-point.y+centery);
      }
      pathstring += "x e";

      pathObj.path = pathstring;
      
      pathObj = pathObj.nextSibling;
    }
    
    while (pathObj)
    {
      pathObj.isHidden = true;
      pathObj.style.display = "none";
      pathObj = pathObj.nextSibling;
    }
    
    this.canvas.style.display = "block";
  };



