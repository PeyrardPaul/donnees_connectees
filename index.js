var express = require('express');
var app = express();
var notes = [];
var Id = 0;

const port = process.env.PORT || 3000;  //Si sur le serveur le port existe alors ça prend le port donné, sinon ça prend 3000

app.use(express.urlencoded({ extended: true }))


// route pour afficher le formulaire
// app.get('/formulaire', (req, res) => {
//   res.send(`
//     <form action="/result" method="post">
//         <label for="note">Annotation:</label>
//         <input type="number" id="note" name="note">

//         <label for="com">Commentaire:</label>
//         <input type="text" id="com" name="com">

//         <button type="submit">Envoyer</button>
//     </form>
//     `)
// })

// route pour traiter les données du formulaire
app.get("/formulaire", function(req, res) {
    res.sendfile("index.html");
})


app.post('/annotation', (req, res) => {
    const note = req.body.note
    const commentaire = req.body.com
    // res.send(`
    //     Si vous voulez voir toutes les annotations: <form action="/resultall" method="get"><button type="submit">Cliquez-ici</button></form>
    //     <br><br>
    //     <form action="/formulaire" method="get">
    //         <button type="submit">Cliquez-ici
    //         </button>
    //     </form>
    //     `)
    res.redirect("/annotation");
    notes.push({"Id": Id, "Annotation": `${note}`, "Commentaire":`${commentaire}`});
    Id += 1;
    console.log(notes[Id]["Annotation"],"ddd",notes["Annotation"],"ettt",notes[0]["Annotation"])
  })

  app.get('/annotation', (req, res) => {
    res.send(`Votre annotation a été sauvegardé ! <br>
        Si vous voulez voir toutes les annotations: 
        <form action="/resultall" method="get">
            <button type="submit">Cliquez-ici</button>
        </form>
        <br><br>
        <form action="/formulaire" method="get">
            <button type="submit">Accueil</button>
        </form>`)
  })

app.get('/resultall', (req, res) => {
    let html = '<ul>';

    for (let i = 0; i < notes.length; i++) {
      html += '<li>Note=' + notes[Id]["Annotation"] + '    et commentaire=' + notes[Id]["Commentaire"] +'</li>';
    }
  
    html += '</ul>';
    res.send(html);
})



app.listen(port, function() {
    console.log('serveur listening on port : '+port)
});