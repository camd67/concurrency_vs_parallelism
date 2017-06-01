"use strict";

document.addEventListener("DOMContentLoaded", function(){
    expandWorkerData(conData);
    expandWorkerData(parData);
    expandWorkerData(sinData);

    // the actual worker visualization
    var parWork = worker()
        .attr("debug", true);
    var conWork = worker()
        .attr("debug", true);
    var sinWork = worker()
        .attr("debug", true);
    d3.select("#conVis")
        .data([conData])
        .call(conWork);
    d3.select("#parVis")
        .data([parData])
        .call(parWork);
    d3.select("#sinVis")
        .data([sinData])
        .call(sinWork);

    document.querySelector("#sin-adv").addEventListener("click", function(){
        resetData(sinData);
        advanceDataTarget(sinData);
        d3.select("#sinVis")
            .data([sinData])
            .call(sinWork);
    });
    document.querySelector("#con-adv").addEventListener("click", function(){
        resetData(conData);
        advanceDataTarget(conData);
        d3.select("#conVis")
            .data([conData])
            .call(conWork);
    });

    document.querySelector("#par-adv").addEventListener("click", function(){
        resetData(parData);
        advanceDataTarget(parData);
        d3.select("#parVis")
            .data([parData])
            .call(parWork);
    });
});
