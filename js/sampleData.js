var sinData = {
        sources: [
            {
                x: 100,
                y: 15,
                w: 200,
                h: 75,
                val: "Pickup",
                id: 1,
                color: "#111",
                type: "in"
            },
            {
                x: 100,
                y: 300,
                w: 200,
                h: 75,
                val: "Dropoff",
                id: 3,
                color: "#333",
                type: "out"
            }
        ],
        workers: [
            {
                x: 50,
                baseY: 100,
                count: 1,
                color: "#F0F",
                target: -1,
                weightTarget: -1,
                weightCount: 3,
                targetCount: 2,
                targets: [0, 1, 0, 1, 0, 1],
                carryWeightRange: [15, 50]
            }
        ],
        targets: [
            {
                x: 100,
                y: 90,
                id: 1,
                note: "first circle",
                type: "in"
            },
            {
                x: 100,
                y: 300,
                id: 4,
                note: "second circle",
                type: "out"
            }
        ],
        sync: true
    };

var parData = {
    // leaving this in the JS -for now- since you can't have comments in JSON
        // the list of all sources of information (where the workers go to/from, that are drawn)
        sources: [
            {
                x: 75,
                y: 25,
                w: 100,
                h: 75,
                // the value to draw onto the source, string or number
                val: "add",
                id: 1,
                color: "#111",
                type: "in" // currently unused...
            },
            {
                x: 225,
                y: 25,
                w: 100,
                h: 75,
                val: "Multi",
                id: 2,
                color: "#111",
                type: "in"
            },
            {
                x: 75,
                y: 300,
                w: 100,
                h: 75,
                val: "Result",
                id: 3,
                color: "#333",
                type: "out"
            },
            {
                x: 225,
                y: 300,
                w: 100,
                h: 75,
                val: "Result",
                id: 3,
                color: "#333",
                type: "out"
            }
        ],
        // all the workers that move around the vis
        workers: [
            {
                x: 25,
                baseY: 125,
                // number of workers with this initial group
                count: 3,
                color: "#F0F",
                // the index of the target to move to, -1 = default pos
                target: -1,
                weightTarget: -1,
                // number of weights to pick up (requires equal amount of target loops)
                weightCount: 1,
                // how many targets are in the main loop (usually 2)
                targetCount: 2,
                // the targets that are valid for this worker (0-based, not ID based!)
                targets: [0, 2],
                // weight range from minimum to maximum. If you want all same weights set it to [x, x+1]
                // for example, [15,16]
                carryWeightRange: [15, 50]
            },
            {
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
        // invisible targets that workers move to
        targets: [
            {
                x: 75,
                y: 100,
                // this is the "target" attribute that workers point to
                id: 1,
                // the note doesn't actually "do" anything, it's there as a comment for us
                // since we can't see the target without debug on
                note: "add circle",
                type: "in"
            },
            {
                x: 225,
                y: 100,
                id: 2,
                note: "multi circle",
                type: "in"
            },
            {
                x: 75,
                y: 300,
                id: 3,
                note: "res 1 circle",
                type: "out"
            },
            {
                x: 225,
                y: 300,
                id: 4,
                note: "res 2 circle",
                type: "out"
            }
        ],
        // whether each of the columns should be animated together or separate
        // animate together works best when there are an equal number of worker groups and input/output
        // aka: parallelism examples
        sync: true
    };

var conData = {
        sources: [
            {
                x: 100,
                y: 15,
                w: 200,
                h: 75,
                val: "Pickup",
                id: 1,
                color: "#111",
                type: "in"
            },
            {
                x: 100,
                y: 300,
                w: 200,
                h: 75,
                val: "Dropoff",
                id: 3,
                color: "#333",
                type: "out"
            }
        ],
        workers: [
            {
                x: 25,
                baseY: 100,
                count: 2,
                color: "#F0F",
                target: -1,
                weightTarget: -1,
                weightCount: 1,
                targetCount: 2,
                targets: [0, 1],
                carryWeightRange: [15, 50]
            },
            {
                x: 350,
                baseY: 100,
                count: 2,
                color: "#0FF",
                target: -1,
                weightTarget: -1,
                weightCount: 1,
                targetCount: 2,
                targets: [0, 1],
                carryWeightRange: [15, 50]
            }
        ],
        targets: [
            {
                x: 100,
                y: 90,
                id: 1,
                note: "first circle",
                type: "in"
            },
            {
                x: 100,
                y: 300,
                id: 4,
                note: "second circle",
                type: "out"
            }
        ],
        sync: false
    };