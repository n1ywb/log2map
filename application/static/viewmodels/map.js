define(['plugins/http', 'durandal/app', 'knockout', 'd3', 'underscore', 'download', 'viewmodels/upload'],
    function (http, app, ko, d3, _, dl, upload) {
    var GEOID_R = 6371000.0; // meters
    var DEG_PER_M = 180.0 / (GEOID_R * Math.PI);

    var vm = function () {

        this._dataurl = ko.observable();

        this.onDownloadSVG = function () {
            svg = document.getElementById("map-svg");
            var svg_str = new XMLSerializer().serializeToString(svg);
            dl(svg_str, upload.filename() + '.svg', 'image/svg+xml')
        };

        this.onDownloadSVG = function () {
            svg = document.getElementById("map-svg");
            var svg_str = new XMLSerializer().serializeToString(svg);
            dl(svg_str, upload.filename() + '.svg', 'image/svg+xml')
        };

        this.activate = function (args) {
            if (args) {
                this._dataurl(args['log']);
            }
        };

        function radians(deg) {
            return Math.PI / 180.0 * deg;
        }

        function polar2rect(d, bearing) {
            var rads = radians(bearing);
            var x = d * Math.sin(rads);
            var y = d * Math.cos(rads);
            return [x, y];
        }

        function d(m) {
            return DEG_PER_M * m;
        }

        this._drawGraticule = function(origin, range_major_step, bearing_major_step, g, path)
        {
            return;
            var home_c = origin;

            var circle = d3.geoCircle()
                .center(home_c);

            var range_major_list = _.range(range_major_step, GEOID_R * Math.PI, range_major_step);
            var max_range = _.last(range_major_list)

            var circles = _.map(
                range_major_list,
                function (i) {
                    return circle.radius(d(i))()
                });

            var bearing_points = _.map(
                _.range(0, 360, bearing_major_step),
                function (i) {
                    var b = path.bounds(_.last(circles));
                    return polar2rect((b[1][0] - b[0][0]) / 2, i);
                }
            );

            var lines =
                _.map(
                    bearing_points,
                    function (i) {
                        var c = path.centroid({type:"Point", coordinates: home_c});
                        var x = i[0] + c[0];
                        var y = i[1] + c[1];
                        return [c, [x, y]]
                    }
                );

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
                .datum({type: "Point", coordinates: home_c})
                .attr("class", "home")
        };

        this._drawMap = function (home) {
            var MAP_URL = "static/ne_110m_admin_0_countries_lakes.geojson";
            var width = 900,
                height = 900;

            var range_major_step = 5e6;
            var range_minor = true;

            var bearing_major_step = 30;
            var bearing_minor = true;


            var home_c;
            if (home)
                home_c = home.geometry.coordinates;
            else
                home_c = [0,0];

            var home_rot = d3.geoRotation(home_c);

            var projection = d3.geoAzimuthalEquidistant()
                .scale(130)
                // TODO it's really this hard to center a map?
                .rotate(home_rot.invert([0, 0]))
                .translate([width / 2, height / 2])
                .clipAngle(180 - 1e-3)
                .precision(0.1);

            var zoom = d3.zoom()
                .scaleExtent([0.5, 9])
                .on("zoom", zoomed);

            var path = d3.geoPath()
                .projection(projection)
                .pointRadius(1);

            var svg = d3.select("#map-svg");

            http.get("static/css/log2map.css")
                .done(function(data, status, xhr){
                    svg.append("defs")
                        .append("style")
                            .attr("type", "text/css")
                            .text(data);
            }).fail(function(xhr, status, err){
                app.showMessage("failed to get css file")
            });

            var everything = svg.append("g");

            var g = {
                add: function (id) {
                    this[id] = everything.append("g").attr("id", id);
                }
            };

            g.add("map_shapes");
            g.add("map_boundaries");
            g.add("qso_lines");
            g.add("qso_points");
            g.add("qth_point");
            g.add("range_rings");
            g.add("bearing_lines");

            this._drawGraticule(home_c, range_major_step, bearing_major_step, g, path);

            svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height);

            svg
                .call(zoom);

            if (true) {
                d3.json(MAP_URL, function (error, world) {
                    if (error) throw error;

                    g.map_shapes.insert("path")
                        .datum(world)
                        .attr("class", "map_shapes")
                        .attr("d", path);
                });
            }

            function zoomed() {
                everything.attr("transform", d3.event.transform);
            }

            d3.select(self.frameElement).style("height", height + "px");

            //'test.geojson'

            if (this._dataurl()) {
                d3.json(this._dataurl(), function (error, qso_data) {
                    // console.log(JSON.stringify(qso_data));

                    projection.rotate(d3.geoRotation(qso_data.qth.geometry.coordinates).invert([0,0]));

                    d3.selectAll("path").attr("d", path);

                    g.qso_points.append("path")
                        .datum(qso_data.points)
                        .attr("class", "qso_points")
                        .attr("d", path);

                    g.qso_lines.append("path")
                        .datum(qso_data.lines)
                        .attr("class", "qso_lines")
                        .attr("d", path);
                });
            }
        };

        this.compositionComplete = function () {
            this._drawMap(upload.qth());
        };
    };

    return vm;
});
