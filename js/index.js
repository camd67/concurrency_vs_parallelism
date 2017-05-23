"use strict";

$(function(){
    console.log(conData)
    expandWorkerData(conData);
    expandWorkerData(parData);

    // the actual worker visualization
    var work = worker()
        .attr("debug", false);
    d3.select("#conVis")
        .data([conData])
        .call(work);
    d3.select("#parVis")
        .data([parData])
        .call(work);

    $(window).scroll(function() {
        console.log("scrolling")
        var hT = $('#concurrency').offset().top,
            hH = $('#concurrency').outerHeight(),
            wH = $(window).height(),
            wS = $(this).scrollTop();
            console.log((hT-wH) , wS);
            if (wS > (hT+hH-wH)){
                advanceDataTarget(conData);
                d3.select("#conVis")
                    .data([conData])
                    .call(work);
            }
    });

    $(window).scroll(function() {
        console.log("scrolling")
        var hT = $('#parallelism').offset().top,
            hH = $('#parallelism').outerHeight(),
            wH = $(window).height(),
            wS = $(this).scrollTop();
            console.log((hT-wH) , wS);
            if (wS > (hT+hH-wH)){
                advanceDataTarget(parData);
                d3.select("#parVis")
                    .data([parData])
                    .call(work);
            }
    });
});
