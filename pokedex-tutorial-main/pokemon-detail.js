let currentPokemonId = null;

// Wait until the entire page is loaded before executing the code
document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMONS = 151; // Maximum number of Pokémon to handle
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10); // Get the Pokémon ID from the URL

  // If the ID is invalid (out of range), redirect to the homepage
  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }

  currentPokemonId = id; // Store the current Pokémon ID
  loadPokemon(id); // Load data for the Pokémon with the provided ID
});

async function loadPokemon(id) {
  try {
    // Making asynchronous requests to fetch Pokémon data and species info in parallel
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);

    const abilitiesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail.move"
    );
    abilitiesWrapper.innerHTML = ""; // Clear previous abilities

    // Only proceed if the current Pokémon ID matches the ID from the URL
    if (currentPokemonId === id) {
      displayPokemonDetails(pokemon); // Display the detailed information for the Pokémon
      const flavorText = getEnglishFlavorText(pokemonSpecies); // Get the English description of the Pokémon
      document.querySelector(".body3-fonts.pokemon-description").textContent =
        flavorText;

      // Handling navigation to next/previous Pokémon
      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
        document.querySelector(sel)
      );
      leftArrow.removeEventListener("click", navigatePokemon); // Remove previous event listeners
      rightArrow.removeEventListener("click", navigatePokemon);

      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          navigatePokemon(id - 1); // Navigate to previous Pokémon
        });
      }
      if (id !== 151) {
        rightArrow.addEventListener("click", () => {
          navigatePokemon(id + 1); // Navigate to next Pokémon
        });
      }

      window.history.pushState({}, "", `./detail.html?id=${id}`); // Update the browser's URL with the Pokémon ID
    }

    return true;
  } catch (error) {
    // Handling errors if something goes wrong during the fetch
    console.error("An error occurred while fetching Pokemon data:", error);
    return false;
  }
}

async function navigatePokemon(id) {
  currentPokemonId = id; // Update the current Pokémon ID
  await loadPokemon(id); // Load the new Pokémon data
}

// Pokémon type colors for styling
const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  dark: "#EE99AC",
};

// Helper function to apply a CSS property to multiple elements
function setElementStyles(elements, cssProperty, value) {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
}

// Convert hex color to rgba format (for transparency effects)
function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
}

// Set the background color of Pokémon details based on its type
function setTypeBackgroundColor(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType]; // Get the color corresponding to the Pokémon's type

  if (!color) {
    console.warn(`Color not defined for type: ${mainType}`); // Warning if the color is not defined
    return;
  }

  const detailMainElement = document.querySelector(".detail-main");
  setElementStyles([detailMainElement], "backgroundColor", color);
  setElementStyles([detailMainElement], "borderColor", color);

  setElementStyles(
    document.querySelectorAll(".power-wrapper > p"),
    "backgroundColor",
    color
  );

  setElementStyles(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    color
  );

  setElementStyles(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    color
  );

  const rgbaColor = rgbaFromHex(color);
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `  /* Dynamically changing the progress bar colors based on Pokémon's type */  
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }
  `;
  document.head.appendChild(styleTag);
}

// Capitalize the first letter of a string (used for formatting names)
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Helper function to create and append a new element to a parent
function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}

// Display Pokémon details such as name, type, stats, and abilities
function displayPokemonDetails(pokemon) {
  const { name, id, types, weight, height, abilities, stats } = pokemon;
  const capitalizePokemonName = capitalizeFirstLetter(name);

  document.querySelector("title").textContent = capitalizePokemonName;

  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase()); // Add class for styling

  document.querySelector(".name-wrap .name").textContent =
    capitalizePokemonName;

  document.querySelector(
    ".pokemon-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  imageElement.alt = name;

  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = "";
  types.forEach(({ type }) => {
    createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${type.name}`,
      textContent: type.name,
    });
  });

  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  ).textContent = `${weight / 10}kg`;
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
  ).textContent = `${height / 10}m`;

  const abilitiesWrapper = document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail.move"
  );
  abilities.forEach(({ ability }) => {
    createAndAppendElement(abilitiesWrapper, "p", {
      className: "body3-fonts",
      textContent: ability.name,
    });
  });

  const statsWrapper = document.querySelector(".stats-wrapper");
  statsWrapper.innerHTML = "";

  // Mapping stats to human-readable labels
  const statNameMapping = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  };

  stats.forEach(({ stat, base_stat }) => {
    const statDiv = document.createElement("div");
    statDiv.className = "stats-wrap";
    statsWrapper.appendChild(statDiv);

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts stats",
      textContent: statNameMapping[stat.name],
    });

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts",
      textContent: String(base_stat).padStart(3, "0"),
    });

    createAndAppendElement(statDiv, "progress", {
      className: "progress-bar",
      value: base_stat,
      max: 100,
    });
  });

  setTypeBackgroundColor(pokemon);
}

function getEnglishFlavorText(pokemonSpecies) {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}
