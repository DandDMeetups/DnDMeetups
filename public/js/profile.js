const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector("#listing-name").value.trim();
  const category = document.querySelector("#listing-category").value.trim();
  const description = document.querySelector("#listing-desc").value.trim();

  if (name && category && description) {
    const response = await fetch(`/api/listings`, {
      method: "POST",
      body: JSON.stringify({
        name,
        category,
        description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.replace("/profile");
    } else {
      alert("Failed to create listing");
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute("data-id")) {
    const id = event.target.getAttribute("data-id");

    const response = await fetch(`/api/listings/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      document.location.replace("/profile");
    } else {
      alert("Failed to delete listing");
    }
  }
};

document
  .querySelector(".new-listing-form")
  .addEventListener("submit", newFormHandler);

document
  .querySelector(".listing-list")
  .addEventListener("click", delButtonHandler);
