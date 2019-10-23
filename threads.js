const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

/**
 * WORKER THREADS PARA CPU (Calculos matemáticos, parsing);
 * 
 * o `WorkerThread` veio para funções que são síncronas mas que possam ser rodadas em paralelo 
 * para não estar bloqueando a aplicação.
 * 
 * o `jest` (test runners) por exemplo faz isso. Roda testes em paralelo usando threads, carregando os arquivos de teste isolados
 * 
 * DIFERENÇA ENTRE CLUSTER(processo) E THREAD
 * O processo irá iniciar ua nova aplicação, vai possuir o próprio event-loop, task, stack. Gastando muito mais memória e CPU
 * 
 */

if (isMainThread) {
    // Se for a thread principal ele inicia um nover Worker
    const worker = new Worker(__filename, { workerData: 1 });
    worker.on('message', message => console.log(message));
} else {
    // Caso caia aqui ele executa esse código e devolve para a thread principal
    const someMath = workerData + 2;
    parentPort.postMessage(someMath);
}