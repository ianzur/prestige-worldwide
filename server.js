
console.log('Server-side code running');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path') 
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

// serve files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
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

app.post('/addUser', function(req,res){ 
  console.log('POST new user to database')
  // var fname = req.body.fname;
  // var lname = req.body.lname; 
  // var email =req.body.email; 
  // var pass = req.body.password; 
  // // var phone =req.body.phone; 

  console.log(req.body)


  // var data = { 
  //     "name": name, 
  //     "email":email, 
  //     "password":pass, 
  //     "phone":phone 
  // } 
  // db.collection('details').insertOne(data,function(err, collection){ 
  //     if (err) throw err; 
  //     console.log("Record inserted Successfully"); 
            
  // }); 
        
  // return res.redirect('signup_success.html'); 
}) 