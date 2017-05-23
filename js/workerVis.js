function worker(){
    var attrs = {
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        width: 800,
        height: 400,
        animationDuration: 1000,
        sourceSize: 25,
        workerSize: 25,
        debug: false, // set to true if you want to see small red circles for every target
        maxTargets: 0
    }
    var _drawWidth = attrs.width - attrs.margin.left - attrs.margin.right;
    var _drawHeight = attrs.height - attrs.margin.top - attrs.margin.bottom;

    var vis = function(selection){
        _reset();
        selection.each(function(data, i){
            // Select the svg element, if it exists.
            var ele = d3.select(this)
            var svg = ele.selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var svgEnter = svg.enter().append("svg")
                .attr("width", attrs.width)
                .attr("height", attrs.height)
                .append("g")
                .attr("width", _drawWidth)
                .attr("height", _drawHeight)
                .attr("class", "chartg");

            // Prep targets, since they need to be referenced outside of their draw code
            var targetList = data.targets.sort(function(a, b) { return a.id - b.id; });

            // draw all source boxes
            var source = ele.select(".chartg").selectAll(".source").data(data.sources, function(d) { return d.id; });
            var sourceGroups = source.enter()
                .append("g");
            sourceGroups.append("circle")
                .attr("class", "source")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", attrs.sourceSize)
                .attr("fill", function(d) { return d.color; })
                ;
            sourceGroups.append("text")
                .attr("class", "sourceText")
                .text(function(d) { return d.val; })
                .attr("x", function(d) { return d.x - 10;})
                .attr("y", function(d) { return d.y;})
                .attr("text-anchor", "middle")
                .attr("fill", "#FFF")
                ;

            // draw all workers that move around
            var workers = ele.select(".chartg").selectAll(".worker").data(data.workers, function(d) { return d.id;});
            var workerBoxes = workers.enter()
                .append("rect")
                .attr("class", function(d) { return "worker wid" + d.id; })
                .attr("width", attrs.workerSize)
                .attr("height", attrs.workerSize)
                .style("fill", function(d) { return d.color; })
                .attr("x", function(d) { return getTargetValue(d, targetList, "x"); })
                .attr("y", function(d) { return getTargetValue(d, targetList, "y"); })
                ;

            var workerBoxesMerge = workers.merge(workers)
                .transition()
                .duration(attrs.animationDuration)
                .delay(function(d) { return data.sync
                    ? d.subGroupIndex * 2 * attrs.animationDuration
                    : d.globalIndex * 2 * attrs.animationDuration; })
                .on("start", function repeat(){
                    d3.active(this)
                    .attr("x", function(d) { return getTargetValue(d, targetList, "x"); })
                    .attr("y", function(d) { return getTargetValue(d, targetList, "y"); })
                    .transition()
                    .duration(attrs.animationDuration)
                    .on("start", repeat)
                    .on("end", function(d){
                        // cancel the animation if we're back at the start
                        if(d.target === -1) { d3.select(this).interrupt(); }
                        else { targetIncrement(d); }
                    })
                })
                ;
            workers.exit().remove();

            if(attrs.debug){
                var targets = ele.select(".chartg").selectAll(".debug").data(data.targets, function(d) {return d.id;});
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

    vis.attr = function(attr, val){
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

    // get a value from either the worker or the list of targets, searching till a new type is found
    function getTargetValue(worker, targetList, val) {
        if(val === "y"){
            return worker.target === -1
                // adjust so there's a 1 worker gap between each worker
                ? worker.y + (worker.subGroupIndex * 2 * attrs.workerSize)
                : targetList[worker.targets[worker.target]].y;
        } else {
            return worker.target === -1
                ? worker[val]
                : targetList[worker.targets[worker.target]][val];
        }
    }
    // increment the target, keeping the value in bounds
    function targetIncrement(worker){
        worker.target++;
        worker.target = worker.target > worker.targets.length - 1 ? -1 : worker.target;
    }

    // Reset any calculated variables, such as scales, functions, or values
    function _reset() {
        _drawWidth = attrs.width - attrs.margin.left - attrs.margin.right;
        _drawHeight = attrs.height - attrs.margin.top - attrs.margin.bottom;
    }

    return vis;
}

// Expand the worker data from the compressed form (with count) to an expanded version
function expandWorkerData(data) {
    var toReplace = [];
    var currId = 0;
    // alternate between each of the columns so each column is depleted equally, if in sync
    var alternatingIndex = 0;
    for(var i = 0; i < data.workers.length; i++){
        alternatingIndex = i;
        for(var workCount = 0; workCount < data.workers[i].count; workCount++){
            var curr = data.workers[i];
            var toAdd = {
                // default x pos
                x: curr.x,
                // default y pos (for the entire group, calced in d3 draw code)
                y: curr.baseY,
                // Color of the worker
                color: curr.color,
                // Global index, this is unique for all workers
                globalIndex: alternatingIndex,
                // Group the worker belongs to
                groupIndex: i,
                // index WITHIN the group the worker belongs to
                subGroupIndex: workCount,
                // target to move to (-1 == default x,y)
                target: curr.target,
                // Global unique id, in the order the cubes appear. TODO: This may not be needed
                id: currId,
                targets: curr.targets
            };
            currId++;
            alternatingIndex += data.workers.length;
            toReplace.push(toAdd);
        }
    }
    data.workers = toReplace;
}

// goes through a data object and increments the worker targets, wrapping around to -1
function advanceDataTarget(data) {
    for(var i = 0; i < data.workers.length; i++){
        var curr = data.workers[i];
        curr.target++;
        curr.target = curr.target > data.targets.length - 1 ? -1 : curr.target;
    }
}