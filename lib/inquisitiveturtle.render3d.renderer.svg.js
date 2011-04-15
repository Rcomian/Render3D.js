if (typeof inquisitiveturtle == "undefined")
  inquisitiveturtle = function() {}
  
if (typeof inquisitiveturtle.render3d == "undefined")
  inquisitiveturtle.render3d = function() {}

if (typeof inquisitiveturtle.render3d.renderer == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.renderer.js' before including 'inquisitiveturtle.render3d.render.svg.js'"  

if (typeof inquisitiveturtle.render3d.vector == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.vector.js' before including 'inquisitiveturtle.render3d.render.svg.js'"

if (typeof inquisitiveturtle.render3d.face == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.face.js' before including 'inquisitiveturtle.render3d.render.svg.js'"






inquisitiveturtle.render3d.renderer.svg = function( container, width, height ) {
    this.ns = "http://www.w3.org/2000/svg";
    
    if (width == null)
      width = 320;
    if (height == null)
      height = 200;
      
    this.width = width;
    this.height = height;
    this.container = container;

    this.canvas = document.createElementNS(this.ns, "svg");
    this.canvas.setAttribute("width", width);
    this.canvas.setAttribute("height", height);

    if (this.container.firstChild) {
        this.container.insertBefore(this.canvas, this.container.firstChild);
    } else {
        this.container.appendChild(this.canvas);
    }

    this.defs = document.createElementNS(this.ns, "defs");
    this.canvas.appendChild(this.defs);

    this.centerx = width / 2;
    this.centery = height / 2;
    
    this.border = document.createElementNS(this.ns, "path");
    this.border.setAttribute("fill", "none");
    this.border.setAttribute("stroke", "none");
    this.border.setAttribute("stroke-width", 0);
    this.border.setAttribute("d", "M 0 0 L " + (this.width-1) + " 0 L " + (this.width-1) + " " + (this.height-1) + " L 0 " + (this.height-1) + " Z");
    this.canvas.appendChild(this.border);
    
    this.reserveList = [];
    this.toRender = [];
  }
  
  
  
  
  
  
  
  
inquisitiveturtle.render3d.renderer.svg.isSupported = function() {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.1");
}








inquisitiveturtle.render3d.renderer.register.push( {
  name:"SVG",
  author:'Jim Tupper',
  version:1.0,
  description:'Renders the scene as an SVG image directly in the browser.',
  links:[],
  capabilities:['rendertriangle','startstop'],
  constructor: inquisitiveturtle.render3d.renderer.svg,
  supported: inquisitiveturtle.render3d.renderer.svg.isSupported
});








inquisitiveturtle.render3d.renderer.svg.prototype.htmlFromColorVector = function( colorVector ) {
  var htmlRGB = '#';
  
  var r = Math.round(colorVector.x * 255.0)
  if (r < 16) 
    htmlRGB += "0";
  htmlRGB += r.toString(16);
  var g = Math.round(colorVector.y * 255.0)
  if (g < 16) 
    htmlRGB += "0";
  htmlRGB += g.toString(16);
  var b = Math.round(colorVector.z * 255.0)
  if (b < 16) 
    htmlRGB += "0";
  htmlRGB += b.toString(16);

  return htmlRGB;
}







inquisitiveturtle.render3d.renderer.svg.prototype.render = function( face, viewid ) {
    if (this.toRender[index] == null)
    {
      this.toRender[index] = {
      view: face.views[viewid],
      color: this.lighting.lightSurface(face.getColor(), face.normal, new inquisitiveturtle.render3d.vector()),
      unused: false
      }
    }
    else
    {
      this.toRender[index].view = face.views[viewid];
      this.toRender[index].color = this.lighting.lightSurface(face.getColor(), face.normal, this.toRender[index].color);
      this.toRender[index].unused = false;
    }
    index++;
    
    // Note: coords come in assuming y increases upwards and origin is in center
    //       svg canvas has origin top left, with y increasing downwards
    //       hence y must be inverted and everthing offset into the center

  }
  
  

inquisitiveturtle.render3d.renderer.svg.prototype.startFrame = function( viewid, lighting ) {
    for (var n = 0, nn = this.toRender.length; n < nn; n++)
    {
      this.toRender[n].unused = true;
    }
    index = 0;
    this.lighting = lighting;
  }




inquisitiveturtle.render3d.renderer.svg.compareFaces = function( a, b ) {
    return b.view.maxcamdepth - a.view.maxcamdepth;
  }
  



inquisitiveturtle.render3d.renderer.svg.prototype.endFrame = function( viewid ) {
    this.canvas.style.display = "none";
    
    var face;
    var pathObj = this.border.nextSibling;
    var points, pointsCount;
    var centerx = this.centerx;
    var centery = this.centery;
    
    this.toRender = this.toRender.sort( inquisitiveturtle.render3d.renderer.svg.compareFaces );
    
    for (var i = 0, ii = this.toRender.length; i < ii; i++)
    {
      face = this.toRender[i];
      if (face.unused)
      {
        continue;
      }
      
      points = face.view.clipped;
      pointcount = points.length;
      color = this.htmlFromColorVector(face.color);
      
      if (pathObj == null)
      {
        // Out of renderable objects, need to create one
        pathObj = document.createElementNS(this.ns, "path");
        pathObj.setAttribute("stroke-width", 1);
        pathObj.isHidden = false;
        this.canvas.appendChild(pathObj);
      }
      
      if (pathObj.__itr3d_color != color)
      {
        pathObj.__itr3d_color = color;
        pathObj.setAttribute("fill", color);
        pathObj.setAttribute("stroke", color);
      }
      
      if (pathObj.isHidden)
      {
        pathObj.isHidden = false;
        pathObj.style.display = "block";
      }
      
      pathstring = "M " + Math.round(points[0].display.x + centerx) + " " + Math.round((-points[0].display.y)+centery);
      for (var j = 1; j < pointcount; j++)
      {
        point = points[j].display;
        pathstring += " L " + Math.round(point.x + centerx) + " " + Math.round((-point.y)+centery);
      }
      pathstring += " Z";

      pathObj.setAttribute("d", pathstring);

      pathObj = pathObj.nextSibling;
    }
    
    //this.toRender = [];
    
    while (pathObj != null)
    {
      pathObj.isHidden = true;
      pathObj.style.display = "none";
      pathObj = pathObj.nextSibling;
    }
    
    this.canvas.style.display = "block";
  }



