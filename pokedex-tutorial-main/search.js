// Selecting necessary DOM elements for the search input, search close icon, and the sort wrapper
// These are critical elements for the user experience and interaction, so proper handling was essential
const inputElement = document.querySelector("#search-input");
const search_icon = document.querySelector("#search-close-icon");
const sort_wrapper = document.querySelector(".sort-wrapper");

// Event listener for the input field to detect changes and call the handleInputChange function when the user types
// This was a challenging part, ensuring that the close icon appears only when there's input in the search field
inputElement.addEventListener("input", () => {
  handleInputChange(inputElement);
});

// Adding a click event listener to the close icon to clear the search input when clicked
// A lot of testing was done here to make sure the icon appears and functions properly
search_icon.addEventListener("click", handleSearchCloseOnClick);

// Event listener for the sort icon to toggle the filter menu visibility
// Trying to create a smooth UI experience was a bit tricky with the transition effects
sort_wrapper.addEventListener("click", handleSortIconOnClick);

// Function to handle changes in the search input value
// It checks if the input field has any value and shows or hides the close icon accordingly
// I spent a lot of time fine-tuning this logic to ensure smooth behavior during typing
function handleInputChange(inputElement) {
  const inputValue = inputElement.value;

  // If the input field has any text, show the close icon
  if (inputValue !== "") {
    document
      .querySelector("#search-close-icon")
      .classList.add("search-close-icon-visible");
  } else {
    // If the input is empty, hide the close icon
    document
      .querySelector("#search-close-icon")
      .classList.remove("search-close-icon-visible");
  }
}

// Function to clear the search input when the close icon is clicked
// This was implemented to reset the search field and hide the close icon cleanly
function handleSearchCloseOnClick() {
  document.querySelector("#search-input").value = ""; // Clear the search input
  document
    .querySelector("#search-close-icon")
    .classList.remove("search-close-icon-visible"); // Hide the close icon
}

// Function to handle toggling the filter menu visibility when the sort icon is clicked
// This was added to improve user interaction and make the filter section easy to toggle
// The addition of the overlay effect was a design choice after testing several UI ideas
function handleSortIconOnClick() {
  document
    .querySelector(".filter-wrapper")
    .classList.toggle("filter-wrapper-open"); // Toggle the filter wrapper visibility
  document.querySelector("body").classList.toggle("filter-wrapper-overlay"); // Add overlay effect to body
}
