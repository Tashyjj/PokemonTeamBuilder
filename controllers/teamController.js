//Ill add the other functionality later like creating deleting editing teams
//changed to an express router approach

const express = require("express");
const router = express.Router();
const TeamsDB = require("../models/TeamsDB");

//effectiveness against types
async function getTypeEffectiveness(typeName) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
    if (!response.ok) throw new Error(`Failed to fetch type data for ${typeName}`);
    const typeData = await response.json();
    return {
        doubleDamageTo: typeData.damage_relations.double_damage_to.map(t => t.name),
    };
}

async function getPokemonDamageRelations(pokemonName) {

    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!pokemonRes.ok) throw new Error(`Failed to fetch Pokémon: ${pokemonName}`);
    
    const data = await pokemonRes.json();

    const typeNames = data.types.map(t => t.type.name);

    const typePromises = typeNames.map(getTypeEffectiveness);
    const typeRelationsArray = await Promise.all(typePromises);
    
    const allDoubleDamageTo = new Set();
    typeRelationsArray.forEach(rel => {
      rel.doubleDamageTo.forEach(t => allDoubleDamageTo.add(t));
    });

    function renameStatName(statName) {
      switch (statName) {
        case "hp": return "HP";
        case "attack": return "ATK";
        case "defense": return "DEF";
        case "special-attack": return "SP-ATK";
        case "special-defense": return "SP-DEF";
        case "speed": return "SPD";
        default: return statName;
      }
    }
    
    const stats = data.stats.map(s => ({
      name: renameStatName(s.stat.name),
      base_stat: s.base_stat
    }));
    
    return {
      name: pokemonName,
      typeNames,
      effectiveAgainst: Array.from(allDoubleDamageTo),
      stats
    };
  }
  

//specific team route
router.get("/team/:id", async (req, res) => {
    const teamId = parseInt(req.params.id);
    TeamsDB.getTeamById(teamId, async (err, team) => {
      if (err || !team) {
        console.error("Error fetching team:", err);
        return res.status(404).send("Team not found");
      }
      
      team.pokemon_list = team.pokemon_list ? team.pokemon_list.split(",") : [];
      team.types_summary = team.types_summary ? team.types_summary.split(",") : [];
      
      try {
        const pokemonDetailsPromises = team.pokemon_list.map(pokemonName => 
          getPokemonDamageRelations(pokemonName.toLowerCase())
        );
        team.pokemonDetails = await Promise.all(pokemonDetailsPromises);
      } catch (fetchErr) {
        console.error("Error fetching Pokémon details:", fetchErr);
        team.pokemonDetails = team.pokemon_list.map(name => ({
          name,
          typeNames: [],
          effectiveAgainst: [],
          stats: []
        }));
      }
      
      res.render("teamDetails", { team });
    });
  });
  

// Home Route
router.get("/", (req, res) => {
    res.render("index", { 
        title: "Pokemon Team Builder",
        message: "Welcome to the Pokemon Team Builder!",
        partials: { nav: "partials/nav" }
    });
});

// Route to show all teams
router.get("/teams", (req, res) => {
    TeamsDB.getAllTeams((err, teams) => {
        if (err) {
            console.error("Error fetching teams:", err);
            res.status(500).send("Internal Server Error");
        } else {
            // Convert stored string data back to arrays
            teams.forEach(team => {
                team.pokemon_list = team.pokemon_list ? team.pokemon_list.split(",") : [];
                team.types_summary = team.types_summary ? team.types_summary.split(",") : [];
            });

            res.render("teams", { teams });
        }
    });
});



router.get("/create", (req, res) => {
    res.render("createTeam", { validPokemonArray: req.app.locals.validPokemonArray });
});

// New team


