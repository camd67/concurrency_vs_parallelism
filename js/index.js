"use strict";

$(function(){
    var xVar = 'year';
    var yVar = 'mhz';
    var chartData;
    
    // Load data in using d3's csv function.
    d3.csv('data/avg_year.csv', function(error, data) {
        // Put data into generic terms
        var prepData = function() {
            chartData = data.map(function(d) {
                return {
                    x: d[xVar],
                    y: d[yVar],
                };
            });
        };
        prepData();

        // Define function to draw ScatterPlot
        var chart = lineChart().xTitle('Year').yTitle('mhz');

        var chartWrapper = d3.select('#background-vis')
                .datum(chartData) 
                .call(chart); 
        
        // Initialize materialize style
        $('select').material_select()

    });

    expandWorkerData(conData);
    expandWorkerData(parData);
    expandWorkerData(sinData);

    // the actual worker visualization
    var work = worker()
        .attr("debug", false);
    d3.select("#con")
        .data([conData])
        .call(work);
    d3.select("#par")
        .data([parData])
        .call(work);
    d3.select("#sin")
        .data([sinData])
        .call(work);



    $(window).scroll(function() {
    var hT = $('#sequential').offset().top,
        hH = $('#sequential').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
        if (wS > (hT+hH-wH)){
            // console.log(worker().attr('animIsPlaying'));
            console.log(worker().attr("animIsPlaying"));
            if (!worker().attr('animIsPlaying')) {
                // console.log("animation")
                advanceDataTarget(sinData);
                d3.select("#sinVis")
                    .data([sinData])
                    .call(work);
                // console.log(worker().attr('animIsPlaying'));
            }
            
        }
    });


        
    
    

    $(window).scroll(function() {
        var hT = $('#concurrency').offset().top,
            hH = $('#concurrency').outerHeight(),
            wH = $(window).height(),
            wS = $(this).scrollTop();
            if (wS > (hT+hH-wH)){
                // console.log(worker().attr('animIsPlaying'));
                console.log(worker().attr("animIsPlaying"));
                if (!worker().attr('animIsPlaying')) {
                    // console.log("animation")
                    console.log(worker().attr("width"));
                     advanceDataTarget(conData);
                     console.log(isPlaying)
                    d3.select("#conVis")
                        .data([conData])
                        .call(work);
                    // console.log(worker().attr('animIsPlaying'));
                }
               
            }
    });

    $(window).scroll(function() {
        var hT = $('#parallelism').offset().top,
            hH = $('#parallelism').outerHeight(),
            wH = $(window).height(),
            wS = $(this).scrollTop();
            if (wS > (hT+hH-wH)){
                if (!worker().attr('animIsPlaying')) {
                    advanceDataTarget(parData);
                    d3.select("#parVis")
                        .data([parData])
                        .call(work);
                }
                
            }
    });
});
