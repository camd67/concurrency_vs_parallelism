"use strict";

$(function(){
    expandWorkerData(conData);
    expandWorkerData(parData);

    // the actual worker visualization
    var work = worker();
    d3.select("#conVis")
        .data([conData])
        .call(work);
    d3.select("#parVis")
        .data([parData])
        .call(work);

    $("#con-adv").click(function(){
        advanceDataTarget(conData);
        d3.select("#conVis")
            .data([conData])
            .call(work);
    });
    $("#par-adv").click(function(){
        advanceDataTarget(parData);
        d3.select("#parVis")
            .data([parData])
            .call(work);
    });

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
});
