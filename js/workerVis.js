function worker(){
    var attrs = {
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        width: 800,
        height: 800,
        animationDuration: 500,
        sourceSize: 25,
        workerSize: 25,
        debug: true, // set to true if you want to see small red circles for every target
        maxTargets: 0
    }
    var _drawWidth = attrs.width - attrs.margin.left - attrs.margin.right;
    var _drawHeight = attrs.height - attrs.margin.top - attrs.margin.bottom;

    var vis = function(selection){
        _reset();
        selection.each(function(data, i){
            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg")
                .attr("width", attrs.width)
                .attr("height", attrs.height)
                .append("g")
                .attr("width", _drawWidth)
                .attr("height", _drawHeight);

            // Prep targets, since they need to be referenced outside of their draw code
            var targetList = data.targets.sort(function(a, b) { return a.id - b.id; });

            // draw all source boxes
            var source = gEnter.selectAll(".source").data(data.sources, function(d) { return d.id; });
            var sourceCircles = source.enter()
                .append("circle")
                .attr("class", "source")
                .merge(source)
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", attrs.sourceSize)
                .attr("fill", function(d) { return d.color; })
                ;
            var sourceText = source.enter()
                .append("text")
                .merge(source)
                .text(function(d) { return +d.val; })
                .attr("x", function(d) { return d.x - 10;})
                .attr("y", function(d) { return d.y;})
                .attr("fill", "#FFF")
                ;

            // draw all workers that move around
            var workers = gEnter.selectAll(".worker").data(data.workers, function(d) { return d.id;});
            var workerBoxes = workers.enter()
                .append("rect")
                .attr("class", function(d) { return "worker wid" + d.id; })
                .attr("width", attrs.workerSize)
                .attr("height", attrs.workerSize)
                .style("fill", function(d) { return d.color; })
                .attr("x", function(d) { return d.target === -1 ? d.x : targetList[d.target].x; })
                .attr("y", function(d) { return d.target === -1
                    ? d.y + (d.index * 2 * attrs.workerSize)
                    : targetList[d.target].y; })
                ;

            var workerBoxesMerge = workers.merge(workers)
                .transition()
                .delay(function(d) { console.log(d); return d.index * attrs.animationDuration; })
                .attr("x", function(d) { return d.target === -1 ? d.x : targetList[d.target].x; })
                .attr("y", function(d) { return d.target === -1
                    ? d.y + (d.index * 2 * attrs.workerSize)
                    : targetList[d.target].y; })
                ;
            workers.exit().remove();

            if(attrs.debug){
                var targets = gEnter.selectAll(".debug").data(data.targets, function(d) {return d.id;});
                var targetDraws = targets.enter()
                    .append("circle")
                    .attr("class", "debug")
                    .attr("cx", function(d){return d.x;})
                    .attr("cy", function(d){return d.y;})
                    .attr("r", 5)
                    .attr("fill", "red")
                    ;
            }

        });
    }

    vis.Attr = function(attr, val){
        if(!arguments.length) {
            console.warn("No arguments provided to attr method");
            return this;
        }
        if(attr == undefined || attr == null || attr.length == 0 || !attrs.hasOwnProperty(attr)){
            console.error("Improper attr: \"" + attr +"\" provided to worker.attr - Please use a string representing the attribute you'd like to modify");
            return this;
        }
        if(attr[0] === "_"){
            console.warn("Please do not modify private attributes");
            return this;
        }
        if(arguments.length < 2) { return attrs[attr]; }
        attrs[attr] = val;
        return this;
    }

    // Reset any calculated variables, such as scales, functions, or values
    function _reset() {
        _drawWidth = attrs.width - attrs.margin.left - attrs.margin.right;
        _drawHeight = attrs.height - attrs.margin.top - attrs.margin.bottom;
    }

    return vis;
}