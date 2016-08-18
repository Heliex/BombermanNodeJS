/** 
		Partie Serveur - Crée par : HELIEX
		Date de création : 25/07/2016
		Date dernière modification : 02/08/2016
**/

/** 
	Objet qui contient tout le code côté serveur, gestion des sockets, des connexions clients
	Permet de mettre en place le serve (via le framework express notamment)
	
**/

// ---------- Chargement des bibliothèques -------------
var express = require("express");
var swig = require("swig");
var app = express();
var Session  = require("express-session");
var SessionStore = require('session-file-store')(Session);
var ios = require('socket.io-express-session');
var session = Session({ secret: 'pass', resave: true, saveUninitialized: true});
var bodyParser = require('body-parser');
var io = require('socket.io').listen(app.listen(8080));
var path = require('path');
var vitesseDeplacement = 3;
var NB_MAX_PLAYERS =4;
var nbPlayersConnected = 0;
var timerDepart = 0;

// ---------- Utilisation des cookies & des sessions -------------
app.use(bodyParser.urlencoded({ extended : true }));
app.use(session);
io.use(ios(session));
app.use(express.static(path.join(__dirname, 'public')));


// ---------- Mise en place du moteur de template -------------
app.engine('html',swig.renderFile);
app.set('view engine','html');
app.set('views',"ihm");

// ---------- Définition des routes -------------
app.get('/login',function(req,res) {
	res.render('login');
});

app.get('/Bomberman/Multiplayer', function(req,res) {

	res.render('index', {'session' : req.session});
	
});

app.post('/Bomberman', function(req,res) {
	req.session.uid = Date.now();
	req.session.nickname = req.body.pseudo;
	res.redirect('/Bomberman/Multiplayer');
});

// ---------- Définitions des middlewares -------------
app.use(function(req,res,next) {
	if( typeof(req.session.nickname) == 'undefined')
	{
		res.redirect('/login');
	}
	else
	{
		next();
	}
});

app.use(function(req,res,next) {
	res.redirect('/Bomberman/Multiplayer');
});


io.on('connection', function(socket) {
	console.log('connexion du client');

	// Evenement new gamer qui se connecte
	socket.on('newGamer',function(newGamer) {
		socket.handshake.session.idJoueur=nbPlayersConnected;
        nbPlayersConnected++;
		socket.handshake.session.save();
		setTimeout(function(){
			io.sockets.emit('message','Le joueur ' + newGamer + ' vient de se connecter,Nombre de joueurs connecté : ' + nbPlayersConnected + '/' + NB_MAX_PLAYERS + ' Nombre de joueurs manquants : ' + (NB_MAX_PLAYERS - nbPlayersConnected));
			if(nbPlayersConnected == 2)
			{
				io.sockets.emit('init', {lvl : "0011000000000000000000000100000000000000111111111100000000000000000000000000000000000000000000000000000111111111111110000000000000000000000000000000000000000000000000000000000000000111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",numJoueur : socket.handshake.session.idJoueur});
			}	
		}, 1000);
	});
	
	socket.on('bonus',function(bonus,x,y) {
		io.sockets.emit('bonus',bonus,x,y);
	});
	socket.on('explode',function(idJoueur, idBombe) { // Quand je recois un explode de bombe j'envoi à tous les clients
			io.sockets.emit('explode',idJoueur, idBombe);
	});
	
	socket.on('breakWall',function(x,y) {
			io.sockets.emit('breakWall',x,y);
	});
	
	// Evenement envoi de message d'un client
	socket.on('message', function(message) {
		io.sockets.emit('message', socket.handshake.session.nickname + " dit : " + message);
	});
	
	socket.on('removePV',function(idJoueur) {
		io.sockets.emit('removePV',idJoueur);
	});
	
	socket.on('gameover',function(idJoueur){
		io.sockets.emit('gameover',idJoueur);
	});
	
	socket.on('speedup', function(idJoueur) {
		io.sockets.emit('speedup',idJoueur);
	});
	
	socket.on('speeddown',function(idJoueur) {
		io.sockets.emit('speeddown',idJoueur);
	});
	
	socket.on('bombeup',function(idJoueur) {
		io.sockets.emit('bombeup',idJoueur);
	});
	
	socket.on('bombedown',function(idJoueur) {
		io.sockets.emit('bombedown',idJoueur);
	});
	// Evenement de commande
	socket.on('commande', function(commande,game) {
	
		// Je renvoie instantanement la commande ( la gestion se fera côté client)
		io.sockets.emit('update',socket.handshake.session.idJoueur,commande);
		
	});
    
    socket.on('commandeRelachee', function(commande) {
        io.sockets.emit('commandeRelachee',socket.handshake.session.idJoueur,commande);
        
    });

});