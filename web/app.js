var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});

var handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


/* set up sql connection */
var mysql = require("mysql");
var connection = mysql.createConnection({
    host            : process.env.DATABASE_HOST,
    port            : process.env.MYSQL_PORT,
    user            : process.env.MYSQL_USER,
    password        : process.env.MYSQL_PASSWORD,
    database        : process.env.MYSQL_DATABASE
});

/* throw an error if sql connect fails. it should fail a couple times in docker 
 before successfully connecting. the container takes longer to boot up, essentially.
 */
connection.connect(function(err){
	if(err){
		console.error("error connecting: " + err.stack);
		return process.exit(22); //consistently exit so the Docker container will restart until it connects to the sql db
	}
	console.log("connected as id " + connection.threadId);
});


/* -------------------------------------- */
/* Get routes below */

app.get('/', function(req, res){
	
	var q = 'SELECT * from characters';
	var allegiance = 'select id, name from allegiance';
	var ability = 'select id, type from ability';
	var character = 'select id, first_name from characters';

	/* query for characters, abilities, and allegiances then
	pass the results into the page so the drop downs can be populated */
	connection.query(allegiance, function(error, results, fields){
		if(error) throw error;
		allegiance = results;
		//console.log(allegiance);
		return;
	});

	connection.query(ability, function(error, results, fields){
		if(error) throw error;
		ability = results;
		//console.log(ability);
		return;
	});

	connection.query(character, function(error, results, fields){
		if(error) throw error;
		character = results;
		//console.log(character);
		return;
	});


	connection.query(q, function(error, results, fields){
		if(error) throw error;
		console.log("rendering home page . . .");
		res.render('home', {
			title: "Stormlight Archive DB",
			results: results,
			allegiance: allegiance,
			ability: ability,
			character: character
		});
	});
});

app.get('/characterAbility', function(req, res){
	var charQuery = 'select characters.first_name, ability.type from characters inner join char_abilities on char_abilities.char_id = characters.id inner join ability on char_abilities.ability_id = ability.id';
	var abilityQuery = 'select id, type from ability';
	var characterQuery = 'select id, first_name, last_name, nickname, race, homeland from characters';

	//store sql results of characters
	connection.query(characterQuery, function(error, results, fields){
		if(error) throw error;

		characterQuery = results;
		return;
	});

	//store sql results of abilities
	connection.query(abilityQuery, function(error, results, fields){
		if (error) throw error;

		//console.log(results);
		abilityQuery = results;
		return;
	});

	connection.query(charQuery, function(error, results, fields){
		if(error) throw error;
		//console.log(results);

		res.render('characterAbility', {
			results: results,
			title: "Character Ability",
			ability: abilityQuery,
			character: characterQuery
		});
	});
});

app.get('/updateAbility', function(req, res){
	console.log("character id to update: " + req.query.characterID);
	console.log("allegiance id to update: " + req.query.abilityID);

	var queryUpdate = 'insert into char_abilities (char_id, ability_id) VALUES (?, ?)';
	var inserts = [req.query.characterID, req.query.abilityID];

	connection.query(queryUpdate, inserts, function(error, results, fields){
		if (error) throw error;
		console.log("query results below:");
		console.log(results);

		res.redirect('/characterAbility');
	});
});

app.get('/deleteCharacterAbility', function(req, res){
	console.log("character id to update: " + req.query.characterID);
	console.log("allegiance id to update: " + req.query.abilityID);

	var queryDelete = 'delete from char_abilities where char_id = ? and ability_id = ?';
	var inserts = [req.query.characterID, req.query.abilityID];

	connection.query(queryDelete, inserts, function(error, results, fields){
		if (error) throw error;
		console.log("query results below:");
		console.log(results);

		res.redirect('/characterAbility');
	});
});


