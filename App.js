const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const { sequelize } = require('./models');
const bodyParser = require("body-parser");

const app = express();

//loading pokemon data from API
let validPokemonSet = new Set();
async function loadAllPokemonNames() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=1400";

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }


    const data = await res.json();
    data.results.forEach((p) => validPokemonSet.add(p.name));

    url = data.next;
  }
  console.log(`Loaded ${validPokemonSet.size} pokemons from PokeAPI.`);


}



app.engine('mustache', mustacheExpress(__dirname + '/views/partials'));
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: function (res, filePath) {
    if (filePath.endsWith('.woff2')) {
      res.set('Content-Type', 'font/woff2');
    }else if (filePath.endsWith('.ttf')) {
      res.set('Content-Type', 'font/ttf');
    }
  }
}));
app.use(express.urlencoded({ extended: false }));

const teamController = require('./controllers/teamController');
app.use("/", teamController);


loadAllPokemonNames()
  .then(() => {
    app.locals.validPokemonSet = (validPokemonSet); //KEEPING THIS HERE FOR SERVER
    app.locals.validPokemonArray = JSON.stringify(Array.from(validPokemonSet)); //AND THIS ONE FOR CLIENT

    console.log("Loaded all pokemon names, server starting...");

    sequelize.sync()
      .then(() => {
        console.log('Database synced');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
      })
      .catch(err => {
        console.error('Database sync failed:', err);
        process.exit(1);
      });

  })
  .catch((err) => {
    console.error("Could not load pokemon data:", err);
    process.exit(1);  
  });
