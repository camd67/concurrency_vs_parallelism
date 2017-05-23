"use strict";



$(function(){
    var sampleData = {
        // leaving this in the JS -for now- since you can't have comments in JSON
            // the list of all sources of information (where the workers go to/from, that are drawn)
            sources: [
                {
                    x: 200,
                    y: 50,
                    // the value to draw onto the source, string or number
                    val: 10,
                    id: 1,
                    color: "#111"
                },
                {
                    x: 200,
                    y: 350,
                    val: 25,
                    id: 2,
                    color: "#333"
                }
            ],
            // all the workers that move around the vis
            workers: [
                {
                    x: 100,
                    baseY: 100,
                    // number of workers with this initial group
                    count: 2,
                    color: "#F0F",
                    // the index of the target to move to, -1 = default pos
                    target: -1
                },
                {
                    x: 300,
                    baseY: 100,
                    count: 4,
                    color: "#0FF",
                    target: -1
                }
            ],
            // invisible targets that workers move to
            targets: [
                {
                    x: 200,
                    y: 90,
                    // this is the "target" attribute that workers point to
                    id: 1,
                    // the note doesn't actually "do" anything, it's there as a comment for us
                    // since we can't see the target without debug on
                    note: "first circle"
                },
                {
                    x: 200,
                    y: 300,
                    id: 2,
                    note: "second circle"
                }
            ]
        };

    expandWorkerData(sampleData);

    // the actual worker visualization
    var work = worker();
    d3.select("#testVis")
        .data([sampleData])
        .call(work);

    // BROKEN: Advance the animation one step
    // $("#test-adv").click(function(){
    //     advanceDataTarget(sampleData);
    //     console.log(sampleData);
    //     d3.select("#testVis")
    //         .data([sampleData])
    //         .call(work);
    // });
    $(window).ready(function(){
    advanceDataTarget(sampleData);
        console.log(sampleData);
        d3.select("#testVis")
            .data([sampleData])
            .call(work);
})

    

    // Expand the worker data from the compressed form (with count) to an expanded version
    function expandWorkerData(data) {
        var toReplace = [];
        var currId = 0;
        // alternate between each of the columns so each column is depleted equally
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
                    id: currId
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
