
document.addEventListener('DOMContentLoaded', () => {
    // loadFirstPage();


    document.querySelector('#form-post').addEventListener('click', () => newPost());
    // Check this line of code it is not working
    const numbers = document.querySelector('.numbers').innerHTML;
    changeNumber(numbers);
    // confirm.log("hi");
    // console.log(document.querySelectorAll('.numbers'));
    // console.log("hi");  

    
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
    for (let x = 0; x < numbers.length; x++) {
        const element = numbers[x];
        console.log(element);
        
    }
}