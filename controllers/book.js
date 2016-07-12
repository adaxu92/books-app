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
	}); 
});

module.exports = router;