//Build funny db here later

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/teams.db');

//does the setup work? we will see
db.serialize(() => { //couldnt get this thing to stay in the quotes multiple lines
    db.run('CREATE TABLE IF NOT EXISTS teams (id INTEGER PRIMARY KEY AUTOINCREMENT, team_name TEXT, pokemon_list TEXT, types_summary TEXT, moves_stats TEXT, effectiveness REAL, created_at TEXT)');
});

//getting all teams
exports.getAllTeams = (callback) => {
    db.all('SELECT * FROM teams', callback);
};

//getting a specific team
exports.getTeamById = (id, callback) => {
    db.get("SELECT * FROM teams WHERE id = ?", [id], callback);
};

//gonna add the other fucntionality here too later