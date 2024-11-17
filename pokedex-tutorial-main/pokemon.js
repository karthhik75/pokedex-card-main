// Defining a constant for the maximum number of Pokémon to fetch (first 151 Pokémon)
const MAX_POKEMON = 151;
// Selecting the DOM elements for the Pokémon list wrapper, search input, number filter, name filter, and not found message
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

// Creating an array to hold all the Pokémon data fetched from the API
let allPokemons = [];

// Fetching Pokémon data from the PokeAPI, limiting it to the first 151 Pokémon
// This was a critical challenge, trying to deal with asynchronous data fetching and managing the state
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json()) // Converting the response to JSON format
  .then((data) => {
    // Storing the fetched Pokémon data
    allPokemons = data.results;
    // Displaying the fetched Pokémon data on the page
    displayPokemons(allPokemons);
  })
  .catch((error) => {
    // Handling any errors that might occur during the fetching process (like network errors or API issues)
    console.error("Failed to fetch Pokémon data", error);
  });

// Function to fetch detailed Pokémon data and species data before redirecting to the detail page
async function fetchPokemonDataBeforeRedirect(id) {
  try {
    // Using Promise.all to fetch Pokémon and species data concurrently to optimize performance
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true; // Returning true on successful data fetch
  } catch (error) {
    // Catching any errors that might occur during the fetch process and logging them
    console.error("Failed to fetch Pokemon data before redirect", error);
    return false;
  }
}

// Function to display Pokémon data in the list on the main page
function displayPokemons(pokemon) {
  listWrapper.innerHTML = ""; // Clearing the previous Pokémon list before adding new ones

  // Looping through each Pokémon to create a list item for it
  pokemon.forEach((pokemon) => {
    // Extracting the Pokémon's ID from the URL provided by the API
    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "list-item"; // Assigning a class to the list item for styling
    listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">#${pokemon.name}</p>
        </div>
    `;

    // Adding an event listener to each Pokémon item so that when it's clicked, it redirects to the detail page
    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID); // Fetching data before redirect
      if (success) {
        window.location.href = `./detail.html?id=${pokemonID}`; // Redirecting to the detail page
      }
    });

    // Appending the created list item to the list wrapper in the HTML
    listWrapper.appendChild(listItem);
  });
}

// Adding an event listener to the search input for real-time filtering of the Pokémon list
searchInput.addEventListener("keyup", handleSearch);

// Function to handle search functionality, filtering Pokémon based on number or name
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase(); // Converting the search term to lowercase to handle case-insensitive search
  let filteredPokemons;

  // If the number filter is selected, filter the Pokémon based on their ID (number)
  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm); // Filtering by Pokémon ID
    });
  } else if (nameFilter.checked) {
    // If the name filter is selected, filter the Pokémon based on their name
    filteredPokemons = allPokemons.filter(
      (pokemon) => pokemon.name.toLowerCase().startsWith(searchTerm) // Filtering by Pokémon name
    );
  } else {
    filteredPokemons = allPokemons; // If no filter is selected, show all Pokémon
  }

  // Display the filtered Pokémon list
  displayPokemons(filteredPokemons);

  // If no Pokémon are found based on the search term, display a "not found" message
  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block"; // Showing the "not found" message
  } else {
    notFoundMessage.style.display = "none"; // Hiding the "not found" message if results are found
  }
}

// Selecting the close button for the search input to clear the search
const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch); // Adding an event listener to clear the search on click

// Function to clear the search input and reset the Pokémon list to show all Pokémon
function clearSearch() {
  searchInput.value = ""; // Clearing the search input field
  displayPokemons(allPokemons); // Displaying all Pokémon again
  notFoundMessage.style.display = "none"; // Hiding the "not found" message when search is cleared
}
