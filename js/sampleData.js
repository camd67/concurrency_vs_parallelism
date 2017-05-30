var parData = {
    // leaving this in the JS -for now- since you can't have comments in JSON
        // the list of all sources of information (where the workers go to/from, that are drawn)
        sources: [
            {
                x: 150,
                y: 50,
                w: 200,
                h: 75,
                // the value to draw onto the source, string or number
                val: "add",
                id: 1,
                color: "#111",
                type: "in" // currently unused...
            },
            {
                x: 250,
                y: 50,
                w: 200,
                h: 75,
                val: "Multi",
                id: 2,
                color: "#111",
                type: "in"
            },
            {
                x: 150,
                y: 350,
                w: 200,
                h: 75,
                val: "Result",
                id: 3,
                color: "#333",
                type: "out"
            },
            {
                x: 250,
                y: 350,
                w: 200,
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
                x: 100,
                baseY: 100,
                // number of workers with this initial group
                count: 4,
                color: "#F0F",
                // the index of the target to move to, -1 = default pos
                target: -1,
                weightTarget: -1,
                // the targets that are valid for this worker (0-based, not ID based!)
                targets: [0, 2],
                // weight range from minimum to maximum
                carryWeightRange: [15, 50]
            },
            {
                x: 300,
                baseY: 100,
                count: 2,
                color: "#0FF",
                target: -1,
                weightTarget: -1,
                targets: [1, 3],
                carryWeightRange: [20, 25]
            }
        ],
        // invisible targets that workers move to
        targets: [
            {
                x: 150,
                y: 90,
                // this is the "target" attribute that workers point to
                id: 1,
                // the note doesn't actually "do" anything, it's there as a comment for us
                // since we can't see the target without debug on
                note: "add circle",
                type: "in"
            },
            {
                x: 250,
                y: 90,
                id: 2,
                note: "multi circle",
                type: "in"
            },
            {
                x: 150,
                y: 300,
                id: 3,
                note: "res 1 circle",
                type: "out"
            },
            {
                x: 250,
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
                targets: [0, 1],
                carryWeightRange: [15, 50]
            }
        ],
        targets: [
            {
                x: 200,
                y: 90,
                id: 1,
                note: "first circle",
                type: "in"
            },
            {
                x: 200,
                y: 300,
                id: 4,
                note: "second circle",
                type: "out"
            }
        ],
        sync: false
    };