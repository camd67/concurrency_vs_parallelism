"use strict";

function worker(){
    var attrs = {
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        width: 400,
        height: 400,
        animationDuration: 1000,
        sourceSize: 25,
        workerSize: 25,
        debug: false, // set to true if you want to see small red circles for every target
        maxTargets: 0,
        animIsPlaying: false,
        easeExpo: 1.5
    }
    var _drawWidth = attrs.width - attrs.margin.left - attrs.margin.right;
    var _drawHeight = attrs.height - attrs.margin.top - attrs.margin.bottom;

    var vis = function(selection){
        _reset();
        var easeFunc = d3.easePolyInOut.exponent(attrs.easeExpo);
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
            var sourceList = data.sources.sort(function(a, b) { return a.id - b.id; });

            // draw all source boxes
            var source = ele.select(".chartg").selectAll(".source").data(data.sources, function(d) { return d.id; });
            var sourceGroups = source.enter()
                .append("g");
            sourceGroups.append("rect")
                .attr("class", "source")
                .attr("width", function(d) { return d.w; })
                .attr("height", function(d) { return d.h; })
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; })
                .style("fill", "none")
                .attr("stroke", function(d) { return d.color; })
                ;

            /*=================== WEIGHT AND WORKER CREATION ===================*/
            // draw all workers that move around
            var workers = ele.select(".chartg").selectAll(".worker-group").data(data.workers, function(d) { return d.id;});
            // Append all the worker wrappers, worker boxes, and worker carry boxes
            var workerBoxes = workers.enter()
                .append("g")
                .attr("class", "worker-group");

            // workers
            workerBoxes.append("path")
                .attr("class", function(d) { return "worker wid" + d.id; })
                .attr("width", attrs.workerSize)
                .attr("height", attrs.workerSize)
                .style("fill", function(d) { return d.color; })
                .attr("x", function(d) { return getTargetValue(d, targetList, "x"); })
                .attr("y", function(d) { return getTargetValue(d, targetList, "y"); })
                ;

            var weights = ele.select(".chartg").selectAll(".weight-group").data(data.weights, function(d){ return d.id; })

            var weightBoxes = weights.enter()
                .append("g")
                .attr("class", "weight-group");
            // weights
            weightBoxes.append("rect")
                .attr("class", function(d) { return "weight wid"+ + d.id; })
                .attr("width", function(d) { return d.carryWeight; })
                .attr("height", function(d) { return d.carryWeight; })
                .style("fill", function(d) { return d.color; })
                .style("stroke", function(d) { return "#000"; })
                .attr("y", function(d) { return d.weightY; })
                .attr("x", function(d) { return d.weightX; })
                ;

            /*=================== WEIGHT AND WORKER ANIMATIONS ===================*/
            // BEFORE doing anything else, quickly move the weights back to their original positions
            weights.selectAll(".weight").merge(weights)
                .transition()
                .duration(150)
                .attr("x", function(d){ attrs.animIsPlaying = true; return d.weightX; })
                .attr("y", function(d){ return d.weightY; })
                ;
            // merge in workers for the animations
            var workerBoxesMerge = workers.selectAll(".worker").merge(workers)
                .transition()
                .ease(easeFunc)
                .duration(attrs.animationDuration)
                .delay(function(d) { return data.sync
                    ? d.subGroupIndex * attrs.animationDuration
                    : d.globalIndex * attrs.animationDuration; })
                .on("start", function repeat(){
                    d3.active(this)
                        .attr("x", function(d) { return getTargetValue(d, targetList, "x"); })
                        .attr("y", function(d) { return getTargetValue(d, targetList, "y"); })
                        .transition()
                        .ease(easeFunc)
                        .duration(function(d) {
                            var dur = attrs.animationDuration;
                            if(d.target > -1 && d.target < d.targets.length - 1){
                                dur *= d.carryWeight / 15;
                            }
                            return dur;
                        })
                        .on("start", repeat)
                        .on("end", function(d){
                            // cancel the animation if we're back at the start
                            if(d.target === -1) { d3.select(this).interrupt(); attrs.animIsPlaying = false; }
                            else { targetIncrement(d, true); }
                        })
                });

                // weight boxes, mostly same animation as the first one except it has some specifics for weight movement
                var weightBoxesMerge = weights.selectAll(".weight").merge(weights)
                    .transition()
                    .ease(easeFunc)
                    .duration(attrs.animationDuration)
                    .delay(function(d) { return data.sync
                        ? d.subGroupIndex * attrs.animationDuration
                        : d.globalIndex * attrs.animationDuration; })
                    .on("start", function repeat(){
                        d3.active(this)
                            .attr("x", function(d) { return getWeightTargetValue(d, targetList, "x", true); })
                            .attr("y", function(d) { return getWeightTargetValue(d, targetList, "y", true); })
                            .transition()
                            .ease(easeFunc)
                            .duration(function(d) {
                                var dur = attrs.animationDuration;
                                if(d.target > -1 && d.target < d.targets.length - 1){
                                    dur *= d.carryWeight / 15;
                                }
                                return dur;
                            })
                            .on("start", repeat)
                            .on("end", function(d){
                                // cancel the animation if we're back at the start
                                if(d.target === -1) { d3.select(this).interrupt(); }
                                else { targetIncrement(d, false); }
                            })
                    });

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
                ? worker.x
                : targetList[worker.targets[worker.target]].x + worker.horizOffset;
        }
    }

    function getWeightTargetValue(weight, targetList, val){
        if(val === "y"){
            if(weight.weightTarget <= -1){
                return weight.weightY;
            } else if(weight.weightTarget >= weight.targetCount){
                return weight.weightEndY;
            } else {
                return targetList[weight.targets[weight.weightTarget]].y;
            }
        } else {
            if(weight.weightTarget <= -1){
                return weight.weightX;
            } else if(weight.weightTarget >= weight.targetCount){
                return weight.weightEndX;
            } else {
                return targetList[weight.targets[weight.weightTarget]].x + weight.horizOffset  + attrs.workerSize + 10;
            }
        }
    }
    // increment the target, keeping the value in bounds
    function targetIncrement(worker, isWorker){
        // always increment target, so everyone's in sync
        worker.target++;
        worker.target = worker.target > worker.targets.length - 1 ? -1 : worker.target;
        if(!isWorker)
        {
            // don't wrap weight targets
            worker.weightTarget++;
        }
    }

    // Reset any calculated variables, such as scales, functions, or values
    function _reset(data) {
        _drawWidth = attrs.width - attrs.margin.left - attrs.margin.right;
        _drawHeight = attrs.height - attrs.margin.top - attrs.margin.bottom;
    }

    return vis;
}


