console.log(1);
console.log(2);
console.log(3);

function worker() {
    return new Promise(function(resolve, reject) {
        let sum = 0;
        for (let i = 1; i <= 1000000000; i++) {
            sum += i;
        }
        resolve(sum);
    });
}
worker().then(result => console.log(result));

// console.log(4);
// console.log(5);
// let sum = 0;
// for (let i = 1; i <= 100000000000; i++) {
//     sum += i;
// }
// console.log(sum);

// function asyncWorker(callback) {
//     setTimeout(function() {
//         callback;
//     }, 3000);
// }

// setTimeout(sayHello, 5000);
// let intervalHandle = setInterval(sayHello, 1000);
// setTimeout(function() {
//     console.log('Stopping...');
//     clearInterval(intervalHandle);
// }, 7000);

function asyncWorker(){
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            console.log(2);
            resolve();
        }, 3000);
    });
}
async function main() {
    console.log(1);
    await asyncWorker();      // asyncWorker 함수 내에서만 가능
    console.log(3);
}

// asyncWorker()
// .then(function() {
//     console.log('Async work complet!');
//     console.log(6);
// });

// function add(a, b) {
//     return a + b;
// }
// let add = (a, b) => a + b;

// console.log(add(2, 3));

