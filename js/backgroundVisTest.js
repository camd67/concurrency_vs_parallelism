
$(function() {
    // Variables to show
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
});