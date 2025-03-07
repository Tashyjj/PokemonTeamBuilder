document.querySelectorAll('input[name="pokemons"]').forEach(input => {


    //blur bcuz I want it to happen right after I click off the box
    input.addEventListener('blur', () => {

        const val = input.value.trim().toLowerCase();
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
  