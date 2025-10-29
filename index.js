function changeTitle() {
    let titleElement = document.querySelector('#title');
    titleElement.innerHTML = '와ㅏ';
}

let eventtestbutton = document.querySelector('#eventtestbutton');
eventtestbutton.addEventListener('click', ()  => {
    let titleElement = document.querySelector('#title');
    titleElement.innerHTML = '와ㅏ';
});

let addHandsomButton = document.querySelector('#addHandsomButton');
addHandsomButton.addEventListener('click',()  => {
    let ulElement = document.querySelector('ul');
    let newLi = document.createElement('li');
    newLi.innerHTML = 'sss';
    ulElement.appendChild(newLi);
});