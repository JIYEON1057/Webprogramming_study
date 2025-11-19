function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(getRandomInt(45));
    }
    return Array.from(numbers);
}
const lottoNumbers = generateLottoNumbers();
console.log("생성된 로또 번호:", lottoNumbers);