function randomRange(min, max){
    return Math.random() * (max - min) + min;
}

// Expand the worker data from the compressed form (with count) to an expanded version
function expandWorkerData(data) {
    var toReplace = [];
    var weights = [];
    var currId = 0;
    var weightId = 0;
    var targetList = data.targets.sort(function(a, b) { return a.id - b.id; });
    var sourceList = data.sources.sort(function(a, b) { return a.id - b.id; });
    // alternate between each of the columns so each column is depleted equally, if in sync
    var alternatingIndex = 0;
    for(var i = 0; i < data.workers.length; i++){
        alternatingIndex = i;
        for(var workCount = 0; workCount < data.workers[i].count; workCount++){
            var curr = data.workers[i];
            var cw = Math.floor(randomRange(curr.carryWeightRange[0], curr.carryWeightRange[1]));
            var firstSource = sourceList[curr.targets[0]];
            var lastSource = sourceList[curr.targets[curr.targets.length - 1]];
            var horizOffset = Math.random() * (firstSource.w - cw);
            for(var weightCount = 0; weightCount < curr.weightCount; weightCount++){
                var newWeight = {
                    // some stats need to be shared between worker and weight. Mostly for anim timing
                    globalIndex: alternatingIndex,
                    groupIndex: i,
                    subGroupIndex: workCount,
                    id: weightId,
                    target: curr.target,
                    targets: curr.targets,
                    carryWeight: cw,
                    color: curr.color,
                    targetCount: curr.targetCount,
                    horizOffset: horizOffset,
                    // weight needs to keep track of it's own target
                    // start negative so that it "waits" till it's turn
                    weightTarget: curr.weightTarget - (curr.targetCount * weightCount),
                    baseWeightTarget: curr.weightTarget - (curr.targetCount * weightCount),
                    // start and end positions for the weights
                    // Randomly generated within the source boxes
                    weightX: Math.random() * (firstSource.w - cw) + firstSource.x,
                    weightEndX: Math.random() * (lastSource.w - cw) + lastSource.x,
                    weightY: Math.random() * (firstSource.h - cw) + firstSource.y,
                    weightEndY:  Math.random() * (lastSource.h - cw) + lastSource.y
                };
                weightId++;
                weights.push(newWeight);
            }
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
                // Global unique id, in the order the cubes appears
                id: currId,
                targets: curr.targets,
                // various calculations for the carry weights
                carryWeight: cw,
                horizOffset: horizOffset
            };
            currId++;
            alternatingIndex += data.workers.length;
            toReplace.push(toAdd);
        }
    }
    data.weights = weights;
    data.workers = toReplace;
}

function resetData(data){
    for(var i = 0; i < data.workers.length; i++){
        data.workers[i].target = -1;
    }
    for(var i = 0; i < data.weights.length; i++){
        data.weights[i].target = -1;
        data.weights[i].weightTarget  = data.weights[i].baseWeightTarget;
    }    
}

// goes through a data object and increments the worker targets, wrapping around to -1
function advanceDataTarget(data) {
    for(var i = 0; i < data.workers.length; i++){
        var curr = data.workers[i];
        curr.target++;
        curr.target = curr.target > data.targets.length - 1 ? -1 : curr.target;
    }
    for(var i = 0; i < data.weights.length; i++){
        var curr = data.weights[i];
        curr.weightTarget++;
        curr.target++;
        curr.target = curr.target > data.targets.length - 1 ? -1 : curr.target;
    }
}