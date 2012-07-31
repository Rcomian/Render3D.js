var inquisitiveturtle = inquisitiveturtle || function() {};
inquisitiveturtle.render3d = inquisitiveturtle.render3d || function() {};

if (typeof inquisitiveturtle.render3d.renderer === "undefined")
  inquisitiveturtle.render3d.renderer = function () {};

inquisitiveturtle.render3d.renderer.register = [];

inquisitiveturtle.render3d.renderer.supportedEngines = function()
{
  var supported = [];
    
  for (var engineIndex = 0; engineIndex < inquisitiveturtle.render3d.renderer.register.length; engineIndex++)
  {
    var engineInfo = inquisitiveturtle.render3d.renderer.register[engineIndex];
    
    if (engineInfo.supported())
    {
      supported.push(engineInfo);
    }
  }
  
  return supported;
}



