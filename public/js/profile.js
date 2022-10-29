const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#listing-name').value.trim();
  const needed_funding = document.querySelector('#listing-title').value.trim();
  const description = document.querySelector('#listing-desc').value.trim();

  if (name && needed_funding && description) {
    const response = await fetch(`/controllers/api/listingRoutes.js`, {
      method: 'POST',
      body: JSON.stringify({ name, title, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to listing');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/controllers/api/listingRoutes.js/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete listing');
    }
  }
};

document
  .querySelector('.new-listing-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.listing-list')
  .addEventListener('click', delButtonHandler);
