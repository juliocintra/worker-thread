const fb = require('fibonacci');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const runFibonacci = workerData => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

if (!isMainThread) {
    const result = fb.iterate(workerData.iterations); s
    parentPort.postMessage(result);
}

module.exports = runFibonacci;