const fb = require('fibonacci');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

/**
 * `Atomics` Controla o acesso as SharedArrays, pois como são arrays compartilhados em threads,
 * poderia acontecer de sobrescrever ou deletar valores;
 * 
 * Como é compartilhado em memoria entre as threads, não corre o risco de sobrescrever
 */
const runFibonacci = workerData => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
};

if (!isMainThread) {
    const sharedArray = workerData.arr;
    const result = fb.iterate(workerData.iterations);

    Atomics.add(sharedArray, workerData.position, result.ms);
    parentPort.postMessage(sharedArray);
}

module.exports = runFibonacci;