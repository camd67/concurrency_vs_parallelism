function lineChart(){
    var margin = {top:30, right:40, left:50, bottom:50},
    width = 700,
    height = 500
    xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear(),
    xTitle = 'X Axis Title',
    yTitle = 'Y Axis Title',
    stroke = 'lightgray',
    strokeWidth = '1.5',
    title = '';

    var drawWidth = (width - margin.right - margin.left);
    var drawHeight = (height - margin.top - margin.bottom);

    var chart = function(selection) {
        selection.each(function(data){

            // Select svg if it exists
            var ele = d3.select(this);
            var svg = ele.selectAll('svg').data([data]);

            // Otherwise, append svg
            var svgEnter = svg.enter()
                .append('svg')
                .attr('width', width)
                .attr('height', height)
            
            // Chart title g
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + 20 + ')')
                .text(title)
                .attr('class', 'chart-title');
            
            // Chart line g
            svgEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr("class", 'chart-g');

            ///////// HOVERS STUFF OVERLAY //////////////
            // Apend an overlay rectangle to catch hover events
            var overlay = svgEnter.select('.chart-g').append('rect')
                .attr("class", "overlay")
                .attr('width', drawWidth)
                .attr('height', drawHeight)
                .attr('opacity', 0);
            //////// HOVER STUFF OVERLAY ////////////////

            // Append axes to the svgEnter element
            svgEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
                .attr('class', 'x-axis');
            
            svgEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
                .attr('class', 'y-axis');

            // Add a title g for the x axis
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 40) + ')')
                .attr('class', 'x-title');

            // Add a title g for the y axis
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + drawHeight / 2) + ') rotate(-90)')
                .attr('class', 'y-title');

            // Define xAxis and yAxis functions
            var xAxis = d3.axisBottom().tickFormat(d3.format(''));
            var yAxis = d3.axisLeft().tickFormat(d3.format('.2s'));

            // Calculate x and y scales
            var xMax = d3.max(data, function(d) {return +d.x;});
            var xMin = d3.min(data, function(d) {return +d.x;});
            xScale.range([0, drawWidth]).domain([xMin, xMax]);

            var yMin = d3.min(data, function(d) {return +d.y * .95;});
            var yMax = d3.max(data, function(d) {return +d.y * 1.05});
            yScale.range([drawHeight, 0]).domain([yMin, yMax]);
          
            // Calculate line path based on data
            var line = d3.line()
                .x(function(d) { return xScale(+d.x); })
                .y(function(d) { return yScale(+d.y); });

            // Update axes
            xAxis.scale(xScale);
            yAxis.scale(yScale);
            ele.select('.x-axis').transition().duration(1000).call(xAxis);
            ele.select('.y-axis').transition().duration(1000).call(yAxis);

            // Update titles
            ele.select('.x-title').text(xTitle);
            ele.select('.y-title').text(yTitle);

            // Draw line
            var lines = ele.select('.chart-g').selectAll('path').data(data, function(d) {return d});

            // Change to enter and transition lines
            lines.enter()
                .append('path')
                .attr('class', 'lines')
                .attr('d', line(data))
                .attr('fill', 'none')
                .attr('stroke', stroke)
                .attr('stroke-width', strokeWidth)
                .attr('stroke-dasharray', function() {return d3.select(this).node().getTotalLength() + " " + d3.select(this).node().getTotalLength();})
                .attr('stroke-dashoffset', function() {return d3.select(this).node().getTotalLength();})
                .transition().duration(1500)
                .attr('stroke-dashoffset', 0);

            // Update lines
            lines.attr('stroke-dasharray', 'none')
                .transition().duration(1500)
                .attr('d', line(data))
                .attr('stroke', stroke);

            // Exit lines
            lines.exit()
                .transition().duration(1500)
                .attr('stroke-dashoffset', function() {return -d3.select(this).node().getTotalLength();})
                .attr('stroke-dasharray', function() {return d3.select(this).node().getTotalLength() + " " + d3.select(this).node().getTotalLength();})
                .remove();

            ///////////////////// START HOVER STUFF ///////////////////////
            // Function to draw hovers (circles and text) based on year (called from the `overlay` mouseover)
            function drawHovers(year) {
                // Bisector function to get closest data point: note, this returns an *index* in your array
                // Get hover data by using the bisector function to find the y value
                var bisector = d3.bisector(function(d, x) {
                    return +d.x - x;
                }).left;

                // Iterate through your selectedData array
                // Sort the values of each country by +year
                // Return the element closest to your year variable.
                var bisectors = []
                    data.sort(function(a, b) {
                        return (+a.x) - (+b.x);
                    });

                    bisectors.push(data[bisector(data, year)]);
          
                // Do a data-join (enter, update, exit) to draw circles
                var circles = svgEnter.select('.chart-g').selectAll('circle')
                    .data(function(d) { return bisectors; });

                circles.enter().append('circle')
                    .attr('r', 4)
                    .attr('cx', function(d) {
                        return xScale(d.x);
                    })
                    .attr('cy', function(d) {
                        return yScale(d.y);
                    })
                    .style('stroke', 'red')
                    .style('fill', 'none')
                    .style('stroke-width', '1px');

                circles
                    .transition().duration(50)
                    .attr('cx', function(d) {
                        return xScale(d.x);
                    })
                    .attr('cy', function(d) {
                        return yScale(d.y);
                    });

                circles.exit().remove();

                // Do a data-join (enter, update, exit) draw text
                var hoverText = svgEnter.select('.chart-g').selectAll('.hoverText')
                    .data(function(d) { return bisectors; });

                hoverText.enter().append('text')
                    .attr('class', 'hoverText')
                    .attr('x', function(d) {return xScale(d.x);})
                    .attr('y', function(d) {return yScale(d.y);})
                    .attr('transform', 'translate(5,-5)')
                    .text(function(d) {return Math.round(d.y)})
                    .style('text-shadow', '-1px 0 10px white, 0 1px 10px white, 1px 0 10px white, 0 -1px 10px white');

                hoverText  
                    .transition().duration(10)
                    .attr('x', function(d) {return xScale(d.x);})
                    .attr('y', function(d) {return yScale(d.y);})
                    .text(function(d) {return Math.round(d.y)})

                hoverText.exit().remove();
            }

            // Call Hover Stuff
            overlay
            .on('mousemove', function(){
                var checkYear = xScale.invert(d3.mouse(this)[0]);
                if(checkYear >= xMax){
                    checkYear = xMax
                }
                if(checkYear <= xMin){
                    checkYear = xMin
                }
                drawHovers(checkYear);
            })
            .on('mouseout', function() {
                svgEnter.select('.chart-g').selectAll('circle').remove();
                svgEnter.select('.chart-g').selectAll('.hoverText').remove();
            })
            ///////////////////// END HOVER STUFF /////////////////////////




        });
    };

    // Getter/setter methods to change locally scoped options
    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.stroke = function(value) {
        if (!arguments.length) return stroke;
        stroke = value;
        return chart;
    };

    chart.strokeWidth = function(value) {
        if (!arguments.length) return strokeWidth;
        strokeWidth = value;
        return chart;
    };

    chart.xTitle = function(value) {
        if (!arguments.length) return xTitle;
        xTitle = value;
        return chart;
    };

    chart.yTitle = function(value) {
        if (!arguments.length) return yTitle;
        yTitle = value;
        return chart;
    };

    return chart;

};
