document.addEventListener('DOMContentLoaded', () => {
    // disable the post button
    loadFirstPage();

    // continuely check if the post button needs to be disabled or enabled
    if (document.querySelector('#form-post')) {
        document.querySelector('#form-post').addEventListener('click', () => newPost());
    }

    // change the no of views, comment and like (love ) to 1000 => 1K, 1000000 => 1M
    changeNumber(document.getElementsByClassName('numbers'));

    // line of code is not important or need a imporvement if needs to be fetch the user
    if ( document.querySelector(".follow-button")) {

        document.querySelector(".follow-button").addEventListener('click', event => {
            event.preventDefault()
            const element = event.target;
            console.log(element.dataset.user_id);
            console.log(element);
            
            setTimeout(console.log(element.dataset.user_id), 10000)
           
            
        })  

    }

    // if user click the like exist
    if (document.querySelector('.like')) {
        // for each like button clicked fetch the user id
        document.querySelectorAll('.like').forEach(element => {

            element.addEventListener('click', button => {

                const like = button.target;

                // fetch the data
                // the api is implemented in the way that if they user all readly like that button return False 
                // by removing the user for the post like list and vice versa
                // it return 1. success message, 2. number of like(s) the post have and 3. boolean expression (if user likes it makes it red else white)
                fetch(`/like/${like.dataset.post_id}`, {
                    method: 'PUT'
                })
                .then(respone => respone.json())
                .then(message => {

                    // error do nothing
                    if (message.error) {
                        console.log(error)
                    }
                    else {
                        if (message.liked) {
                            like.className = "liked like";

                        } else {
                            like.className = "not-liked like";
                        }
                        console.log(like);
                        // get the html tag where the number of like is put down.
                        const text = like.parentElement.querySelector('.like-number');

                        // then insert the number inside that
                        // converting is neccessary
                        text.innerHTML = message.like;

                        // Change the number
                        changeNumber(text);
                    }
                })
                .catch(error => console.log(error))
                 
            });
        });
    }



    if (document.querySelector('.edit')) {

        // listen to click for edit button
        document.querySelectorAll('.edit').forEach(button => {
            
            button.addEventListener('click', event => {
                // prevent redirecting because the edit button is below an anchor tage
                event.preventDefault()

                button.style.display = 'none';
 
                const element = event.target;
                // get the content of that post
                const content = get_content(element);

                // edit the page fetch the data to the database 
                editPage(element, content);
              
             

            })
        })
    }
});
// Things need to be done when page first load
function loadFirstPage() {
    if (document.querySelector('#input-post')) {
        document.querySelector('#input-post').disabled = true;
    }
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
        //
        const number  = parseInt(numbers[i].innerHTML);
        if (number >= 1000000 ) {
            numbers[i].innerHTML =   `${number / 1000000}M`
        } else if (  number >= 1000 ) {
            numbers[i].innerHTML =   `${(number / 1000).toFixed(1)}K`
        }
    }
}


function get_content(element) {
    
    // get the closest post
    const post = element.closest('.posts');

    // get the post content innerHTML
    const content = post.getElementsByClassName('post-content')[0].innerHTML;
 
    return content;

}

function editPage(element, content) {
    const post = element.closest('.posts');

    // get the content of that element
    const place = post.getElementsByClassName('post-content')[0];

    // Create elements
    const button = document.createElement('button');
    button.innerHTML = 'Edit';
    button.className = 'new-edit';

    const cancel = document.createElement('button');
    cancel.innerHTML = 'Cancel'
    cancel.className = 'stop-edit';

    const textarea = document.createElement('textarea');
    textarea.innerHTML = content.trim();
    textarea.className = 'edit-content';

    // make the post content element empty
    place.innerHTML = '';
    place.appendChild(textarea);
    place.appendChild(cancel);
    place.appendChild(button);

    // resize the height of textarea
    place.querySelectorAll('.edit-content').forEach(textarea => {

        textarea.style.height = textarea.scrollHeight + 24 + 'px';   
          
        textarea.onkeyup = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 24 + 'px';   

            }
    })
    // listen for click [Cancel and Edit]
    place.addEventListener('click', (event) => {
        const edit = event.target;

        // return to previous if the user cancel editing
        if (edit.className === "stop-edit") {
            place.innerHTML =  content;
            element.style.display = 'block';
            element.disabled = false;

        } else if (edit.className === 'new-edit') {
            // get the content of the edited post
            const newContent =  place.querySelector('.edit-content').value;  
            // get the csrf_token         
            const csrf_token = getCookie('csrftoken');

            // fetch the data
            fetch(`/editpost/${element.dataset.post_id}`, {
                method: "PUT", 
                body: JSON.stringify({
                    "post": newContent,
                }),
                headers: {
                    "X-CSRFToken": csrf_token, 
                    "Content-Type": "application/json",
                }
            })

            .then(response => response.json())
            .then(message => {  
                if (message.error) {
                    //show the error to the user
                    console.log(message.error);
                    
                    // needs to done
                } else {
                    console.log(message)
                    place.innerHTML = newContent;
                    element.style.display = 'block';
                }

            })
            .catch(error => console.log(error))
        }


    });
}



function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
