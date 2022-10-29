//Function to delete a listing
async function deleteListingFormHandler(event) {
    event.preventDefault();

    //Get the listing id from the url
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];
    //Delete the listing with an async function
    const response = await fetch(`/controllers/api/listing/${id}`, {
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

document.querySelector('.delete-listing-btn').addEventListener('click', deleteFormHandler);
