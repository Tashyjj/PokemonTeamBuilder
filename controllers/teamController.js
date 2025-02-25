const teamModel = require('../models/TeamsDB');

//Main Page in my application
exports.home = (req, res) => {
    res.render('index', { title: 'Pokemon Team Builder!' });
};

//Listing all temas
exports.listTeams = (req, res) => {
    teamModel.getAllTeams((err, teams) => {
        if (err) {
            return res.status(500).send("There has been a error finding all the teams, please try again.");
        }
        res.render('teams', { teams });
    });
};

//To view a specific team
exports.viewTeam = (req, res) => {
    const teamID = req.params.id;
    teamModel.getTeamById(teamID, (err, team) => {
        if (err) {
            return res.status(500).send("There has been a error finding that specific team, please try again.");
        }
        res.render('teamDetails', { team });
    });
};

//Ill add the other functionality later like creating deleting editing teams