app.get('/characterAllegiance', function(req, res){
	//poor naming structure here. last min addition.
	var charQuery = "select characters.first_name, allegiance.name, characters.id as charID, allegiance.id as allegID from characters inner join char_allegiances on char_allegiances.char_id = characters.id inner join allegiance on char_allegiances.allegiance_id = allegiance.id";
	var allegianceQuery = 'select id, name from allegiance';
	var characterQuery = 'select id, first_name, last_name, nickname, race, homeland from characters';

	//save character results 
	connection.query(characterQuery, function(error, results, fields){
		if(error) throw error;

		//console.log(results);
		characterQuery = results;
		return;
	});

	//save allegiance results
	connection.query(allegianceQuery, function(error, results, fields){
		if (error) throw error;

		//console.log(results);
		allegianceQuery = results;
		return;
	});


	connection.query(charQuery, function(error, results, fields){
		if(error) throw error;
		//console.log(results);

		res.render('characterAllegiance', {
			results: results,
			title: "Character Allegiance",
			allegiance: allegianceQuery,
			character: characterQuery
		});
	});
});

app.get('/updateAllegiance', function(req, res){
	console.log("character id to update: " + req.query.characterID);
	console.log("allegiance id to update: " + req.query.allegianceID);

	var queryUpdate = 'insert into char_allegiances (char_id, allegiance_id) VALUES (?, ?)';
	var inserts = [req.query.characterID, req.query.allegianceID];

	connection.query(queryUpdate, inserts, function(error, results, fields){
		if (error) throw error;
		console.log("query results below:");
		console.log(results);

		res.redirect('/characterAllegiance');
	});
});

app.get('/deleteCharacterAllegiance', function(req, res){
	console.log("character id to update: " + req.query.characterID);
	console.log("allegiance id to update: " + req.query.allegianceID);

	var queryDelete = 'delete from char_allegiances where char_id = ? and allegiance_id = ?';
	var inserts = [req.query.characterID, req.query.allegianceID];

	connection.query(queryDelete, inserts, function(error, results, fields){
		if (error) throw error;

		console.log("query results below:");
		console.log(results);

		res.redirect('/characterAllegiance');
	});
});

app.get('/byAbility', function(req, res){
	var query = "select characters.first_name, ability.type from characters inner join char_abilities on char_abilities.char_id = characters.id inner join ability on char_abilities.ability_id = ability.id where ability.id = ?";
	var id = req.query.id;

	console.log("ability id being used: " + id);

	connection.query(query, [id], function(error, results, fields){
		if(error) throw error;
		console.log("query results: ");
		console.log(results);

		res.render("byAbility", {
			results: results,
			title: "Search by ability"
		});
	});	
});

app.get('/byAllegiance', function(req, res){
	var query = 'select characters.first_name, allegiance.name from characters inner join char_allegiances on char_allegiances.char_id = characters.id inner join allegiance on char_allegiances.allegiance_id = allegiance.id where allegiance.id = ?';
	var id = req.query.id;

	console.log('ability id being used: ' + id);

	connection.query(query, [id], function(error, results, fields){
		if (error) throw error;
		console.log("query results: ");
		console.log(results);

		res.render("byAllegiance", {
			results: results,
			title: "Search by allegiance"
		});
	});
});


app.get('/characters', function(req, res){
	var characterQuery = 'select id, first_name, last_name, nickname, race, homeland from characters';
	// var context = {};
	connection.query(characterQuery, function(error, results, fields){
		if(error) throw error;
		console.log("rendering characters page . . .");

		res.render('characters', {
			title: "Stormlight Archive Characters Page",
			results: results
		});
	});
});


app.get('/characters/:id', function(req, res){
	var characterID = req.params.id;
	var characterQuery = 'select id, first_name, last_name, nickname, race, homeland from characters where id = ?';

	console.log('inside characters/id');

	connection.query(characterQuery, [characterID], function(error, results, fields){
		if(error) throw error;

		console.log("rendering update-character page for " + results[0].first_name);

		res.render('update-character', {
			title: "Stormlight Archive Characters Page",
			results: results,
			firstName: results[0].first_name,
			lastName: results[0].last_name,
			nickname: results[0].nickname,
			charRace: results[0].race,
			homeland: results[0].homeland,
			id: results[0].id
			//only 1 result populates here, so index[0] always gives the correct result
		});
	});
});

