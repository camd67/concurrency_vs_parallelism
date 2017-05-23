"use strict";

$(function(){
    expandWorkerData(conData);
    expandWorkerData(parData);

    // the actual worker visualization
    var work = worker()
        .attr("debug", true);
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
});
