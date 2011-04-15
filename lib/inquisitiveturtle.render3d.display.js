if (typeof inquisitiveturtle == "undefined")
  inquisitiveturtle = function() {}
  
if (typeof inquisitiveturtle.render3d == "undefined")
  inquisitiveturtle.render3d = function() {}
  
if (typeof inquisitiveturtle.render3d.vector == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.vector.js' before including 'inquisitiveturtle.render3d.display.js'"

if (typeof inquisitiveturtle.render3d.face == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.face.js' before including 'inquisitiveturtle.render3d.display.js'"

if (typeof inquisitiveturtle.render3d.prim == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.prim.js' before including 'inquisitiveturtle.render3d.display.js'"

if (typeof inquisitiveturtle.render3d.prim.camera == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.prim.camera.js' before including 'inquisitiveturtle.render3d.display.js'"





inquisitiveturtle.render3d.display = function( container, width, height, campos, camrot, world ) {

  this.world = world;
  this.width = width;
  this.height = height;

  this.camera = new inquisitiveturtle.render3d.prim.camera();
  if (campos != null)
    this.camera.moveTo(campos);
    
  if (camrot != null)
    this.camera.rotateTo(camrot);

  this.camera.scaleTo( new vector(width, height, Math.max(width,height)));

  this.container = null;
  if (typeof container == "string") {
      this.container = document.getElementById(container);
  }
  if (typeof container == "object") {
      this.container = container;
  }
  
  this.container.style.width=width + "px";
  this.container.style.height=height + "px";

  this._failoverCreateEngine();
}





inquisitiveturtle.render3d.display.prototype._getSupportedEngine = function() {
    var supported = inquisitiveturtle.render3d.renderer.supportedEngines();
    if (supported[0] != null)
    {
      return supported[0];
    }
    else
    {
      var container = null;
      if (typeof this.container == "string")
        container = document.getElementById(this.container);
      else
        container = this.container;
        
      container.innerHTML = "<span class='it-error'>No compatible renderer found, cannot continue</span>";
      throw "No compatible renderer found, cannot continue";
    }
  }




inquisitiveturtle.render3d.display.prototype._doError = function(context, err) {
}





inquisitiveturtle.render3d.display.prototype._failRenderEngine = function(err)
{
  if (this.renderinfo != null)
  {
    this.renderinfo.supported = function() { return false; };
    this.renderinfo.description += " - Failed: " + err;
    this.renderinfo = null;
  }
}




inquisitiveturtle.render3d.display.prototype._failoverCreateEngine = function() {
    var created = false;
    while (!created)
    {
      var container = this.container; 
        
      while (container && container.firstChild)
        container.removeChild(container.firstChild);
    
      if (this.renderinfo == null)
        this.renderinfo = this._getSupportedEngine();
        
      try
      {
        this.renderer = new this.renderinfo.constructor(this.container, this.width, this.height);
        
        if (inquisitiveturtle.render3d.display.onenginestart)
        {
          if (inquisitiveturtle.render3d.display.onenginestartcontext != null)
            inquisitiveturtle.render3d.display.onenginestartcontext.call(inquisitiveturtle.render3d.view.onenginestart, this, this.renderinfo);
          else
            inquisitiveturtle.render3d.display.onenginestart(this, this.renderinfo);
        }
        
        created = true;
      }
      catch(err)
      {
        this._doError("Creating rendering engine", err);
        
        this._failRenderEngine(err);
        this.renderer = null;
      }
    }
  }





inquisitiveturtle.render3d.display.prototype.render = function() {
    this.camera.mapWorldPoints();
    
    this.renderer.startFrame(this.camera._id, this.world.lighting);
    
    this.renderinfo.primCount = this.camera.extractFaces(this.world.prims, this.renderer);

    this.renderer.endFrame(this.camera._id);
    
  }