app.get('/knightsradiant', function(req, res){
	var knightsRadiantquery = 'select characters.first_name, spren.name, spren.type from characters inner join knight_radiant on knight_radiant.char_id = characters.id inner join spren on knight_radiant.spren_id = spren.id';
	var charQuery = 'select id, first_name, last_name, nickname, race, homeland from characters';
	var sprenQuery = 'select id, type, name from spren';

	//get all characters
	connection.query(charQuery, function(error, results, fields){
		if (error) throw error;
		charQuery = results;
		return;
	});

	//get all spren
	connection.query(sprenQuery, function(error, results, fields){
		if (error) throw error;
		sprenQuery = results;
		return;
	});

	connection.query(knightsRadiantquery, function(error, results, fields){
		if(error) throw error;
		console.log("rendering knights radiant page");
		console.log(results);

		res.render('knightsradiant', {
			results: results,
			title: "Knights Radiant",
			character: charQuery,
			spren: sprenQuery
		});
	});
});

app.get('/addKnightRadiant', function(req, res){

	var krQuery = 'insert into knight_radiant (kr_order, spren_id, char_id) values ("", ?, ?)';
	var inserts = [req.query.sprenID, req.query.characterID];

	connection.query(krQuery, inserts, function(error, results, fields){
		if (error) throw error;

		res.redirect('/knightsradiant/');
	});

});


app.get('/spren', function(req, res){
	var sprenQuery = 'select id, type, name from spren';

	connection.query(sprenQuery, function(error, results, fields){
		if(error) throw error;
		console.log("rendering spren page . . .");
		//console.log(results);

		res.render('spren', {
			title: "Stormlight Archive Spren Page",
			results: results
		});
	});
});


app.get('/spren/:id', function(req, res){
	var sprenID = req.params.id;
	var sprenQuery = 'select id, type, name from spren where id = ?';

	connection.query(sprenQuery, [sprenID], function(error, results, fields){
		if(error) throw error;
		console.log("rendering update-spren page for " + results[0].name);

		res.render('update-spren', {
			title: "Stormlight Archive Spren Page",
			results: results,
			sprenName: results[0].name,
			type: results[0].type,
			id: results[0].id
		});
	});
});


app.get('/ability', function(req, res){
	var abilityQuery = 'select id, type from ability';

	connection.query(abilityQuery, function(error, results, fields){
		if(error) throw error;
		console.log("rendering ability page. . .");

		res.render('ability',{
			title: "Stormlight Archive Ability Page",
			results: results
		});
	});
});


app.get('/ability/:id', function(req, res){
	var abilityID = req.params.id;
	var abilityQuery = 'select id, type from ability where id = ?';

	connection.query(abilityQuery, [abilityID], function(error, results, fields){
		if (error) throw error;
		console.log("rendering update-ability page for " + results[0].type);

		res.render('update-ability', {
			title: "Stormlight Archive Ability Page",
			results: results,
			abilityName: results[0].type,
			type: results[0].type
		});
	});
});


app.get('/allegiance', function(req, res){
	var abilityQuery = 'select id, name from allegiance';

	connection.query(abilityQuery, function(error, results, fields){
		if(error) throw error;

		console.log("rendering allegiance page. . .");

		res.render('allegiance',{
			title: "Stormlight Archive Allegiance Page",
			results: results
		});
	});
});


/* -------------------------------------- */
/* Post routes below */

app.post('/updateCharacter', urlencodedParser, function(req, res){
	console.log("inside updateCharacter post function");
	console.log(req.body);

	var updateCharacter = 'update characters set first_name = ?, last_name = ?, nickname = ?, race = ?, homeland = ? where id = ?';
	var inserts = [req.body.first_name, req.body.last_name, req.body.nickname, req.body.race, req.body.homeland, req.body.id];

	connection.query(updateCharacter, inserts, function(error, results, fields){
		if(error) throw error;

		res.redirect('characters');
	});
});

