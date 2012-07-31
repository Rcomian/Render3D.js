var inquisitiveturtle = inquisitiveturtle || { render3d : { prim: {}}};
var vector = inquisitiveturtle.render3d.vector;

var display;
var world;
var animate = false;
var fpsspan = null;
var primCounter = null;
var renderinfo = null;
var iteration = 0;
var fpsstats = [1,1,1,1,1,1,1,1,1,1];
var interval = 50;
var objectCount = 3;


var floorsize = 50000;
var floorheight = 5000;

function range(start, stop, steps)
{
  if (steps <= 1)
    return [start];
    
  var lrange = [];
 
  var STEP = (stop - start) / (steps-1);
  
  for (var i = 0; i < steps; i++)
  {
    lrange[i] = start + (i * STEP);
  }
  return lrange;
}

function getHeight(x, y)
{
    return (Math.sin((Math.PI*2) * x) + Math.cos((Math.PI*2) * y)) / -2;
}

function getWorldHeight(x, y)
{
  return getHeight( x / floorsize, y / floorsize ) * floorheight;
}

var colors = [
  new vector(0.6, 0.9, 0.6),
  new vector(0.5, 0.6, 0.5),
  new vector(0.9, 0.3, 0.2)
];

var colormap = [
  [1,0,1,0,1,0],
  [0,1,0,1,0,1],
  [1,0,1,0,1,0],
  [0,1,0,1,0,1],
  [1,0,1,0,1,0],
  [0,1,0,1,0,1]
];

function getColor(x, y)
{
    var yt = Math.floor((y + 0.999) * (colormap.length/2));
    var xt = Math.floor((x + 0.999) * (colormap[0].length/2));
    try
    {
      return colors[ colormap[xt][yt] ];
    }
    catch(err)
    {
      console.log("Err at: " + x + "," + y);
    }
}

function getAvgHeight(minx, miny, maxx, maxy)
{
  return getHeight(minx, miny);
}


function getAvgColor(minx, miny, maxx, maxy)
{
  var color = new vector(0,0,0);
  var yrange = range(miny, maxy, 4);
  var xrange = range(minx, maxx, 4);
  for (var s=0, ss=yrange.length; s < ss; s++)
  {
    for (var t=0, tt=xrange.length; t < tt; t++)
    {
      color.add( getColor( xrange[t], yrange[s] ) );
    }
  }
  
  color.x /= (yrange.length * xrange.length);
  color.y /= (yrange.length * xrange.length);
  color.z /= (yrange.length * xrange.length);
  return color;
}


var primFloor;
var primChaser;

function init() {
    document.getElementById("sceneContainer").onclick=doClick;
    
    fpsspan = document.getElementById("fps");
    renderinfo = document.getElementById("renderinfo");
    primCounter = document.getElementById("primCounter");

    world = new inquisitiveturtle.render3d.world();
    world.lighting.suns[0].color = new vector(1, 1, 1);
    world.lighting.ambient = new vector(0.0, 0.1, 0.2);


    for (var i = 0; i < objectCount; i++)
    {
      var primCube = new inquisitiveturtle.render3d.prim.lathe( new vector(1 - (i/objectCount), 1 - (i/objectCount), 1), 10, [ [0.0, 0.89], [0.3, 0.9], [0.3, 0.99], [0.4, 1.0], [0.4, 0.9], [0.1, 0.8], [0.2, 0.4], [0.4, 0.35], [0.2, 0.3], [0.2, 0.2], [1.0, 0.1], [1.0, 0.0], [0.0,0.0] ]);
      primCube.scaleTo( new vector(800,4000,800) );
      world.prims.push(primCube);
    }

    primFloor = new inquisitiveturtle.render3d.prim.floor(getAvgColor, 10, getAvgHeight);
    primFloor.scaleTo( new vector(floorsize, floorheight, floorsize) );
    primFloor.moveTo( new vector(0,-100, 0) );
    world.prims.push(primFloor);

    primChaser = new inquisitiveturtle.render3d.prim.lathe( new vector(0.8, 0.9, 0.5), 20, [ [0.0, 1.0], [0.6, 0.9], [0.8, 0.8], [0.9, 0.7], [1.0, 0.5], [1.0, 0.0], [0.0, 0.0] ]);
    primChaser.scaleTo( new vector(400,1600,400));
    primChaser.log = true;
    world.prims.push(primChaser);

    display = new inquisitiveturtle.render3d.display( "sceneContainer", 640,400 );
    display.world = world;
    display.camera.moveTo( new vector(-10,200,500) );
    display.camera.rotateTo( new vector(-0.2,0,0) );
    
    document.getElementById("sceneContainer").style.backgroundColor = display.renderer.htmlFromColorVector(world.lighting.ambient);
    
    display.render();
  }


