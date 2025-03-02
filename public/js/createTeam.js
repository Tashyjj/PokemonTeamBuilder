const validPokemon = new Set([
    "Bulbasaur", "Ivysaur", "Venusaur",
    "Charmander", "Charmeleon", "Charizard",
    "Squirtle", "Wartortle", "Blastoise",
    "Caterpie", "Metapod", "Butterfree",
    "Weedle", "Kakuna", "Beedrill",
    "Pidgey", "Pidgeotto", "Pidgeot",
    "Rattata", "Raticate", "Spearow",
    "Fearow", "Ekans", "Arbok",
    "Pikachu", "Raichu", "Sandshrew",
    "Sandslash", "Nidoran♀", "Nidorina",
    "Nidoqueen", "Nidoran♂", "Nidorino",
    "Nidoking", "Clefairy", "Clefable",
    "Vulpix", "Ninetales", "Jigglypuff",
    "Wigglytuff", "Zubat", "Golbat",
    "Oddish", "Gloom", "Vileplume",
    "Paras", "Parasect", "Venonat",
    "Venomoth", "Diglett", "Dugtrio",
    "Meowth", "Persian", "Psyduck",
    "Golduck", "Mankey", "Primeape",
    "Growlithe", "Arcanine", "Poliwag",
    "Poliwhirl", "Poliwrath", "Abra",
    "Kadabra", "Alakazam", "Machop",
    "Machoke", "Machamp", "Bellsprout",
    "Weepinbell", "Victreebel", "Tentacool",
    "Tentacruel", "Geodude", "Graveler",
    "Golem", "Ponyta", "Rapidash",
    "Slowpoke", "Slowbro", "Magnemite",
    "Magneton", "Farfetch'd", "Doduo",
    "Dodrio", "Seel", "Dewgong",
    "Grimer", "Muk", "Shellder",
    "Cloyster", "Gastly", "Haunter",
    "Gengar", "Onix", "Drowzee",
    "Hypno", "Krabby", "Kingler",
    "Voltorb", "Electrode", "Exeggcute",
    "Exeggutor", "Cubone", "Marowak",
    "Hitmonlee", "Hitmonchan", "Lickitung",
    "Koffing", "Weezing", "Rhyhorn",
    "Rhydon", "Chansey", "Tangela",
    "Kangaskhan", "Horsea", "Seadra",
    "Goldeen", "Seaking", "Staryu",
    "Starmie", "Mr. Mime", "Scyther",
    "Jynx", "Electabuzz", "Magmar",
    "Pinsir", "Tauros", "Magikarp",
    "Gyarados", "Lapras", "Ditto",
    "Eevee", "Vaporeon", "Jolteon",
    "Flareon", "Porygon", "Omanyte",
    "Omastar", "Kabuto", "Kabutops",
    "Aerodactyl", "Snorlax", "Articuno",
    "Zapdos", "Moltres", "Dratini",
    "Dragonair", "Dragonite", "Mewtwo",
    "Mew"
]);


document.querySelectorAll('input[name="pokemons"]').forEach(input => {


    //blur bcuz I want it to happen right after I click off the box
    input.addEventListener('blur', () => {

        const val = input.value.trim();
        //fields can be empty now, but at least one should be filled but ill check that on submission
        if (val === "") {
            input.setCustomValidity("");
            return;
        }

        
        if (!validPokemon.has(val)) {

        input.setCustomValidity(`"${val}" is not a valid Pokemon name.`);
        input.reportValidity();
        } else {
            input.setCustomValidity("");
        }
        
    });
});

//checking that at least one pokemon is filled
document.querySelector('form').addEventListener('submit', (e) => {

    const pokemonInputs = document.querySelectorAll('input[name="pokemons"]');
    let oneField = false;
    
    pokemonInputs.forEach(input => {
    if (input.value.trim() !== "") {
        oneField = true;
    }
    });
    
    if (!oneField) {
    //jsut gonna flag the first input
    if (pokemonInputs.length > 0) {
        pokemonInputs[0].setCustomValidity("Please enter at least one Pokemon.");
        pokemonInputs[0].reportValidity();
    }
    e.preventDefault();
    } else {
    pokemonInputs.forEach(input => input.setCustomValidity(""));
    }

    
});
  