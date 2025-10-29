let handsompeople = ['승철', '정한', '지수', '준휘'];
console.log(handsompeople[0]);
console.log(handsompeople[1]);

for (let i = 0; i < handsompeople.length; i++) {
    console.log(handsompeople[i]);
}

handsompeople.push('sss');
console.log(handsompeople[handsompeople.length - 1]);
handsompeople.pop();
console.log(handsompeople[handsompeople.length - 1]);

// let length = handsompeople.length;
// for (let i = 0; i < length; i++) {
//     handsompeople.pop();
// }
// console.log(handsompeople);

handsompeople.sort();
console.log(handsompeople);

let numbers = [1, 5, 2, 4, 3, 10, 101, 20, 22];
function compare(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}
numbers.sort(compare);
console.log(numbers);
