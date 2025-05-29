const { Team } = require('./index');

// Create new team
exports.insertTeam = async (teamName, pokemons, types, effectiveness, callback) => {
  try {
    const pokemonList = Array.isArray(pokemons) ? pokemons.join(',') : '';
    const team = await Team.create({
      team_name: teamName,
      pokemon_list: pokemonList,
      types_summary: types,
      moves_stats: null,
      effectiveness

    });
    callback(null, team);
  } catch (err) {
    callback(err);
  }
};

// Get all teams
exports.getAllTeams = async (callback) => {
  try {
    const teams = await Team.findAll();
    callback(null, teams);
  } catch (err) {
    callback(err);
  }
};

// Get team by ID
exports.getTeamById = async (id, callback) => {
  try {
    const team = await Team.findByPk(id);
    callback(null, team);
  } catch (err) {
    callback(err);
  }
};

// Delete team
exports.deleteTeam = async (id, callback) => {
  try {
    await Team.destroy({ where: { id } });
    callback(null);
  } catch (err) {
    callback(err);
  }
};

// Update team
exports.updateTeam = async (teamId, teamName, pokemons, typesSummary, effectiveness, callback) => {
  try {
    const pokemonList = Array.isArray(pokemons) ? pokemons.join(',') : '';
    await Team.update(
      {
        team_name: teamName,
        pokemon_list: pokemonList,
        types_summary: typesSummary,
        effectiveness
      },
      { where: { id: teamId } }
    );
    callback(null);
  } catch (err) {
    callback(err);
  }
};
