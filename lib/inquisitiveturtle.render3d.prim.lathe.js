var inquisitiveturtle = inquisitiveturtle || function() {};
inquisitiveturtle.render3d = inquisitiveturtle.render3d || function() {};
  
if (typeof inquisitiveturtle.render3d.prim == "undefined")
  throw "You must include 'inquisitiveturtle.render3d.prim.js' before including 'inquisitiveturtle.render3d.prim.lathe.js'";
  




inquisitiveturtle.render3d.prim.lathe = function(color, turns, crosssection, minturns) {
    if (!minturns || minturns < 1)
      minturns = 2;
      
    this.__vector = inquisitiveturtle.render3d.vector;
    this.__face = inquisitiveturtle.render3d.face;
    
    this.init();
      

    this._points;
    this._faces;

    var levels = turns - minturns;
    this._levels = [];
    
    for (var level = 0; level <= levels; level++)
    {
      this._levels[level] = { detail: level/levels, points:[], faces:[] };
      this.generateModel(this._levels[level].detail, this._levels[level].points, this._levels[level].faces, color, minturns + level, crosssection);
    }
    
    this.calcModelDetail = function(model, world) {
      return Math.min(model*1000,world);
    };

    this.changeDetailLevel(0);
  };
  





inquisitiveturtle.render3d.prim.lathe.prototype = new inquisitiveturtle.render3d.prim();








inquisitiveturtle.render3d.prim.lathe.prototype.generateModel = function(detail, points, faces, color, turns, crosssection) {
    var TWOPI = Math.PI * 2;
    var STEP = TWOPI/turns;
    var SECTIONS = crosssection.length;

    var INDEXCOUNT = Math.min(SECTIONS, Math.ceil(3 + ((SECTIONS-3) * (500*detail))));
  
    var x,y,z;
    var section;
    var curr, prev;
    
    for (var j = 0; j <= turns; j++)
    {
      for (var i = 0; i < INDEXCOUNT; i++)
      {
        var index = Math.floor((SECTIONS-1) * (i/(INDEXCOUNT-1)));
        section = crosssection[index];

        if (j < turns)
        {
          x = Math.sin(j * STEP) * section[0];
          z = Math.cos(j * STEP) * section[0];
          y = section[1] - 0.5;
          
          points.push( new this.__vector(x,y,z) );
        }

        if (i > 0 && j > 0)
        {
          if (j == turns)
          {
            curr = 0;
            prev = turns-1;
          }
          else
          {
            curr = j;
            prev = j-1;
          }

          if (points[(curr * INDEXCOUNT) + (i-1)].x !== 0 || points[(curr * INDEXCOUNT) + (i-1)].z !== 0)
          {
            faces.push(
              new this.__face()
                .setColor(typeof color == "function"?color(i,j,turns,SECTIONS):color)
                .setPoints( [
                points[  (curr * INDEXCOUNT) + i      ], 
                points[  (curr * INDEXCOUNT) + (i-1)  ],
                points[  (prev * INDEXCOUNT) + (i-1)  ],
                points[  (prev * INDEXCOUNT) + i      ]
              ]));
          }
          else
          {
            faces.push(
              new this.__face()
                .setColor(typeof color == "function"?color(i,j,turns,SECTIONS):color)
                .setPoints( [
                points[  (curr * INDEXCOUNT) + i      ], 
                points[  (prev * INDEXCOUNT) + (i-1)  ],
                points[  (prev * INDEXCOUNT) + i      ]
              ]));
          }
        }
      }
    }

  };



