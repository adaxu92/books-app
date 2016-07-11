//==============
// Requirements
//==============
var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var Book = require('../models/books.js');
var id = require('mongodb').ObjectID;



// ===========================
// GET Request to landing page 
// ===========================
router.get('/', function(req, res){
	var x = "https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=" + (process.env.BOOKS_KEY);
	var response;
	request(x, function(err, response, body){
		if (!err && response.statusCode == 200){
			response = JSON.parse(body)
			// console.log(response.results.lists);
			res.render('index.ejs', {response})
			// res.send(body);
		};
	});
});

// ===========================
// GET Request to Search page 
// ===========================
router.get('/search', function(req, res){
	res.render('new.ejs')
});

// ===========================
// Creating a view count
// ===========================
function addViews(viewsData, callback){
	Book.create(viewsData, function(err, book){
		console.log('viewed');
		callback(book);
	});
};

// ===========================
// Post Request to view results 
// ===========================
router.post('/search/view-results', function(req, res){
	console.log(req.body.selectpicker);
	var list = req.body.selectpicker;
	var x = "https://api.nytimes.com/svc/books/v3/lists.json?api-key=" + (process.env.BOOKS_KEY) +"&list=" + list;
	var response;
	request(x, function(err, response, body){
		if(!err && response.statusCode == 200){
			response = JSON.parse(body)
			console.log(response);
			res.render('create.ejs', {response})
		};
	});
});
// ===========================
// GET Request to show page 
// ===========================
router.get('/views/:primary_isbn13', function(req, res) {
	// var paramsID = req.params.id;
	// var resContainer = res;
	// console.log(req.params);
	var isbn = req.params.primary_isbn13;
	var apiUrl = "https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=" + (process.env.BOOKS_KEY) + "&isbn=" + isbn;
	var parsedData;
	request(apiUrl, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			var data = JSON.parse(body);
			parsedData = data;

			Book.findOne({isbn: isbn}, function(err, found){
				if(found !== null) {
					console.log("it is found bitch.")
					Book.findOne({isbn: isbn}, function(err, book){
						book.inc();
						console.log(book);
						console.log(book.views);
						res.render('show.ejs', {book: book, parsedData: parsedData});
					});
				} else {
					Book.create({isbn: isbn}, function(err, isbn){
						console.log('Book is created!')
					});
					res.redirect('/provisions/views/' + isbn);
				}
			});
		};
	}); //End of api call
});


// router.get('/test/:id', function(req, res){
// 	Book.findById(req.params.id, function(err, book){
// 		console.log('Before');
// 		console.log(book);
// 		book.inc();
// 	});
// });
// ===========================
// UPDATE views on show page 
// ===========================
// router.put('/views/:primary_isbn13', function(req, res){
// 	Book.findOneAndUpdate({"views": req.params.views}, {$inc: {next:1}}, function(err, views){
// 		res.end();
// 	});
// });
// router.post('/search', function(req, res){
// 	var query = req.body;
// 	var x = "https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=" + (process.env.BOOKS_KEY) + "&list-name=" +query;
// 	var response;
// 	request(x, function(err, response, body){
// 		if(!err && response.statusCode == 200){
// 			response = JSON.parse(body)
// 			console.log(response);
// 			res.render('create.ejs', {response})
// 		};
// 	});
// });

// router.


	// 	if (!error && req.headers.authorization != 'Bearer ZDU3YWExYTItNzhmNS00MTJmLWI5MGUtN2UxMDI1OGExY2E0');
	// 	response_data = body;
	// 	console.log("response_data below;");
	// 	console.log(response_data);
	// 		res.render('index.ejs', {response})
	// 	};
	// });
// 	var url = "https://api.nytimes.com/svc/books/v3/lists/names.json";
// 	url += '?' + $.param({ 'api-key': (process.env.BOOKS_KEY)
// });
// 	$.ajax({
// 		url: url,
// 		method: 'GET',
// 	}).done(function(result) {
// 		console.log(result);
// 		res.render('index.ejs', results);
// 	}).fail(function(err) {
// 		throw err;
// 	});
	
// });

// router.post('/api', function(req, res){
// 	// var x = 'https://ws.homeaway.com/oauth/authorize?client_id=' + (process.env.HOME_ID);
// 	// var response_data;
// 	// request(x, function(error, response, body){
// 	// 	if(!error && response.statusCode == 200);{
// 	// 		response_data = body;
// 	// 		console.log(response_data);
// 	// 	res.render('show.ejs', {response_data})
// 		};
// 	})
// });
		// if (!error && req.headers.authorization != 'Bearer ZDU3YWExYTItNzhmNS00MTJmLWI5MGUtN2UxMDI1OGExY2E0');
		// response_data = body;
		// console.log("response_data below;");
		// console.log(response_data);

//housing options to be added into user's array
// router.put('/housings', function(req, res){
// 	User.findById(req.user._id).then(function(user){
// 		var housing = new Housing(req.body);
// 		user.housing_options.push(housing);
// 		user.save(function(err){
// 			if(err){
// 				console.log(err);
// 				res.send(false);
// 			}
// 			else{
// 				res.send(user);
// 			}
// 		});
// 	});
// });

module.exports = router;