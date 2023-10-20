document.addEventListener('DOMContentLoaded', () => {
    // disable the post button
    

    // for users who logged in
    if (document.querySelector('#form-post')) {
        
        // resize the post area
        resizeTextarea(document.querySelector('#text-post'));
        
        // continuely check if the post button needs to be disabled or enabled
        document.querySelector('#form-post').addEventListener('click', () => {
            const element = document.querySelector('#form-post');
            newPost(element);

        });
        
    }
    
    // for all comment area
    if (document.querySelector('.new-comment')) {

        document.querySelectorAll('.new-comment').forEach(div => {
                // resize comment area
                resizeTextarea(div.querySelector('.add-new-comment'));

                // disable or enable comment button based on value
                div.addEventListener('click', () => {

                    div.querySelector('.add-new-comment').onkeyup = () => {
                        if ( div.querySelector('.add-new-comment').value.trim().length > 0 ) {
                            
                            div.querySelector('.submit-comment').disabled = false;
                    
                        }else {
                            div.querySelector('.submit-comment').disabled = true;
                    
                        }
                }
            })
    
    
            // add new comment
            div.querySelector('.submit-comment').addEventListener('click', () => {

                createNewComment(div.querySelector('.add-new-comment'), div);
            })
        });
    }


   
    // change the no of views, comment and like ( love ) to 1000 => 1K, 1000000 => 1M
    changeNumber(document.getElementsByClassName('numbers'));

    // open and close the comment section as the user click the comment part of the post
    document.querySelectorAll('.comments').forEach(button => {
        button.addEventListener('click', (event) => {

            const comment = event.target;
            // get the post that the comment belongs to
            let posts = comment.closest('.posts');

            // get comments in that post and make them visible or invisible
            let divComment = posts.getElementsByClassName('post-comments')[0];
            
            if (divComment.style.display === 'none') {

                divComment.style.display = 'block';
            } else {
                divComment.style.display = 'none';
            }
            


        })
        
    })  


   

    // if user click the like exist
    if (document.querySelector('.heart')) {

        // for each like button clicked fetch the user id
        document.querySelectorAll('.heart').forEach(element => {

            element.addEventListener('click', button => {

                const like = button.target;

                // fetch the data
                // the api is implemented in the way that if they user all readly like that button return False 
                // by removing the user for the post like list and vice versa
                // it return 1. success message, 2. number of like(s) the post have and 3. boolean expression (if user likes it makes it red else white)
                const csrf_token = getCookie('csrftoken');

                fetch(`/like/${like.dataset.post_id}`, {
                    method: 'PUT',
                    headers : {
                        "X-CSRFToken": csrf_token,
                        "Content-Type": "application/json",
                    }
                })
                .then(response => {
                    if  (response.redirected) {
                        location.assign(response.url)  // or, location.replace(res.url); 

                    } else { 
                    return response.json()
                }
                })
                .then(message => {
                    
                    // error do nothing
                    if (message.error) {
                        console.log(message.error)
                        location.reload()
                    }
                    else {
                        // if the 
                        if (message.liked) {
                            like.className = "liked heart";

                        } else {
                            like.className = "not-liked heart";
                        }

                        // get the html tag where the number of like is put down.
                        const text = like.parentElement.parentElement.querySelector('.like-number');

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
function newPost(element) {
    element.querySelector('#text-post').onkeyup = () =>  { 
        if (element.querySelector('#text-post').value.trim().length > 0 ) {
            element.querySelector('#input-post').disabled = false;
        } else {
            element.querySelector('#input-post').disabled = true;
        }
    }
}

// change number 1000 => 1K, 1,5000,000 > 1.5M
function changeNumber(numbers) {
    for (let i = 0; i < numbers.length; i++) {

        const number  = parseInt(numbers[i].innerHTML);

        if (number >= 1000000 ) {
            numbers[i].innerHTML =   `${(number / 1000000).toFixed(1)}.M`
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
    button.innerHTML = 'Save';
    button.className = 'new-edit';

    const cancel = document.createElement('button');
    cancel.innerHTML = 'Cancel'
    cancel.className = 'stop-edit';

    const div = document.createElement('div');
    div.className = "edit-buttons"
    div.append(cancel);
    div.append(button);

    const textarea = document.createElement('textarea');
    textarea.innerHTML = content.replaceAll('<br>', '\n').trim();
    textarea.className = 'edit-content';
    
    // make the post content element empty
    place.innerHTML = '';
    place.appendChild(textarea);
    place.appendChild(div);
    
    textarea.focus();

    // move the cursor to the end text inside textarea
    textarea.setSelectionRange(textarea.value.length, textarea.value.length)

    // resize the height of textarea
    resizeTextarea(textarea)

    
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
                    
                    const error = getError(place, message.error)

                    // show the error to the user
                    place.insertBefore(error, place.children[1])

                    
                 // needs to done
                } else {

                    place.innerHTML = newContent.replaceAll('\n', '<br>');
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




function createNewComment(text, element) {

    const csrf_token = getCookie('csrftoken');
    // 
    fetch(`/comment/${text.dataset.post_id}`, {
        method : 'POST', 
        body : JSON.stringify({
            "comment": text.value
        }),

        headers : {
            'X-CSRFToken' : csrf_token,
            'Content-Type' : 'application/json',
        }
    })
    .then(response => response.json())
    .then(message => {
        if (message.error) {

            const error = getError(element, message.error)

            element.querySelector(".comment-textarea").insertBefore(error, element.querySelector(".comment-textarea").children[1]);
            return;
        }



        insertCommentNumber(element, message.number);


        // remove error message from comment area
        if (element.querySelector('.error')) {
            element.querySelector('.error').remove();
        }
        // create a new element for new comment
        const outerdiv = document.createElement('div');
        outerdiv.className = "post-comment";
        // insert everything to it.
        outerdiv.innerHTML = createCommentElement(message);

        const list = element.closest('.post-comments');
        
        // insert the comment at the top of the comment section
        list.insertBefore(outerdiv, list.children[2]);
        if (list.querySelector('.empty')) {
            list.querySelector('.empty').remove()
        }
        // empty the comment textarea
        text.innerHTML = '';
        text.value = '';

        const parentDiv = text.closest(".comment-textarea");
        parentDiv.querySelector(".submit-comment").disabled = true;


    })
    .catch(error => console.log(error))

}



function createCommentElement(message) {
    return `<div  class="user-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
                <i class="bi bi-person-circle"></i>
            </div>

            <div class="comment-area">
                <div class="commenter-info">
                    <a  href="/profile_page/@${message.user}" class="hyper-link-user">
                        ${message.name} 
                    </a>
                    <div class="commented-on"> ${message.time} </div>
                </div>
                <div class="comment"> ${message.comment}  </div>
            </div> `
}

function insertCommentNumber(element, number) {

    const topdiv = element.closest('.post-comments');
    
    const postInfo = topdiv.previousElementSibling;

    const commentNumber = postInfo.querySelector('.comments').querySelector(".numbers");
    commentNumber.innerHTML = number;

    changeNumber(commentNumber);
}


// resize textarea
function resizeTextarea(textarea) {

    textarea.style.height = textarea.scrollHeight + 24 + 'px';   
    textarea.oninput = () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 24 + 'px';   
    }
    
}

// return error inside <div class="error"> message</div>
function getError(element, message) {
    const error = document.createElement('div');
    error.className = "error";

    if (element.querySelector(".error")) {
        element.querySelector(".error").remove()
    }
    error.innerHTML = message;
    return error;
}