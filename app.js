const app = require('express')();
const fb = require('fibonacci');
const runFibonacci = require('./src/workers/fibonacciWorker');
const runFibonacciPool = require('./src/workers/fibonacciWorkerPool');
const runFibonacciShared = require('./src/workers/fibonacciWorkerShared');
const log = require('./src/log');

app.get('/ping', async (req, res) => {
    return res.json({ message: 'Working', date: new Date() })
})

app.get('/fibonacci', async (req, res) => {
    const number = fb.iterate(10000);
    res.send(number);
});

app.get('/fibonacci-threaded', async (req, res) => {
    try {
        runFibonacci({ iterations: 10000 }).then(result => log.info(result));
        res.send('processing');
    } catch (error) {
        console.log(error);
        res.send('processing');
    }
});

app.get('/fibonacci-threaded-pool', async (req, res) => {
    try {
        runFibonacciPool({ iterations: 10000 }).then(result => log.info(result));
        res.send('processing');
    } catch (error) {
        console.log(error);
        res.send('processing');
    }
});

app.get('/fibonacci-threaded-shared', async (req, res) => {
    const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
    for (let i = 0; i < 4; i++) {
        runFibonacciShared({ iterations: 10000, position: i, arr: sharedUint8Array }).then(result => console.log(result));
    }

    res.send('processing');
});

app.listen(3000, () => {
    console.log(`Server listen on port 3000`)
});