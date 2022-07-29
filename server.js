// Import
const fs = require("fs")
const path = require('path');
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const upload = require('express-fileupload')
const methodOverride = require('method-override')

// Passport Initialize
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => users.users.find(user => user.username === username),
  id => users.users.find(user => user.id === id)
)

let filename = []

// Database Configurations
const users = require(__dirname + '/db.json')
userspath = __dirname + '/db.json'

// Express Configurations
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(express.static('./views'));
app.use(session({ secret: "water", resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(upload());

//--------------------------------------GETS--------------------------------------//
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.username })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.get('/confirm', checkAuthenticated, (req, res) => {
  // find array based on username
  let username = req.user.username
  let upload = filename.find(user => user.username === username)
  if (!upload) {
    res.redirect("/")
  }
  else {
    filenow = upload.file // points at the filename
    res.render('confirm.ejs', { filename: filenow })
    filename.length = 0 // clears the array
  }
})

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/views/style.css')
});

app.get('/*', checkAuthenticated, (req, res) => {
  console.log(req.query)
  res.send(`<?xml version='1.0' encoding='UTF-8'?><Error><Code>404</Code><Message>Not Found</Message><Details>The requested asset was not found inside the ${req.user.username} Cloud Storage bucket.</Details></Error>`)
});
//--------------------------------------POST--------------------------------------//
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    // Make an object to push the user information
    register = {
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword
    }
    // Push the registration info to db
    users.users.push(register)
    // Add indentations to make the db readable
    fs.writeFileSync(userspath, JSON.stringify(users, null, 4));
    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.redirect('/register')
  }
})

app.post('/', checkAuthenticated, (req, res) => {
  if (req.files) {
    console.log(req.files)

    // Store content and content name in variables
    var file = req.files.file
    var contentname = file.name
    let folder = req.user.username

    // Make a User Folder
    fs.mkdir(path.join(__dirname, `./views/content/${folder}`),
      { recursive: true }, (err) => {
        if (err) { return console.error(err); }
        console.log(`Directory created for ${folder}`);
      });

    // Move the file into the folder
    file.mv(`./views/content/${folder}/` + contentname, function(err) {
      if (err) { res.send(err) }
      else {
        // push username and filename to the filename list
        filename.push({
          username: req.user.username,
          file: contentname
        })
        console.log(`Done uploading ${contentname} in Content/${folder}!`);
        res.redirect('/confirm')
      }
    })
  }
});
//-----------------------------DELETE Route for Logout----------------------------//
app.delete('/logout', (req, res, next) => {
  req.logOut(function(err) { return next(err); })
  res.redirect('/login')
})
//--------------------------------User Not Signed In------------------------------//
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/login')
}
//---------------------------------User IS Signed In------------------------------//
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return res.redirect('/') }
  next()
}
//-------------------------------Server Startup Config----------------------------//
var server = app.listen(8080, function() {
  var port = server.address().port
  var family = server.address().family
  var address = server.address().address
  if (address == "::") { address = "this ratio mf" }
  console.log("Server running on Port:", port, "| Family:", family, "| Address", address)
});