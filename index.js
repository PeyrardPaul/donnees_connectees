var express = require('express');
var app = express();

const port = process.env.PORT || 3000;  //Si sur le serveur le port existe alors ça prend le port donné, sinon ça prend 3000

app.use(express.urlencoded({ extended: true }))

app.post('/home', (req, res) => {
  const name = req.body.name
  console.log(`L'annotation saisie est ${name}`)
  res.send(`L'annotation saisie est ${name}`)
})

// app.get("/toto", function(req, res) {
//     res.send("salut toto")
// });

app.listen(port, function() {
    console.log('serveur listening on port : '+port)
});