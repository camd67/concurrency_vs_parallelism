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
    var sinWork = worker();
    var conWork = worker();
    var parWork = worker();
    var s = worker();
    var c = worker();
    var p = worker();

    d3.select("#con")
        .data([conData])
        .call(conWork);
    d3.select("#par")
        .data([parData])
        .call(parWork);
    d3.select("#sin")
        .data([sinData])
        .call(sinWork);

    d3.select("#c")
        .data([conData])
        .call(c);
    d3.select("#p")
        .data([parData])
        .call(p);
    d3.select("#s")
        .data([sinData])
        .call(s);


    $(window).scroll(function() {
    var hT = $('#sequential').offset().top,
        hH = $('#sequential').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
        if (wS > (hT+hH-wH)){
            console.log("scroll")
            if (!sinWork.attr('animIsPlaying')) {
                advanceDataTarget(sinData);
                d3.select("#sinVis")
                    .data([sinData])
                    .call(sinWork);
            }
        }
    });

    $(window).scroll(function() {
        var hT = $('#concurrency').offset().top,
            hH = $('#concurrency').outerHeight(),
            wH = $(window).height(),
            wS = $(this).scrollTop();
            if (wS > (hT+hH-wH)){
                if (!conWork.attr('animIsPlaying')) {
                     advanceDataTarget(conData);
                    d3.select("#conVis")
                        .data([conData])
                        .call(conWork);
                }
               
            }
    });

    $(window).scroll(function() {
        var hT = $('#parallelism').offset().top,
            hH = $('#parallelism').outerHeight(),
            wH = $(window).height(),
            wS = $(this).scrollTop();
            if (wS > (hT+hH-wH)){
                if (!parWork.attr('animIsPlaying')) {
                    advanceDataTarget(parData);
                    d3.select("#parVis")
                        .data([parData])
                        .call(parWork);
                }
                
            }
    });

    $(window).scroll(function() {
        var hT = $('#compare').offset().top,
            hH = $('#compare').outerHeight(),
            wH = $(window).height(),
            wS = $(this).scrollTop();
            if (wS > (hT+hH-wH)){
                if (!s.attr('animIsPlaying') && !c.attr('animIsPlaying') && !p.attr('animIsPlaying')) {
                    advanceDataTarget(conData);
                    d3.select("#c")
                        .data([conData])
                        .call(c);
                    advanceDataTarget(parData);
                    d3.select("#p")
                        .data([parData])
                        .call(p);
                    advanceDataTarget(sinData);
                    d3.select("#s")
                        .data([sinData])
                        .call(s);
                }
                
            }
    });
});
