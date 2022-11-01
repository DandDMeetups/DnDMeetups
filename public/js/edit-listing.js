//Function to edit a listing
async function editFormHandler(event) {
    event.preventDefault();

    //Get the listing id from the url
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    //Get the listing name, category, and text from the form
    const name = document.querySelector('input[name="listing-name"]').value;
    const category = document.querySelector('input[name="listing-category"]').value;
    const listing_text = document.querySelector('textarea[name="listing-text:]').value;

    //Use the update route to update the listing
    const response = await fetch(`../../controllers/api/listingRoutes.js/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            name,
            category,
            description,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    //If edit is successful, redirect to the homepage page
    if(response.ok) {
        document.location.replace('/views/homepage');
        //Otherwise, display the error
    } else {
        alert(response.statusText);
    }
    
}

document.querySelector('.edit-listing-form').addEventListener('submit', editFormHandler);