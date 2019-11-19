
console.log('Server-side code running');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path') 

const app = express();


// serve files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/clicks', { useNewUrlParser: true, useUnifiedTopology: true })
var db=mongoose.connection; 

app.listen(8080, () => console.log(`app running at http://127.0.0.1:8080`))

// Routes
app.get('/',function(req,res){ 
  return res.redirect('./index.html'); 
});

app.get('/signup',function(req,res){ 
  const click = {clickTime: new Date()};
  console.log('signup @' + click.clickTime);

  return res.redirect('./sign_up.html'); 
});

app.get('/signin',function(req,res){ 
  const click = {clickTime: new Date()};
  console.log('signin @' + click.clickTime);

  return res.redirect('./sign_in.html'); 
});

app.get('/track',function(req,res){ 
  const click = {clickTime: new Date()};
  console.log('track @' + click.clickTime);

  return res.redirect('./track_package.html'); 
});

// add a document to the DB collection recording the click event


// // get the click data from the database
// app.get('/clicks', (req, res) => {
//   db.collection('clicks').find().toArray((err, result) => {
//     if (err) return console.log(err);
//     res.send(result);
//   });
// });
