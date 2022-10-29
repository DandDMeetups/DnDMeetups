async function listingFormHandler(event) {
    event.preventDefault();

    const listing_text = document.querySelector('textarea[name="listing-body"]').value.trim();

    const listing_id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    if(listing_text) {
        const response = await fetch ('/controllers/api/listingRoutes.js', {
            method: 'POST',
            body: JSON.stringify({
                listing_id,
                listing_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.listing-form').addEventListener('submit', listingFormHandler);
