//Build funny db here later

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/teams.db');


db.serialize(() => { //figured it out
    db.run(`CREATE TABLE IF NOT EXISTS teams (id INTEGER PRIMARY KEY AUTOINCREMENT, 
        team_name TEXT, 
        pokemon_list TEXT, 
        types_summary TEXT, 
        moves_stats TEXT, 
        effectiveness REAL, 
        created_at TEXT)`);
});

//new team
exports.insertTeam = (teamName, pokemons, types, effectiveness, createdAt, callback) => {
    const pokemonList = Array.isArray(pokemons) ? pokemons.join(",") : "";
    const typesSummary = types;

    db.run(
      `INSERT INTO teams (team_name, pokemon_list, types_summary, moves_stats, effectiveness, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [teamName, pokemonList, typesSummary, null, effectiveness, createdAt],
      callback
    );
  };

//getting all teams
exports.getAllTeams = (callback) => {
    db.all('SELECT * FROM teams', callback);
};

//getting a specific team
exports.getTeamById = (id, callback) => {
    db.get("SELECT * FROM teams WHERE id = ?", [id], callback);
};

//gonna add the other fucntionality here too later

//deleting teams
exports.deleteTeam = (id, callback) => {
    db.run("DELETE FROM teams WHERE id = ?", [id], callback);
};
  

exports.db = db;