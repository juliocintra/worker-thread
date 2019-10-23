const app = require('express')();
const fb = require('fibonacci');
const runFibonacci = require('./src/workers/fibonacciWorker');
const log = require('./src/log');

app.get('/fibonacci', async (req, res) => {
    const number = fb.iterate(10000);
    res.send(number);
});

app.get('/ping', async (req, res) => {
    return res.json({ message: 'Working', date: new Date() })
})

app.get('/fibonacci-threaded', async (req, res) => {
    try {
        runFibonacci({ iterations: 10000 }).then(result => log.info(result));
        res.send('processing');
    } catch (error) {
        console.log(error);
        res.send('processing');
    }
});

app.listen(3000, () => {
    console.log(`Server listen on port 3000`)
});