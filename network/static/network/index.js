
document.addEventListener('DOMContentLoaded', () => {
    loadFirstPage();


    document.querySelector('#form-post').addEventListener('click', () => newPost());
    const myNodelist = document.querySelectorAll('.numbers');
    console.log(myNodelist);
    // Check this line of code it is not working
    changeNumber(document.getElementsByClassName('numbers'));
 
    console.log("querySelectorAll",document.querySelectorAll('.number'));
});
// Things need to be done when page first load
function loadFirstPage() {
    document.querySelector('#input-post').disabled = true;
}


function newPost() {

    document.querySelector('#text-post').onkeyup = () =>  { 
        if (document.querySelector('#text-post').value.trim().length > 0 ) {

            document.querySelector('#input-post').disabled = false;
        } else {
            document.querySelector('#input-post').disabled = true;
        }
    }
}


function changeNumber(numbers) {
    for (let i = 0; i < numbers.length; i++) {
        
        const element = numbers[i];
        const number  = parseInt(element.innerHTML);
        if (number >= 1000000 ) {
            element.innerHTML =   `${number / 1000000}M`
        } else if (  number >= 1000 ) {
            element.innerHTML =   `${(number / 1000).toFixed(1)}K`
        } else if (number === 0 ) {
            element.innerHTML = "";
        }
        
    }
}
