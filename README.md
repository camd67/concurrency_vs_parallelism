# Concurrency vs Parallelism

## Data Object
In order to properly use workerVis.js you need a properly structured data object. This is an annotated example of the data object:
```json
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

## Example usage
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