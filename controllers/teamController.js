//Ill add the other functionality later like creating deleting editing teams
//changed to an express router approach

const express = require("express");
const router = express.Router();
const TeamsDB = require("../models/TeamsDB");

// Route to get details of a specific team
router.get("/team/:id", (req, res) => {
    const teamId = parseInt(req.params.id);
    TeamsDB.getTeamById(teamId, (err, team) => {
        if (err || !team) {
            console.error("Error fetching team:", err);
            res.status(404).send("Team not found");
        } else {
            // Convert stored string data back to arrays
            team.pokemon_list = team.pokemon_list ? team.pokemon_list.split(",") : [];
            team.types_summary = team.types_summary ? team.types_summary.split(",") : [];

            res.render("teamDetails", { team });
        }
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

// New team

router.get("/create", (req, res) => {
    res.render("createTeam"); // Renders the new page
});

router.post("/create", (req, res) => {
    const { name, pokemons, types } = req.body;

    // Ill have to fix this effectuiveness later, generating random effectiveness for now
    const effectiveness = Math.random() * 100;
    const createdAt = new Date().toISOString();

    // Database instertion
    const pokemonList = pokemons ? pokemons.split(",").map(p => p.trim()).join(",") : "";
    const typesSummary = types ? types.split(",").map(t => t.trim()).join(",") : "";
    const db = require("../models/TeamsDB").db;
    db.run(
        "INSERT INTO teams (team_name, pokemon_list, types_summary, effectiveness, created_at) VALUES (?, ?, ?, ?, ?)",
        [name, pokemonList, typesSummary, effectiveness, createdAt],
        function (err) {
            if (err) {
                console.error("Error inserting new team:", err);
                res.status(500).send("Error saving team");
            } else {
                res.redirect("/teams");
            }
        }
    );
});
  

module.exports = router;