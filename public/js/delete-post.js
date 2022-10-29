//Function to delete a post
async function deleteFormHandler(event) {
    event.preventDefault();

    //Get the post id from the url
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];
    //Delete the post with an async function
    const response = await fetch(`/controllers/api/post/${id}`, {
        method: 'DELETE'
    });
    //If the delete action is successful, redirect to the dashboard page
    if(response.ok) {
        document.location.replace('/dashboard');
        //Otherwise, display the error
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);
