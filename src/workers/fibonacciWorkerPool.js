const fb = require('fibonacci');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const Pool = require('worker-threads-pool');
const CPUs = require('os').cpus().length;
const pool = new Pool({ max: CPUs });

/**
 * Não está sendo usado o `new Worker()`, mas sim o pool.acquire
 * Ele inicia o worker internamente (fica em volta do worker)
 * o callback que é passado, possui um parametro worker (que será o worker que foi iniciado)
 */
const runFibonacci = workerData => {
    return new Promise((resolve, reject) => {
        pool.acquire(__filename, { workerData }, (err, worker) => {
            if (err) reject(err);

            console.log(`started worker ${worker} (pool size: ${pool.size})`);
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', code => {
                if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    });
};

if (!isMainThread) {
    const result = fb.iterate(workerData.iterations);
    parentPort.postMessage(result);
}

module.exports = runFibonacci;