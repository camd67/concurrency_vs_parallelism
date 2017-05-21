"use strict";

$(function(){
    var sampleData = {
            sources: [
                {
                    x: 200,
                    y: 50,
                    val: 10,
                    id: 1,
                    color: "#DDD"
                },
                {
                    x: 200,
                    y: 350,
                    val: 25,
                    id: 2,
                    color: "#333"
                }
            ],
            workers: [
                {
                    x: 100,
                    baseY: 100,
                    count: 2,
                    color: "#F0F",
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
            targets: [
                {
                    x: 200,
                    y: 90,
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
        var toReplace = [];
        var currId = 0;
        for(var i = 0; i < sampleData.workers.length; i++){
            for(var workCount = 0; workCount < sampleData.workers[i].count; workCount++){
                var curr = sampleData.workers[i];
                var toAdd = {
                    x: curr.x,
                    y: curr.baseY,
                    color: curr.color,
                    index: workCount,
                    target: curr.target,
                    id: currId
                };
                currId++;
                toReplace.push(toAdd);
            }
        }
        sampleData.workers = toReplace;
        console.log(sampleData);
    var work = worker();
    d3.select("#testVis")
        .data([sampleData])
        .call(work);

    $("#test-adv").click(function(){
        advanceDataTarget(sampleData);
        console.log(sampleData);
        d3.select("#testVis")
            .data([sampleData])
            .call(work);
    });

    // goes through a data object and increments the worker targets, wrapping around to -1
    function advanceDataTarget(data) {
        for(var i = 0; i < data.workers.length; i++){
            var curr = data.workers[i];
            curr.target++;
            curr.target = curr.target > data.targets.length - 1 ? -1 : curr.target;
        }
    }
});
