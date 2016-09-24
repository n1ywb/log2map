/**
 * Created by jeff on 9/24/16.
 */
    // TODO TOMORROW

// forget about projecting the lines; get the centroid and BB of the map and draw the lines
// using SVG origin. Projecting them basically a no-op anyway.

// http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});


var width = 650,
  height = 650;

var GEOID_R = 6371000.0; // meters
var DEG_PER_M = 180.0 / (GEOID_R * Math.PI);

var range_major_step = 5e6;
var range_minor = true;

var bearing_major_step = 30;
var bearing_minor = true;

var home_c = [-72.486237, 44.197227];

var home = {
  id: "Home",
  type: "Feature",
  properties: null,
  geometry: {
    type: "Point",
    coordinates: home_c
  },
};

function d(m) {
  return DEG_PER_M * m;
}

var home_rot = d3.geoRotation(home_c);

var projection = d3.geoAzimuthalEquidistant()
  .scale(100)
  // TODO it's really this hard to center a map?
  .rotate(home_rot.invert([0, 0]))
  .translate([width / 2, height / 2])
  .clipAngle(180 - 1e-3)
  .precision(0.1);

var path = d3.geoPath()
  .projection(projection);

var circle = d3.geoCircle()
  .center(home_c);

var range_major_list = _.range(range_major_step, GEOID_R * Math.PI, range_major_step);
var max_range = _.last(range_major_list)

var circles = _.map(
  range_major_list,
  function(i) {
    return circle.radius(d(i))()
  });

function radians(deg) {
  return Math.PI / 180.0 * deg;
}

function polar2rect(d, bearing) {
  rads = radians(bearing);
  x = d * Math.sin(rads);
  y = d * Math.cos(rads);
  return [x, y];
}

var bearing_points = _.map(
  _.range(0, 360, bearing_major_step),
  function(i) {
    b = path.bounds(_.last(circles));
    return polar2rect((b[1][0] - b[0][0]) / 2, i);
  }
);

var lines =
  _.map(
    bearing_points,
    function(i) {
      c = path.centroid(home);
      x = i[0] + c[0];
      y = i[1] + c[1];
      return [c, [x, y]]
    }
  );

// var graticule = d3.geoGraticule();

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var g = {
  add: function(id) {
    this[id] = svg.append("g").attr("id", id);
  }
}

g.add("map_shapes");
g.add("map_boundaries");
g.add("qso_lines");
g.add("qso_points");
g.add("qth_point");
g.add("range_rings");
g.add("bearing_lines");


g.bearing_lines.selectAll("path")
  .data(lines)
  .enter()
  .append("path")
  .attr("class", "graticule bearing_lines")
  .attr("d", d3.line());

g.range_rings.append("path")
  .datum({
    type: "GeometryCollection",
    geometries: circles
  })
  .attr("class", "graticule range_rings")
  .attr("d", path);

g.qth_point.append("path")
  .datum(home)
  .attr("class", "home")
  .attr("d", path);

if (true) {
  d3.json("https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json", function(error, world) {
    if (error) throw error;

    g.map_shapes.insert("path")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "map_shapes")
      .attr("d", path);

    g.map_boundaries.insert("path")
      .datum(topojson.feature(world, world.objects.countries))
      .attr("class", "map_boundaries")
      .attr("d", path);
  });
}

d3.select(self.frameElement).style("height", height + "px");

//'test.geojson'

d3.json($.getUrlVar("log"), function(error, qso_data){
    console.log(JSON.stringify(qso_data));
    g.qso_points.append("path")
      .datum(qso_data.points)
      .attr("class", "qso_points")
      .attr("d", path);

    g.qso_lines.append("path")
      .datum(qso_data.lines)
      .attr("class", "qso_lines")
      .attr("d", path);

});
