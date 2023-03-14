var express = require('express');
var app = express();
var data = {};
var id = 0;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const port = process.env.PORT || 3000;  //Si sur le serveur le port existe alors ça prend le port donné, sinon ça prend 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.static('html'));


// route pour traiter les données du formulaire
app.get("/formulaire", function(req, res) {
    res.sendfile("index.html");
});

app.post("/formulaire", function(req, res){
	var body = req.body;
	data[id] = body					
	res.send("votre annotation a été sauvegardé à l'identifiant "+id+" !");
    id++;
    console.log(data)
});


//Reçoit le formulaire et redirige vers une page  avec comme route l'identifiant
app.get("/annotation", function(req, res){
    const id = req.query.IdAnnot
    res.redirect(`/annotation/${id}`)
});

//lance la page de l'annotation correspondante
app.get("/annotation/:IdAnnot", function(req, res){
    const id = req.params.IdAnnot // Récupérer l'identifiant de l'utilisateur depuis la requête POST    
    
    var ChoixFormat=req.query.FormatIdAnnot;
	if (ChoixFormat=="html"){
		res.set('Content-Type', 'text/html');
	}
	else {
		if (ChoixFormat=="Json"){
            res.set('Content-Type', 'application/json');
		}	
	}

    var Exist=Object.keys(data).includes(id);
    res.format ({
		   'text/html': function() {
			    if (Exist){
				   res.send(data[id]); 
			    }
			    else {
				   res.send("Aucune annotation n'est associée à cette clé");
			    }
		   },

		   'application/json': function() {
			    if (Exist){
				   res.send(data[id]); 
			    }
			    else {
				   res.send("Aucune annotation n'est associée à cette clé");
			    }
			}
	});
	
});



// app.post('/annotation', (req, res) => {
//     const note = req.body.note
//     const commentaire = req.body.com
//     res.redirect("/annotation");
//     notes.push({"Id": Id, "Annotation": `${note}`, "Commentaire":`${commentaire}`});
//     Id += 1;
//   })

//   app.get('/annotation', (req, res) => {
//     res.send(`Votre annotation a été sauvegardé ! <br>
//         Si vous voulez voir toutes les annotations: 
//         <form action="/resultall" method="get">
//             <button type="submit">Cliquez-ici</button>
//         </form>
//         <br><br>
//         <form action="/formulaire" method="get">
//             <button type="submit">Accueil</button>
//         </form>`)
//   })

app.post('/recupAll', (req, res) => {
    var ChoixFormat=req.query.FormatIdAnnot;
    if (ChoixFormat=="html"){
		res.set('Content-Type', 'text/html');
	}
	else {
		if (ChoixFormat=="Json"){
            res.set('Content-Type', 'application/json');
		}	
	}

    let html = '<ul>';

    for (let key in data) {
      html += '<li>Identifiant=' + key +'  Note='+ data[key].Note +'  et Commentaire='+ data[key].Commentaire +'</li>';
    }
    html += '</ul>';
    res.send(html);
    console.log(html)
})



app.listen(port, function() {
    console.log('serveur listening on port : '+port)
});