app.post('/updateSpren', urlencodedParser, function(req, res){
	console.log('inside updateSpren post function');
	console.log(req.body);

	var updateSpren = 'update spren set type = ?, name = ? where id = ?';
	var inserts = [req.body.type, req.body.name, req.body.id];

	connection.query(updateSpren, inserts, function(error, results, fields){
		if (error) throw error;

		res.redirect('spren');
	});
});

app.post('/characters', urlencodedParser,function(req, res){
	console.log("adding a character with the following details below: ");
	console.log(req.body);		//midware urlencodedParser is doing this

	var addCharacter = 'insert into characters (first_name, last_name, nickname, race, homeland) VALUES (?, ?, ?, ?, ?)';
	var inserts = [req.body.first_name, req.body.last_name, req.body.nickname, req.body.race, req.body.homeland];

	connection.query(addCharacter, inserts, function(error, results, fields){
		if (error) throw error;

		res.redirect('characters');
	});
});


app.post('/spren', urlencodedParser, function(req, res){
	console.log("adding a spren with the following details below: ");
	console.log(req.body);

	var addSpren = 'INSERT INTO spren (type, name) VALUES (?, ?)';
	var inserts = [req.body.type, req.body.name];

	connection.query(addSpren, inserts, function(error, results, fields){
		if (error) throw error;

		res.redirect('spren');
	});
});

app.post('/allegiance', urlencodedParser, function(req, res){
	console.log("adding an allegiance with the following details below:");
	console.log(req.body);

	var addAllegiance = 'INSERT INTO allegiance (name) VALUES (?)';
	var inserts = [req.body.name];

	connection.query(addAllegiance, inserts, function(error, results, fields){
		if (error) throw error;

		res.redirect('allegiance');
	});
});


app.post('/ability', urlencodedParser, function(req, res){
	console.log("adding an ability with the following details below");
	console.log(req.body);

	var addAbility = 'INSERT INTO ability (type) VALUES (?)';
	var inserts = [req.body.name];

	connection.query(addAbility, inserts, function(error, results, fields){
		if (error) throw error;

		res.redirect('ability');
	});
});

/* -------------------------------------- */
/* Used Get routes for deleting. Bad practice. Short on time. */
/* req.params used in the html to get the proper info */

app.get('/deleteCharacter/:id', function(req, res){
	var characterID = req.params.id;
	var deleteCharacter = 'delete from characters where id = ?';

	console.log("id for character being deleted" + characterID);

	connection.query(deleteCharacter, characterID, function(error, results, fields){
		if(error) throw error;

		res.redirect('/characters');
	});
});


app.get('/deleteSpren/:id', function(req, res){
	var sprenID = req.params.id;
	var sprenQuery = 'delete from spren where id = ?';

	console.log("id for spren being deleted" + sprenID);

	connection.query(sprenQuery, [sprenID], function(error, results, fields){
		if(error) throw error;

		res.redirect('/spren');
	});
});


app.get('/deleteAbility/:id', function(req, res){
	var abilityID = req.params.id;
	var abilityQuery = 'delete from ability where id = ?';

	console.log("id for ability being deleted: " + abilityID);

	connection.query(abilityQuery, abilityID, function(error, results, fields){
		if(error) throw error;

		res.redirect('/ability');
	});
});


app.get('/deleteAllegiance/:id', function(req, res){
	var allegianceID = req.params.id;
	var allegianceQuery = 'delete from allegiance where id = ?';

	console.log('id for allegiance being deleted:' + allegianceID);

	connection.query(allegianceQuery, allegianceID, function(error, results, fields){
		if(error) throw error;

		res.redirect('/allegiance');
	});
});


/* Port and listening info below */
/* might want to set up argv for easily changing the port */
var port = 3257;

app.listen(port, function(){
	console.log("app listening on port: " + port);
});
