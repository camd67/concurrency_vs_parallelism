function lineChart(){
    var margin = {top:30, right:10, left:70, bottom:50},
    width = 500,
    height = 500
    xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear(),
    xTitle = 'X Axis Title',
    yTitle = 'Y Axis Title',
    stroke = 'steelblue',
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
