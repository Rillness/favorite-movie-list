var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var colors = require('colors');
var request = require('request');

mongoose.connect('mongodb://localhost/SavedMovies');

var MovieSchema = new mongoose.Schema({
    title : String,
    image : String
});

var Movie = mongoose.model('Movies', MovieSchema);

app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.redirect('/movies');
});

app.get('/movies', function(req,res){
    Movie.find({}, function(err,body){
        if(err){
            console.log(err);
        }else{
            res.render('index', {movies : body});
        }
    });   
}); 

app.get('/searched', function(req,res){

    var title = req.query.searched
    
request('http://www.omdbapi.com/?s=' + title, function (error, response, body) { 
      
  if (!error && response.statusCode == 200) {
    var parse = JSON.parse(body);
    res.render('show', {
                    movies : parse,
                    title : title
            });     
        }
    });   
});

 
app.post('/movies/:id', function(req,res){
    var newMovie = new Movie({
       title : req.params.id
    }).save(function(err){
        if(err){
            console.log(err); 
        }else{
          res.redirect('/');    
        }
    });
});

app.get('/delete', function(req,res){
    Movie.remove({}, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
});

app.get('/deleteid/:id', function(req,res){
    Movie.findByIdAndRemove( req.params.id , function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
});



// Notice. //
// > Show page, still has image tag in form. 
//




app.listen('3000', function(){
    console.log('======================='.blue);
    console.log('Listening on PORT 3000'.blue);
    console.log('======================='.blue);
});