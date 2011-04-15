if (typeof inquisitiveturtle == "undefined")
  inquisitiveturtle = function() {}
  
if (typeof inquisitiveturtle.render3d == "undefined")
  inquisitiveturtle.render3d = function() {}
  
if (typeof inquisitiveturtle.render3d.prim == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.prim.js' before including 'inquisitiveturtle.render3d.prim.floor.js'";
  




inquisitiveturtle.render3d.prim.floor = function(color, tiles, height, mintiles) {
    this.__vector = inquisitiveturtle.render3d.vector;
    this.__face = inquisitiveturtle.render3d.face;
    
    this.init();

    if (mintiles == null || mintiles < 2)
      mintiles = 2;

    var levels = tiles - mintiles;
    this._levels = [];
    
    for (var level = 0; level <= levels; level++)
    {
      this._levels[level] = { detail: level/levels, points:[], faces:[] };
      this.generateModel(this._levels[level].detail, this._levels[level].points, this._levels[level].faces, color, mintiles + level, height);
    }
    
    this.calcModelDetail = function(model, world) {
      return (model * world);
    }

    this.changeDetailLevel(0.5);
    //this._levels = null;
  }


inquisitiveturtle.render3d.prim.floor.prototype = new inquisitiveturtle.render3d.prim();






inquisitiveturtle.render3d.prim.floor.prototype.generateModel = function(detail, points, faces, color, tiles, height) {
    var STEP = 1/tiles;
    tiles++;

    var x,y,z;
    var currentColor;
    for (var j = 0; j < tiles; j++)
    {
      for (var i = 0; i < tiles; i++)
      {
        x = (i * STEP) - 0.5;
        z = (j * STEP) - 0.5;
        
        if (typeof height == "function")
        {
          y = height(x,z, ( (i+1) * STEP ) - 0.5, ( (j+1) * STEP) - 0.5);
        }
        else
        {
          y = height;
        }
        
        points.push( new this.__vector(x,y,z) );

        if (i > 0 && j > 0)
        {
          faces.push(
            new this.__face()
            .setColor(typeof color == "function"?color(x,z, ( (i+1) * STEP ) - 0.5, ( (j+1) * STEP) - 0.5):color)
            .setPoints([ 
              points[  (j     * tiles) + i      ], 
              points[  ((j-1) * tiles) + i      ],
              points[  ((j-1) * tiles) + (i-1)  ],
              points[  (j     * tiles) + (i-1)  ]
            ])
          );
        }
      }
    }

  }



