// =============
// Requirements
// =============
var mongoose = require('mongoose');

// ===============
// Book Schema
// ===============
var bookSchema = mongoose.Schema({
	isbn: String,
	views: { type: Number, default: 1 }
});

bookSchema.methods.inc = function() {	
	// console.log(typeof this);
	// console.log("updated")
	Book.update(this, {$inc: {views: 1}}, function(){
		// console.log('this updated')
	});
};


var Book = mongoose.model('Book', bookSchema);

module.exports = Book;