var express = require('express');
var app = express();
var data = {};
var data_uri = {};
var id = 0;
var format;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const port = process.env.PORT || 3000;  //Si sur le serveur le port existe alors ça prend le port donné, sinon ça prend 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.static('html'));


// route pour ouvrir le fichier html du formulaire à l'entrée
app.get("/formulaire", function(req, res) {
    res.sendfile("index.html");
});



//ajoute les annotations dans un dictionnaire json
app.post("/formulaire", function(req, res){
	var body = req.body;
	data[id] = body	
    if (body.URI in data_uri) {
        data_uri[body.URI].push(id)	;		
    }
    else {
        data_uri[body.URI] = [id];
    }
	res.send("votre annotation a été sauvegardé à l'identifiant "+id+" !");
    id++;
    console.log("data",data)
    console.log("data uri",data_uri)
});


//--------------------------1 annotation
//Reçoit le formulaire et redirige vers une page  avec comme route l'identifiant
app.get("/annotation", function(req, res){
    const id = req.query.IdAnnot;
    format = req.query.FormatIdAnnot;
    res.redirect(`/annotation/${id}`)
});

//lance la page de l'annotation correspondante
app.get("/annotation/:IdAnnot", function(req, res){
    const id = req.params.IdAnnot // Récupérer l'identifiant de l'utilisateur depuis la requête POST    
    
    var Exist=Object.keys(data).includes(id);
    var ChoixFormat=format;

	if (ChoixFormat=="html"){
		res.set('Content-Type', 'text/html');
        if (Exist){
            let html = "<h2>Annotation correspondante à l'identifiant " + id + " :</h2><br>";
            html += "<p><strong>URI=</strong>" + data[id].URI + "<br><strong>Note=</strong>" + data[id].Note + "<br><strong>Commentaire=</strong>" + data[id].Commentaire + "</p>"
            res.send(html); 
         }
         else {
            res.send("Aucune annotation n'est associée à cette clé");
         }
	}
	else {
		if (ChoixFormat=="Json"){
            res.set('Content-Type', 'application/json');
            if (Exist){
                res.send(data[id]); 
             }
             else {
                res.send("Aucune annotation n'est associée à cette clé");
             }
		}	
	}
	
});
//-----------------------------------



//----------------------------------- 1 URI
//Reçoit le formulaire et redirige vers une page  avec comme route l'uri
app.get("/URI", function(req, res){
    const uri = req.query.recupUri;
    format = req.query.FormatIdAnnot;
    res.redirect(`/URI/${uri}`);
});

app.get("/URI/:recupUri", function(req, res){
    const uri = req.params.recupUri;

    var Exist=Object.keys(data_uri).includes(uri);
    var ChoixFormat=format;

    if (ChoixFormat=="html"){
		res.set('Content-Type', 'text/html');
        if (Exist){
            let html = "<h2>Annotation correspondante à l'URI " + uri + " :</h2><br><ul>";
            for (key in data){
                if (data[key]["URI"]==uri){
                    html += '<li><strong>Identifiant=</strong>' + key +'  <strong>Note=</strong>'+ data[key].Note +'  et <strong>Commentaire=</strong>'+ data[key].Commentaire +'</li>';
                }
            }
            res.send(html); 
         }
         else {
            res.send("Aucune annotation n'est associée à cette clé");
         }
	}
	else {
		if (ChoixFormat=="Json"){
            res.set('Content-Type', 'application/json');

            tab_result = {};
            let i = 0;
            if (Exist){
                for (key in data){
                    if (data[key]["URI"]==uri){
                        tab_result[i] = {"IdAnnotation" : key, "Note" : data[key]["Note"], "Commentaire" : data[key]["Commentaire"]};
                        i++;
                    }
                }
                res.send(tab_result);

             }
             else {
                res.send("Aucune annotation n'est associée à cette clé");
             }
		}	
	}
});


//lance la page de l'uri correspondante
// app.get("/annotation/:Road", function(req, res){
//     const id = req.params.Road // Récupérer l'identifiant de l'utilisateur depuis la requête POST    
    
//     var Exist=Object.keys(data).includes(id);
//     var ChoixFormat=format;

// 	if (ChoixFormat=="html"){
// 		res.set('Content-Type', 'text/html');
//         if (Exist){
//             let html = "<h2>Annotation correspondante à l'identifiant " + id + " :</h2><br>";
//             html += "<p><strong>URI=</strong>" + data[id].URI + "<br><strong>Note=</strong>" + data[id].Note + "<br><strong>Commentaire=</strong>" + data[id].Commentaire + "</p>"
//             res.send(html); 
//          }
//          else {
//             res.send("Aucune annotation n'est associée à cette clé");
//          }
// 	}
// 	else {
// 		if (ChoixFormat=="Json"){
//             res.set('Content-Type', 'application/json');
//             if (Exist){
//                 res.send(data[id]); 
//              }
//              else {
//                 res.send("Aucune annotation n'est associée à cette clé");
//              }
// 		}	
// 	}
// });








//Affiche toutes les annotations qui ont été crée
app.post('/recupAll', (req, res) => {
    var ChoixFormat = req.body.FormatIdAnnot;
    if (ChoixFormat=="html"){
        res.set('Content-Type', 'text/html');
        let html = '<h2>Toutes les annotations:</h2><br><ul>';

        for (let key in data) {
            html += '<li>Identifiant=' + key +'  Note='+ data[key].Note +'  et Commentaire='+ data[key].Commentaire +'</li>';
        }
        html += '</ul>';
        res.send(html);
        }
	else {
		if (ChoixFormat=="Json"){
            res.set('Content-Type', 'application/json');
            res.send(data);
		}	
	}
})



app.listen(port, function() {
    console.log('serveur listening on port : '+port)
});