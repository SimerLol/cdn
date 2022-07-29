// STOP RIGHT THERE CRIMINAL SCUM! YOU HAVE VIOLATED THE LAW! 
const keep_alive = require('./server.js')

//-----------------------------------------------Subpath Test-------------------------------------------------------//
// app.post('/', checkAuthenticated, (req, res) => {
//   if (req.files) {
//     console.log(req.files)

//     // Store content and content name in variables
//     var file = req.files.file
//     var contentname = file.name

//     // Store useranema and subpath in variables
//     let username = req.body.username
//     let subpath = req.body.subpath

//     // Make user directory
//     const dir = __dirname + `/public/users/${username}${subpath}/${contentname}`;
//     console.log(dir)
//     file.mv(`${dir}`, function(err) {
//       if (err) {
//         res.send(err)
//       }
//       else {
//         console.log("Done!");
//         res.sendFile(__dirname + '/public/index.html')
//       }
//     })
//   }
// });