router.post("/create", async (req, res) => {


    const validPokemonSet = req.app.locals.validPokemonSet;
    let pokemons = Array.isArray(req.body.pokemons) ? req.body.pokemons : [req.body.pokemons];

    for (const name of pokemons) {

        if (name.trim() === "") continue;

        if (!validPokemonSet.has(name.trim().toLowerCase())) {
            return res.status(400).send(`Invalid pokemon: ${name}`);
        }
    }

    try{

        const teamName = req.body.name;

        //sometimes it doesnt treat it as an array, like if theres only one pokemon
        if (!Array.isArray(pokemons)) {
            pokemons = [pokemons];
        }

        //I think the blank entries are causing issues w/ API call
        const sanitizedPokemons = pokemons.filter(p => p && p.trim() !== "").map(p => p.trim().toLowerCase());

        if (sanitizedPokemons.length === 0) {
            return res.status(400).send("Please enter at least one Pokemon");
        }

        //API call
        const pokemonTypePromises = sanitizedPokemons.map(async (pokemonName) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data for ${pokemonName}`);
            }
            const data = await response.json();
            return{
                types: data.types.map(t => t.type.name),
                base_experience: data.base_experience,
            };
            
        });

        const pokemonDataArray = await Promise.all(pokemonTypePromises);

        //this is to remove duplicates
        const typeSet = new Set();
        let totalExp = 0;
        pokemonDataArray.forEach(pokemonData => {
            pokemonData.types.forEach(t => typeSet.add(t));
            totalExp += pokemonData.base_experience;
        });
        const typesSummary = Array.from(typeSet).join(",");
        
        //fixing effectiveness
        const effectiveness = totalExp;
        
        effectiveness.toFixed(1);
        TeamsDB.insertTeam(teamName, sanitizedPokemons, typesSummary, effectiveness, (err) => {
            if (err) {
                console.error("Error inserting new team:", err);
                return res.status(500).send("Error saving team");
            }
            res.redirect("/teams");
        });
    } catch (err) {
        console.error("Error creating team:", err);
        res.status(500).send("Error creating team");
    }
});



//updating a team

router.get("/team/:id/edit", (req, res) => {
    const teamId = parseInt(req.params.id);
    TeamsDB.getTeamById(teamId, (err, team) => {
      if (err || !team) {
        console.error("Error fetching team:", err);
        return res.status(404).send("Team not found");
      }
      //making arrays again
      team.pokemon_list = team.pokemon_list ? team.pokemon_list.split(",") : [];
      team.types_summary = team.types_summary ? team.types_summary.split(",") : [];

      //funny array thats gonna hold the pokemons already in the team
      const slots = 6;
      const pokemonSlots = [];
      for (let i = 0; i < slots; i++) {
        
        pokemonSlots.push(team.pokemon_list[i] || "");

      }

      team.pokemonSlots = pokemonSlots;
      
      res.render("editTeam", { team });
    });
});
  

router.post("/team/:id/edit", async (req, res) => {
    const teamId = parseInt(req.params.id);
    let pokemons = Array.isArray(req.body.pokemons) ? req.body.pokemons : [req.body.pokemons];


    const sanitizedPokemons = pokemons.filter(p => p && p.trim() !== "").map(p => p.trim().toLowerCase());

    if (sanitizedPokemons.length === 0) {
        return res.status(400).send("Please enter at least one Pokemon");
    }

    //MOORRREEEEE FORM VALIDATION
    const validPokemonSet = req.app.locals.validPokemonSet;
    for (const name of sanitizedPokemons) {
        if (!validPokemonSet.has(name)) {
            return res.status(400).send(`Invalid Pokemon: ${name}`);
        }
    }

    //typing and effectiveness again
    try {
        const pokemonTypePromises = sanitizedPokemons.map(async (pokemonName) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data for ${pokemonName}`);
            }
        const data = await response.json();
        return{
            types: data.types.map(t => t.type.name),
            base_experience: data.base_experience,
        };
    });


        const pokemonDataArray = await Promise.all(pokemonTypePromises);
        const typeSet = new Set();
        let totalExp = 0;
        pokemonDataArray.forEach(pokemonData => {
            pokemonData.types.forEach(t => typeSet.add(t));
            totalExp += pokemonData.base_experience;
        });
        const typesSummary = Array.from(typeSet).join(",");
        const effectiveness = totalExp;
        effectiveness.toFixed(1);
        const teamName = req.body.name;

    
        TeamsDB.updateTeam(teamId, teamName, sanitizedPokemons, typesSummary, effectiveness, (err) => {
            if (err) {
                console.error("Error updating team:", err);
                return res.status(500).send("Error updating team");
            }
            res.redirect(`/team/${teamId}`);
        });

    } catch (err) {
        console.error("Error processing updated team:", err);
        res.status(500).send("Error processing updated team");
    }


});
  



//delete team

router.post("/delete/:id", (req, res) => {
    const teamId = req.params.id;
    TeamsDB.deleteTeam(teamId, (err) => {
        if (err) {
            console.error("Error deleting team:", err);
            return res.status(500).send("Error deleting team");
        }
        res.redirect("/teams");
    });
});
  
module.exports = router;