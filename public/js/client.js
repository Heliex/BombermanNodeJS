/** 
		Script client - Crée par : HELIEX
		Date de création : 25/07/2016
		Date dernière modification : 08/08/2016
**/

/** 
	Permet de créer le jeu + gérer les événements sur les pressions de touches
	+ Réaction des sockets --> PB DE GESTION DES PV SUR LES SOCKET (A VOIR ET  A REGLER)
**/
$(function(){

	// Initialise le requestAnimationFrame pour que ça marche correctement sur tous les navigateurs
	function optimizeRequestAnimationFrameForBrowser() {
		var lastTime = 0;
		var vendors = ['webkit', 'moz'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame =
			  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	};
	optimizeRequestAnimationFrameForBrowser(); // Appel de la fonction au départ -> Première instruction
    
     // Partie variable globales
	var tchatOffset = 50; // Offset lors d'un nouveau message dans le tchat
	var hauteur = 500; // Hauteur de base du tchat
	var ctx = $("#gameMap")[0].getContext('2d');
	
	// Déclarations d'images
	var sol = new Image();
	var deplacements = new Image();
	var bombe = new Image();
	var morts = new Image();
	var explosions = new Image();
	var bonus = new Image();
	
	// Création du jeu
	var game = new Game({tailleCase : 32, nbCaseHauteur : 20, nbCaseLargeur : 20 ,images : { sol : sol, deplacements : deplacements, bombe : bombe , morts : morts, explosions : explosions, bonus : bonus}});
	var animations = game.getAnimations();
    var joueurs = game.getJoueurs();
	var maxVitesse = 16;
	// Gestion des événements
	socket.on('message',function(message) {
		$('.tchat').append("<p>" +  message + "</p>"); 
        defileToolbar();
	});
	
	socket.on('init', function(data) {
		game.Init(data.lvl);
		render();
		numJoueur = data.numJoueur;
	})
	
	// Gestion d'un envoi de message
	$('.messageBox').submit(function(event) {
		event.preventDefault();
		socket.emit('message',$('.message').val());
        
		$('.message').val('');
	});
	
	// Sur le click du canvas, je récupere le focus dessus
	$('#gameMap').click(function() {
		$('#gameMap').focus();
	})
	
	// Gestion des entrée clavier dans le canvas
	$('#gameMap').keydown(function(e) {
        /* Game logic */
        var commande = getCommande(e.which);
        socket.emit('commande',commande, JSON.stringify(game)); // J'envoie le jeu et la vitesse de deplacement comme ça je test si je sors du plateau
        return false;
	});
	
	$('#gameMap').keyup(function(e) {
		var commande = getCommande(e.which);
        socket.emit('commandeRelachee',commande);
	});
	
	// Sur la mise à jour du teuchatte
	socket.on('update',function(idJoueur,commande) {
		if(!joueurs[idJoueur].isGameOver())
		{
			$('.tchat').append("<p> Le serveur demande a ce qu'on mette à jour le joueur " + idJoueur + " avec la commande : " + commande); // Mode debug
			defileToolbar();
			var xCurrent = joueurs[idJoueur].getPoint().getX();
			var yCurrent = joueurs[idJoueur].getPoint().getY();
			var vitesseDepla = joueurs[idJoueur].getVitesseDepla();
			
			// Gestion des collisions (Le serveur se contente de renvoyer les commandes -> Plus efficace pour les connexions lentes)
			if(commande == "RIGHT")
			{
				joueurs[idJoueur].setMove(true);
				joueurs[idJoueur].setDirection(0);
				if(game.getCase(xCurrent+ 18, yCurrent) != 'undefined') // SI la case que je récupère n'est pas undefined
				{
					if(xCurrent + vitesseDepla < game.getLargeurGame() - 18 && game.getCase(xCurrent + 18,yCurrent).getType() != "MUR") // Si le X + le depla est dans le plateau et que la case qui vient n'est pas un mur
					{
						 joueurs[idJoueur].getPoint().setX(xCurrent + vitesseDepla );
					} 
				}
				animations["DROITEJ" + idJoueur].setX(joueurs[idJoueur].getPoint().getX());
				animations["DROITEJ" + idJoueur].setY(joueurs[idJoueur].getPoint().getY());
				animations["DROITEJ" + idJoueur].Start();
			}
			else if(commande == "DOWN")
			{
				joueurs[idJoueur].setMove(true);
				joueurs[idJoueur].setDirection(1);
				if(game.getCase(xCurrent,(yCurrent + vitesseDepla + 24)) != 'undefined')
				{
					if(yCurrent + vitesseDepla < game.getHauteurGame() - 24 && game.getCase(xCurrent,(yCurrent + vitesseDepla + 24)).getType() != "MUR") // Si le y est dans le plateau et que la case qui viens n'est pas un mur
					{
						joueurs[idJoueur].getPoint().setY(yCurrent + vitesseDepla);
					}
				}
				animations["BASJ" + idJoueur].setX(joueurs[idJoueur].getPoint().getX());
				animations["BASJ" + idJoueur].setY(joueurs[idJoueur].getPoint().getY());
				animations["BASJ" + idJoueur].Start();
			}
			else if(commande == "LEFT")
			{
				joueurs[idJoueur].setMove(true);
				joueurs[idJoueur].setDirection(2);
				if(game.getCase(xCurrent - vitesseDepla,yCurrent) != 'undefined')
				{
					if((xCurrent - vitesseDepla) > 0 && game.getCase(xCurrent - vitesseDepla,yCurrent).getType() != "MUR" && xCurrent > 0)
					{
						joueurs[idJoueur].getPoint().setX(xCurrent - vitesseDepla);
						
					}
				}
				animations["GAUCHEJ" + idJoueur].setX(joueurs[idJoueur].getPoint().getX());
				animations["GAUCHEJ" + idJoueur].setY(joueurs[idJoueur].getPoint().getY());
				animations["GAUCHEJ" + idJoueur].Start();
			}
			else if(commande == "UP")
			{
				joueurs[idJoueur].setMove(true);
				joueurs[idJoueur].setDirection(3);
				if(game.getCase(xCurrent,yCurrent - vitesseDepla) != 'undefined')
				{
					if(yCurrent - vitesseDepla > 0 && game.getCase(xCurrent,yCurrent - vitesseDepla).getType() != "MUR")
					{
						joueurs[idJoueur].getPoint().setY(yCurrent - vitesseDepla);
					}
				}
				animations["HAUTJ" + idJoueur].setX(joueurs[idJoueur].getPoint().getX());
				animations["HAUTJ" + idJoueur].setY(joueurs[idJoueur].getPoint().getY());
				animations["HAUTJ" + idJoueur].Start();
			}
			else if(commande == "BOMB")
			{
				// Ici enfaites faut faire un for sur les bombe du joueur pour tester si y'en a une de disponible, et si c'est le cas l'afficher au coordonées qui vont bien
				if(joueurs[idJoueur].getNbBombeRestante() > 0)
				{
					for(var i = 0 ; i < joueurs[idJoueur].getMaxBombe() ; i++)
					{
						if(!animations["BOMBEJ" + idJoueur + "B" + i].isShowing() && joueurs[idJoueur].getNbBombeOnBoard() < joueurs[idJoueur].getMaxBombe() && joueurs[idJoueur].getNbBombeRestante() > 0)
						{
							animations["BOMBEJ" + idJoueur + "B" + i].setX(joueurs[idJoueur].getPoint().getX());
							animations["BOMBEJ" + idJoueur + "B" + i].setY(joueurs[idJoueur].getPoint().getY());
							animations["BOMBEJ" + idJoueur + "B" + i].Start();
						   
							joueurs[idJoueur].removeBombeRestante();
							break;
						}
					}
				  }
			}
		}
	});
    
	// Le serveur informe lorsqu'un joueur relache sa touche( ce qui permet de stopper l'animation)
    socket.on('commandeRelachee', function(idJoueur,commande) {
		if(!joueurs[idJoueur].isGameOver())
		{
			 if(commande == "RIGHT")
			{
				joueurs[idJoueur].setMove(false);
				animations["DROITEJ" +idJoueur].Stop();
			}
			else if(commande == "DOWN")
			{
				joueurs[idJoueur].setMove(false);
				animations["BASJ" + idJoueur].Stop();
			}
			else if(commande == "LEFT")
			{
				joueurs[idJoueur].setMove(false);
				animations["GAUCHEJ" +idJoueur].Stop();
			}
			else if(commande == "UP")
			{
				joueurs[idJoueur].setMove(false);
				animations["HAUTJ" +idJoueur].Stop();
			}
		}   
    });
    
	
	socket.on('explode',function(idJoueur,idBombe) {
		var coord = game.drawExplosion(idJoueur,idBombe);
		calculateExplosion(coord.xMilieu,coord.yMilieu,coord.xGauche,coord.yGauche,coord.xDroite,coord.yDroite,coord.xHaut,coord.yHaut,coord.xBas,coord.yBas,coord.largeur,coord.hauteur);
		checkPlayer(coord.xGauche,coord.xDroite,coord.yHaut,coord.yBas,coord.largeur,coord.hauteur);
		
				
	});
	
	socket.on('breakWall',function(x,y){
		game.getCase(x,y).setType("VIDE");
	});
	
	socket.on('removePV',function(idJoueur) {
		if(joueurs[idJoueur].getPv() > 0)
		{
			if( (Date.now() - joueurs[idJoueur].getTimerDamage()) > joueurs[idJoueur].getDelayBetweenDamage())
			{
				joueurs[idJoueur].setTimerDamage(Date.now());
				joueurs[idJoueur].setPv(joueurs[idJoueur].getPv() - 1);
			}
			if(joueurs[idJoueur].getPv() == 0 && !joueurs[idJoueur].isGameOver())
			{
					socket.emit('gameover',idJoueur);
			}
		}
	});
	
	socket.on('bonus',function(bonus,x,y) {
		animations[bonus].setX(x);
		animations[bonus].setY(y);
		animations[bonus].Start();
	});
	
	socket.on('gameover',function(idJoueur) {
		console.log("Le joueur : " + idJoueur+ " est gameover" );
        joueurs[idJoueur].setGameOver(true);
		animations["MORTJ" + idJoueur].setX(joueurs[idJoueur].getPoint().getX());
		animations["MORTJ" + idJoueur].setY(joueurs[idJoueur].getPoint().getY());
		animations["MORTJ" + idJoueur].Start();
	});
	
	socket.on('speedup',function(idJoueur) {
	
		if(joueurs[idJoueur].getVitesseDepla() < joueurs[idJoueur].getVitesseMax())
		{
			joueurs[idJoueur].setVitesseDepla(joueurs[idJoueur].getVitesseDepla() + 3);
		}
	});
	
	socket.on('bombeup',function(idJoueur) {
		if(joueurs[idJoueur].getNbBombeRestante() < joueurs[idJoueur].getMaxBombe())
		{
			joueurs[idJoueur].setNbBombeRestante(joueurs[idJoueur].getNbBombeRestante() + 1);
		}
	});
	
	socket.on('speeddown',function(idJoueur){
		if(joueurs[idJoueur].getVitesseDepla() > 3)
		{
			joueurs[idJoueur].setVitesseDepla(joueurs[idJoueur].getVitesseDepla() - 3);
		}
	});
	
	socket.on('bombedown',function(idJoueur) {
		if(joueurs[idJoueur].getNbBombeRestante() > 1)
		{
			joueurs[idJoueur].setNbbombeRestante(joueurs[idJoueur].getNbBombeRestante() - 1);
		}
	});

	// Fonction qui fait défiler la barre du tchat
    var defileToolbar = function() {
       $(".tchat").scrollTop(hauteur);
        hauteur += tchatOffset;
    };
	
	// Fonction qui appelle le render de game
	var render = function()
	{
		// Je check si ya un bonus à faire POP
		if(Date.now() - game.getBonusTimer() > game.getDelayBetweenRandomBonus())
		{
			game.setBonusTimer(Date.now());
			var bonus = game.generateBonus();
			console.log(bonus);
			// Random case 
			var coord = game.randomCase();
			animations[bonus].setX(coord.x * game.getTailleCase() + 16);
			animations[bonus].setY(coord.y * game.getTailleCase() + 16);
			socket.emit('bonus',bonus,animations[bonus].getX(),animations[bonus].getY());
		}
		game.Render(ctx);
		for(var i = 0; i < joueurs.length ; i++)
		{
			for(var j = 0 ; j < joueurs[i].getMaxBombe() ; j++) // GEstion des explosions
			{
				if(animations["BOMBEJ" + i + "B" + j].isEnded())
				{
					socket.emit('explode',i,j);
					animations["BOMBEJ" + i + "B" + j].setEnd(false);
                    joueurs[i].addBombeRestante();
				}
			}
			
			if(animations["BOMBEUP"].isShowing() && isInBonus(i,animations["BOMBEUP"]) )
			{
				console.log("Le joueur est dans le bonus bombe supplémentaire");
				animations["BOMBEUP"].Stop();
				socket.emit('bombeup',i);
			}
			else if(animations["SPEEDUP"].isShowing()&&  isInBonus(i,animations["SPEEDUP"]))
			{
				console.log("Le joueur est dans le bonus de déplacement + rapide");
				animations["SPEEDUP"].Stop();
				socket.emit('speedup',i);
			}
			else if(animations["ENABLEMOVINGBOMB"].isShowing() && isInBonus(i,animations["ENABLEMOVINGBOMB"]))
			{
				console.log("Le joueur est dans le bonus qui permet de déplacer une bombe");
				animations["ENABLEMOVINGBOMB"].Stop();
				socket.emit('enablemovingbomb',i);
			}
			else if(animations["ENABLEBOXINGBOMB"].isShowing() && isInBonus(i,animations["ENABLEBOXINGBOMB"]) )
			{
				console.log("Le joueur est dans le bonus qui permet de pousse une bombe en ligne droite");
				animations["ENABLEBOXINGBOMB"].Stop();
				socket.emit('enablemovingbomb',i);
			}
			else if(animations["EXPLODEUP"].isShowing() && isInBonus(i,animations["EXPLODEUP"]))
			{
				console.log("Le joueur est dans le bonus qui augmente la range d'explosion de 1");
				animations["EXPLODEUP"].Stop();
				socket.emit('explodeup',i);
			}
			else if(animations["DAMAGEUP"].isShowing() && isInBonus(i,animations["DAMAGEUP"]))
			{
				console.log("Le joueur est dans le bonus qui augmente les dégats");
				animations["DAMAGEUP"].Stop();
				socket.emit('damageup',i);
			}
			else if(animations["MAXIMUMEXPLODE"].isShowing() && isInBonus(i,animations["MAXIMUMEXPLODE"]))
			{
				console.log("Le joueur est dans le bonus qui met la range maximale d'une explosion");
				animations["MAXIMUMEXPLODE"].Stop();
				socket.emit('maximumexplode',i);
			}
			else if(animations["BOMBEDOWN"].isShowing() && isInBonus(i,animations["BOMBEDOWN"]))
			{
				console.log("Le joueur est dans le malus qui retire une bombe");
				animations["BOMBEDOWN"].Stop();
				socket.emit('bombedown',i);
			}
			else if(animations["SPEEDDOWN"].isShowing() && isInBonus(i,animations["SPEEDDOWN"]))
			{
				animations["SPEEDDOWN"].Stop();
				socket.emit('speeddown',i);
				console.log("Le joueur est dans le malus qui ralentit le joueur");
			}
			else if(animations["DISABLEMOVINGBOMB"].isShowing() && isInBonus(i,animations["DISABLEMOVINGBOMB"]))
			{
				animations["DISABLEMOVINGBOMB"].Stop();
				socket.emit('disablemovingbomb',i);
				console.log("Le joueur est dans le malus qui retire la capa à déplacer les bombes");
			}
			else if(animations["DISABLEBOXINGBOMB"].isShowing() && isInBonus(i,animations["DISABLEBOXINGBOMB"]))
			{
				animations["DISABLEBOXINGBOMB"].Stop();
				socket.emit('disableboxingbomb',i);
				console.log("Le joueur est dans le malus qui retire la capa a pousser les bombes en ligne droite");
			}
			else if(animations["EXPLODEDOWN"].isShowing() && isInBonus(i,animations["EXPLODEDOWN"]))
			{
				animations["EXPLODEDOWN"].Stop();
				socket.emit('explodedown',i);
				console.log("Le joueur est dans le malus qui réduit la portée d'explosion");
			}
			else if(animations["DAMAGEDOWN"].isShowing() && isInBonus(i,animations["DAMAGEDOWN"]))
			{
				animations["DAMAGEDOWN"].Stop();
				socket.emit('damagedown',i);
				console.log("Le joueur est dans le malus qui réduit les dégats d'explosion");
			}
			else if(animations["MINIMUMEXPLODE"].isShowing() && isInBonus(i,animations["MINIMUMEXPLODE"]))
			{
				animations["MINIMUMEXPLODE"].Stop();
				socket.emit('minimumexplode',i);
				console.log("Le joueur est dans le malus qui met directement la portée d'explosion au minimum");
			}
		}
		
		// Check si toutes les animationsd es bombes sont terminée.
		requestAnimationFrame(render);
	}
	
	var checkPlayer = function(xGauche,xDroite,yHaut,yBas,largeur,hauteur) {
		
		for(var i = 0 ; i < joueurs.length ; i++)
		{
			var x = joueurs[i].getPoint().getX();
			var y = joueurs[i].getPoint().getY();
			if(x >= xGauche  && x <= xDroite && x <= xDroite + (largeur*2)  && y >= yHaut && y <= yBas && y <= yBas+ (hauteur*2))
			{
				socket.emit('removePV',i);
			}
		}
	};
	
	var isInBonus = function (idJoueur,bonus)
	{
		var isIn = false;
		var xJoueur = joueurs[idJoueur].getPoint().getX();
		var yJoueur = joueurs[idJoueur].getPoint().getY();
		var xBonus = bonus.getX();
		var yBonus = bonus.getY();
		
		if(xJoueur +8 >= xBonus && xJoueur+8 <= xBonus + bonus.getLargeur() && yJoueur +8 >= yBonus && yJoueur+8 <= yBonus + bonus.getLargeur() && xJoueur + 24 >= xBonus && yJoueur + 24 >= yBonus)
		{
			isIn = true;
		}
		
		return isIn;
		
	}
	
	var calculateExplosion = function (xMilieu,yMilieu,xGauche,yGauche,xDroite,yDroite,xHaut,yHaut,xBas,yBas,largeur,hauteur)
	{
			// A gauche
			for(var i = xMilieu ; i > xGauche ; i-=largeur)
			{
				if(i >= 0)
				{
					if(game.getCase(i,yMilieu).getType() == "MUR")
					{
						socket.emit('breakWall',i,yMilieu);
						break;
					}
				}
			}
			
			// A droite
			for(var i = xMilieu ; i < xDroite ; i+=largeur)
			{
				if(i < game.getLargeurGame() && i+largeur < game.getLargeurGame())
				{
					if(game.getCase(i,yMilieu).getType() =="MUR" )
					{
						socket.emit('breakWall',i,yMilieu);
						break;
					}
					else if(game.getCase(i+largeur,yMilieu).getType() == "MUR")
					{
						socket.emit('breakWall',i+largeur,yMilieu);
						break;
					}
				}
				
			}
			
			// En haut
			for(var i = yMilieu ; i > yHaut ; i-=hauteur)
			{
				if(i >=0)
				{
					if(game.getCase(xMilieu,i).getType() == "MUR")
					{
						socket.emit('breakWall',xMilieu,i);
						break;
					}
				}
				
			}
			
			// En bas
			for(var i = yMilieu; i < yBas; i+=hauteur)
			{
				if(i < game.getHauteurGame() &&  i+hauteur < game.getHauteurGame())
				{
					if(game.getCase(xMilieu,i).getType() == "MUR")
					{
						socket.emit('breakWall',xMilieu,i);
						break;
					}
					else if(game.getCase(xMilieu,i+hauteur).getType() == "MUR")
					{
						socket.emit('breakWall',xMilieu,i+hauteur);
						break;
					}
				}
			}
	};
});


var getCommande = function(codeNum)
{
	var commande = '';
	switch(codeNum)
	{
		case 37:
		case 81:
		commande="LEFT";
		break;
		
		case 38:
		case 90:
		commande="UP";
		break;
		
		case 39:
		case 68:
		commande="RIGHT";
		break;
		
		case 40:
		case 83:
		commande="DOWN";
		break;
		
		case 66:
		commande ="BOMB";
		break;
		
		default:
		commande = "NONE";
		break;
	}
	return commande;
};