var pauseset = 0;

var timer = null;
function doClick() {
    if (animate && animate > 0)
    {
        clearInterval(timer);
        doFrame();
        pauseset = new Date().getTime();
        animate = 0;
    }
    else
    {
        animate = new Date().getTime();
        nextexpected = new Date().getTime();
        doFrame();
        timer = setInterval(function() { doFrame();}, 1000/25);
    }
  }



var pad = new vector(0,0,0);

function doAnimation(iteration){
    
    iteration = iteration / 250;
    
    pad.x = 15000 * Math.sin(iteration/10);
    pad.z = 15000 * Math.cos(iteration/10);
    pad.y = 2000 + (500 * Math.cos(iteration/50)) + getWorldHeight(pad.x,pad.z);
    
    world.prims[0].moveTo( pad );

    pad.x = -10000 * Math.sin(iteration/10);
    pad.z = -20000 * Math.cos(iteration/10);
    pad.y = 2000 + (500 * Math.cos(iteration/50)) + getWorldHeight(pad.x,pad.z);
    world.prims[1].moveTo( pad );
    
    pad.x = 0;
    pad.y = 2000 + getWorldHeight(0,0);
    pad.z = 0;
    world.prims[2].moveTo( pad );

    pad.x = (Math.sin(iteration/24)*15000);
    pad.z = (Math.cos(iteration/16)*15000);
    pad.y = getWorldHeight(pad.x, pad.z) + 5100 + (Math.sin(iteration/6)*5000);
    primChaser.moveTo( pad );
    pad.x = (Math.sin((iteration+5)/24)*15000);
    pad.z = (Math.cos((iteration+5)/16)*15000);
    pad.y = getWorldHeight(pad.x, pad.z) + 5100 + (Math.sin((iteration+5)/6)*5000);
    primChaser.lookAt( pad );
    
    pad.x = -Math.PI/2;
    pad.y = 0;
    pad.z = 0;
    primChaser.rotateBy( pad );
    
    pad.x = (Math.sin(iteration/2500)*10000);
    pad.z = (Math.cos(iteration/1700)*10000);
    pad.y = getWorldHeight(pad.x, pad.z) + 5500 + (Math.sin(iteration/1000)*5000);
    display.camera.moveTo( pad );
    pad.x = (Math.sin((iteration+10)/25)*9000);
    pad.z = (Math.cos((iteration+10)/17)*9000);
    pad.y = getWorldHeight(pad.x, pad.z) + 3500 + (Math.sin((iteration+10)/10)*5000);
    display.camera.lookAt( pad );
    
    //world.prims[0].lookAt( display.camera.getPosition() );
    //world.prims[1].lookAt( display.camera.getPosition() );
  }






var nextexpected = new Date().getTime();
function doFrame() {

    var timestart = new Date().getTime();

    if ((timestart - nextexpected) > 100)
    {
      document.getElementById("notes").innerHTML = "Garbage collection: " + (timestart - nextexpected);
    }

    iteration += 1;
    if (iteration > 100000)
      iteration = 0;


    if (animate > 0)
      doAnimation(timestart - animate + pauseset);
    
    display.render();
    
    var timeend = new Date().getTime();
    
    fpsstats.push(Math.floor(1000/(timeend - timestart)));
    var fpsstatslength = fpsstats.length;
    while (fpsstatslength > 10)
    {
        fpsstatslength--;
        fpsstats.shift();
    }
    
    var totalfps = 0;
    for (var i = 0; i < fpsstatslength; i++)
    {
        totalfps += fpsstats[i];
    }
      
    if (totalfps < 200 && display.camera._detailLevel > 0)
    {
//        console.log("lower");
        display.camera._detailLevel = display.camera._detailLevel * 0.95;
    }
        
    if (totalfps > 300 && display.camera._detailLevel < 1.0)
    {
//        console.log("higher");
        if (display.camera._detailLevel > 0)
          display.camera._detailLevel = display.camera._detailLevel * 1.0001;
        else
          display.camera._detailLevel = display.camera._detailLevel + 0.0001;
    }
        
      
    if (fpsspan !== null)
      fpsspan.innerHTML = "FPS " + totalfps/10 + " (" + display.camera._detailLevel.toFixed(5) + ")";
      
    if (primCounter !== null)
        primCounter.innerHTML = "Prims: " + display.renderinfo.primCount + "(" +  (display.renderinfo.primCount / (timeend-timestart)).toFixed(2) + "Kp/s)";

    if (animate > 0)
    {
        var nextTime = interval - (timeend - timestart);
        if (nextTime < 10)
            nextTime = 10;
        
        nextexpected = new Date().getTime() + nextTime;
        //setTimeout("doFrame();", nextTime);
    }
  }

window.onload=init;
