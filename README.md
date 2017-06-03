# Concurrency vs Parallelism

Welcome. We have created an explorable explanation of concurrency and parallelism concepts to help people to understand these concepts and the differences between these concepts better. We do this through the use of visualizations written in D3.JS and explanations. These visualizations are reusable.

## How our code works

### Line Chart

This backgroundVisTest visualization takes in data pulled from [https://github.com/preshing/analyze-spec-benchmarks](https://github.com/preshing/analyze-spec-benchmarks). From this data, the 'date' and 'mhz' columns were extracted. From the date column, the year value was extracted. The average 'mhz' for all the cpu test units in a given year was calculated. This new condensed dataset with two columns was used to create the first visualization. 

The first visualization creates a reusable line chart with a hovering element to show the values of data points. This visualization shows how the efficiency of computers has changed throughout history.

#### Data Prep

The *lineCharts.js* file uses mapped datasets or arrays to display data.
The dataset used for our page can be found in the data folder as `avg_year.csv`.

To prepare the data, load in your data and use the following method to map the data:

```js
var prepData = function() {
    chartData = data.map(function(d) {
        return {
            x: d[xVar],
            y: d[yVar],
        };
    });
};

prepData(); // Call the function to prep your data
```

#### Initialize, Draw, Update

To get started on rendering the chart, use the following approach:

```js
// Define function to draw the line chart
var chart = lineChart().param1(value1).param2(value2);

// Select your div, join the data, and call the chart
var chartWrapper = d3.select('#my-div')
        .datum(chartData) 
        .call(chart); 
```

To update the data or parameters, use:

```js
// Update a chart parameter and the data (on some event handler)
chart.param1(newValue);
chartWrapper.datum(newDataSet).call(chart);
```

#### API Reference

**.height(*int*)**

Sets the *height* of the svg. The default height is 300.
If the parameter of `.height()` is not specified, returns height.

**.width(*int*)**

Sets the *width* of the svg. The default width is 500.
If the parameter of `.width()` is not specified, returns width.

**.strokeColor(*string*)**

Sets the *color* of the line. The default color is light gray.
If the parameter of `.strokeColor()` is not specified, returns the color of the line.

**.strokeWidth(*int*)**

Sets the width of the line. The default width is 1.5.
If the parameter of `.strokeWidth()` is not specified, returns the line width of the line.

**.xTitle(*string*)**

Sets the *title of the x-axis*. The x-axis title will not show if method is not called with a value.
If the parameter of `.xTitle()` is not specified, returns title of x-axis.

**.yTitle(*string*)**

Sets the *title of the y-axis*. The y-axis title will not show if method is not called with a value.
If the parameter of `.yTitle()` is not specified, returns title of y-axis. 

**.title(*string*)**

Sets the *title of the line chart*. The chart title will not show if method is not called with a value.
If the parameter of `.title()` is not specified, returns title of chart.

**.hoverColor(*string*)**

Sets the *color of the hover circle*. The default color is red.
If the parameter of `.hoverColor()` is not specified, returns color of hover circle.

### Worker Visualization

#### Data Object
In order to properly use workerVis.js you need a properly structured data object. This is an annotated example of the data object:
```js
{
    // the list of all sources of information (where the workers go to/from, that are drawn)
    // Since these are just rectangles, all attributes are required
    sources: [
        {
            // Top left X coord
            x: 75,
            // Top left Y coord
            y: 25,
            // width of the rectangle
            w: 100,
            // Height of the rectangle
            h: 75,
            // ID of the source
            id: 1
        },
        {
            // See above
            x: 225,
            y: 300,
            w: 100,
            h: 75,
            id: 2
        }
    ],
    // all the workers that move around the vis, represented as little people
    workers: [
        {
            // X coord to start at for all workers
            x: 25,
            // y coord to start at, workers are drawn in a column with some offset
            baseY: 125,
            // number of workers with this initial group
            count: 3,
            // Color of the weights (all workers are #000)
            color: "#F0F",
            // The index of the target to move to, -1 = default pos
            target: -1,
            // The base index of the weights for their animations, -1 = default pos
            weightTarget: -1,
            // number of weights to pick up (requires equal amount of target loops)
            weightCount: 1,
            // how many targets are in the main loop (usually 2)
            targetCount: 2,
            // the targets that are valid for this worker (0-based, not ID based!)
            targets: [0, 1],
            // weight range from minimum to maximum. If you want all same weights set it to [x, x+1]. Weights must be > 0
            // for example, [15,16]
            carryWeightRange: [15, 50]
        },
        {
            // See above
            x: 350,
            baseY: 125,
            count: 3,
            color: "#0FF",
            target: -1,
            weightTarget: -1,
            weightCount: 1,
            targetCount: 2,
            targets: [1, 3],
            carryWeightRange: [20, 25]
        }
    ],
    // invisible targets that workers move to. Turn debug on (.attr("debug", true); in order to render them on the screen)
    targets: [
        {
            // X coord of the target (single point)
            x: 75,
            // Y coord of the target (single point)
            y: 100,
            // this is the "target" attribute that workers point to
            id: 1
        },
        {
            // See above
            x: 225,
            y: 300,
            id: 2
        }
    ],
    // whether each of the columns should be animated together or separate
    // animate together works best when there are an equal number of worker groups and input/output
    sync: true
};
```
It is important to note that functions such as `expandWorkerData` do modify the object passed in, so if you are re-using objects make sure to clone them first.

#### Example usage
In order to use workerVis.js you need to do a few steps.
1. Create your data object, as described above
2. Get that object in your script, either through d3.Json or by having it as a variable in a javascript file
3. Expand the data object, this creates some new variables used by the workerVis and is required to be rendered properly. This only needs to be called once. `expandWorkerData(dataObj);`
4. Create a worker function `var workerExample = worker()`
5. Modify any attributes (most of these require that this must be done before drawing the worker) such as `workerExample.attr("debug", true)`
6. Draw your worker vis!
```javascript
d3.select("#visElement")
    .data([dataObj])
    .call(workerExample);
```
7. To play the worker animation, simply use the following snippet:
```javascript
if (!workerExample.attr('animIsPlaying')) {
    resetData(dataObj);
    advanceDataTarget(dataObj);
    d3.select("#visElement")
        .data([dataObj])
        .call(workerExample);
}
```
We recommend placing this inside a function, passing in the worker vis and data object for easier usage. This snippet checks to see if the current vis has a playing animation and if not, resets the data to initial starting points, advances the data target (queueing the animation) and finally re-calls the function on the HTML element playing the animation.

## API

### `.attr(string)`
This function manipulates various attributes of the worker visualization. Must be called **before** the worker is drawn. Full list of modifyable attributes (default in parens):
* margin: The margin around the visualization
    * top (10)
    * right (10)
    * bottom (10)
    * left (10)
* width: The overall width of the chart (400)
* height: The overall height of the chart (400)
* animationDuration: The base length of animations, in milliseconds (1000)
* workerSize: The space between workers, should be about the size of a worker (25)
* debug: true - draw target circles, false - don't draw target circles
* animIsPlaying: true - animation is currently playing so you shouldn't call another animation cycle, false - animation is not playing, ready to play again
* easeExpo: The exponent on the easing function, changes how the worker and weights move to/from their targets

### `expandWorkerData(dataObj)`
Modifies a given data object (in the proper format described above) so that it can be drawn by the worker function. Should only be called once.

### `resetData(dataObj)`
Resets the data object so all workers and weights are at their starting locations. Should be called before `advanceDataTarget`.

### `advanceDataTarget(dataObj)`
Prepares to start the animation, advancing each worker and weight one target forward which allows them to move to the next target.
