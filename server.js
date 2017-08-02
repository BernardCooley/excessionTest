var express = require('express');
var app = express();
var mongojs = require('mongojs');
var nodemailer = require("nodemailer");
var db = mongojs('cooleyMusic', ['mailing_list']);
var db2 = mongojs('cooleyMusic', ['messages']);
var db3 = mongojs('cooleyMusic', ['bookings']);
var bodyParser = require('body-parser');
var smtpTransport = nodemailer.createTransport("SMTP",{
	service: "Gmail",
	auth: {
		user: "bernardcooley@gmail.com",
		pass: "yeloocc1"
	}
});

app.use(express.static(__dirname = '\public'));
app.use(bodyParser.json());

app.post('/mailing_list', function(req, res) {
	console.log("Request body: " + req.body);
	db.mailing_list.insert(req.body, function(err, doc) {
		res.json(doc);
	});
});

app.get('/mailing_list', function (req, res) {
	console.log("I recieved a get request");
	db.mailing_list.find(function (err, docs) {
		console.log(docs);
		res.json(docs);
	});
});

app.get('/mailing_list/:email', function(req, res) {
	var email = req.params.email;
	console.log("Existing email validation: " + email);
	db.mailing_list.findOne({email: email}, function(err, doc) {
		res.json(doc);
	});
});

app.get('/messages', function (req, res) {
	console.log("I recieved a get request");
	db2.messages.find(function (err, docs) {
		console.log(docs);
		res.json(docs);
	});
});

app.get('/bookings', function (req, res) {
	console.log("I recieved a get request");
	db3.bookings.find(function (err, docs) {
		console.log(docs);
		res.json(docs);
	});
});

app.post('/send', function(req, res) {
	var mailOptions = {to : req.body.email, text : req.body.message + "**************Testing"};
	console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
			console.log(error);
			res.end("error");
		}else{
			console.log("Message sent: " + response.message);
			res.end("sent");
		}
	});
});

app.post('/storeMessage', function(req, res) {
	var date = new Date();
	var dateString = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
	var insertJson = {name: req.body.name, email: req.body.email, message:req.body.message, date: dateString};
	console.log(insertJson);
	db2.messages.insert(insertJson, function(err, doc) {
		res.json(doc);
	});
});



// app.get('/tracks', function (req, res) {
// 	console.log("I recieved a get request");
// 	db.tracks.find(function (err, docs) {
// 		console.log(docs);
// 		res.json(docs);
// 	});
// });

// app.get('/setlist', function (req, res) {
// 	console.log("I recieved a get request");
// 	db.setlist.find(function (err, docs) {
// 		console.log(docs);
// 		res.json(docs);
// 	});
// });

// app.post('/tracks', function(req, res) {
// 	console.log(req.body);
// 	db.tracks.insert(req.body, function(err, doc) {
// 		res.json(doc);
// 	});
// });

// app.post('/users', function(req, res) {
// 	console.log(req.body);
// 	db.users.insert(req.body, function(err, doc) {
// 		res.json(doc);
// 	});
// });

// app.post('/setlist', function(req, res) {
// 	console.log(req.body);
// 	db.setlist.insert(req.body, function(err, doc) {
// 		res.json(doc);
// 	});
// });

// app.delete('/tracks/:id', function (req, res) {
// 	var id = req.params.id;
// 	console.log(id);
// 	db.tracks.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
// 		res.json(doc);
// 	});
// });

// app.delete('/setlist/:id', function (req, res, err) {
// 	var id = req.params.id;
// 	console.log(id);
// 	db.setlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
// 		res.json(doc);
// 	});
// });

// app.get('/tracks/:id', function(req, res) {
// 	var id = req.params.id;
// 	console.log(id);
// 	db.tracks.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
// 		res.json(doc);
// 	});
// });

// app.get('/users/email/:email', function(req, res) {
// 	var email = req.params.email;
// 	console.log("Existing email validation: " + email);
// 	db.users.findOne({email: email}, function(err, doc) {
// 		res.json(doc);
// 	});
// });

// app.get('/users/email/:email', function(req, res) {
// 	var email = req.params.email;
// 	console.log("Existing email validation: " + email);
// 	db.users.findOne({email: email}, function(err, doc) {
// 		res.json(doc);
// 	});
// });

// app.get('/users/fname/:fname', function(req, res) {
// 	var fname = req.params.fname;
// 	console.log("Existing fname validation: " + fname);
// 	db.users.findOne({fname: fname}, function(err, doc) {
// 		res.json(doc);
// 	});
// });

// app.get('/users/username/:username', function(req, res) {
// 	var username = req.params.username;
// 	console.log("User: " + username);
// 	db.users.findOne({username: username}, function(err, doc) {
// 		res.json(doc);
// 	});
// });

// app.post('/newCollection', function(req, res) {
// 	console.log("New collection body " + req);
// 	db.createCollection("Cooley", function(err, collection){
// 	   if (err) throw err;
// 	   	console.log("Cooley" + " created");
// 	 	console.log(collection);
// 	});
// });

// app.put('/tracks/:id', function(req, res) {
// 	var id = req.params.id;
// 	var update = {Artist: req.body.Artist, Title: req.body.Title, Key: req.body.Key};
// 	console.log(req.body);
// 	db.tracks.findAndModify({query: {_id: mongojs.ObjectId(id)},
// 		update: {$set: update},
// 		new: true}, function(err, doc) {
// 			res.json(doc);
// 	});
// });

app.listen(3000);
console.log("Server running on port 3000");