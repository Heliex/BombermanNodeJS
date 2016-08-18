/** 
		Objet Game - Crée par : HELIEX
		Date de création : 02/08/2016
		Date dernière modification : 09/08/2016
**/

/** Constructeur de Joueur
	  Prend en paramètre un objet options avec des paramètres :
	  
		- animations : Le tableau d'animation à dessiner -> N
		- tailleCase : La taille de chacune des cases sur le plateau -> N
		- nbCaseHauteur : Le nombre de case verticale -> N
		- nbCaseLargeur : Le nombre de case horizontale -> N
		- images : les images qui vont bien pour le jeu -> N
		- joueurs : les joueurs associés au jeu -> N
		
	  Attribut du jeu :
		- plateau : Représente la grille du jeu
		- largeurGame : Largeur du jeu calculée (en px)
		- hauteurGame : hauteur du jeu calculée (en px)
**/

var Game = function(options)
{
    this._nbJoueurs = options.nbJoueurs ||4
	this._animations = options.animations || {};
	this._tailleCase = options.tailleCase || 12;
	this._nbCaseHauteur = options.nbCaseHauteur ||12;
	this._nbCaseLargeur = options.nbCaseLargeur ||12;
	this._joueurs = options.joueurs || new Array(this._nbJoueurs);
	this._plateau = new Array(this.getNbCaseHauteur());
	this._images = options.images || {};
	this._bonus = {};
	this._startTimer = Date.now();
	this._bonusTimer = Date.now();
	this._delayBetweenRandomBonus = 17000;
	for(var i = 0 ; i < this.getPlateau().length ; i++)
	{
		this.getPlateau()[i] = new Array(this.getNbCaseLargeur());
	}
	this._largeurGame = this.getTailleCase() * this.getNbCaseLargeur();
	this._hauteurGame = this.getTailleCase() * this.getNbCaseHauteur();
}

Game.prototype.getBonusTimer = function()
{
	return this._bonusTimer;
}

Game.prototype.setBonusTimer = function(b)
{
	this._bonusTimer = b;
}
Game.prototype.setDelayBetweenRandomBonus = function(d)
{
	this._delayBetweenRandomBonus = d;
}
Game.prototype.getDelayBetweenRandomBonus = function()
{
	return this._delayBetweenRandomBonus;
}

Game.prototype.getStartTimer = function()
{
	return this._startTimer;
}

Game.prototype.setStartTimer = function(t)
{
	this._startTimer = t;
}
// Retourne la grille de jeu
Game.prototype.getPlateau = function()
{
	return this._plateau;
}

Game.prototype.getBonus = function()
{
	return this._bonus;
}

Game.prototype.setBonus = function(b)
{
	this._bonus = b;
}

// Permet d'initialiser le niveau grâce à ce qu'envoie le serveur
Game.prototype.Init = function(lvl)
{
	var offset = 0;
	this.setBonusTimer(Date.now());
	this.setStartTimer(Date.now());
	for(var i = 0 ; i < this.getPlateau().length ; i++)
	{
		var ligne = lvl.substring(offset, offset+this.getNbCaseLargeur());
		for(var j = 0 ; j < this.getPlateau()[i].length; j++)
		{
			var type = this.getType(ligne.charAt(j));
			var point = new Point(j,i);
			this.getPlateau()[j][i] = new Case({ point : point , type : type, cote : this.getTailleCase()});
		}
		offset+=this.getNbCaseLargeur();
	}
	// SET the images sources
	this.getImages().sol.src	= "../images/Grounds.png";
	this.getImages().bombe.src = "../images/Bombe.png";
	this.getImages().deplacements.src = "../images/Deplacements.png";
	this.getImages().explosions.src="../images/Explosions.png";
	this.getImages().morts.src="../images/Mort.png";
	this.getImages().bonus.src="../images/Bonus.png";
	
    // Set all joueurs
    this.getJoueurs()[0] = new Joueur(new Point(0,0),0,0);
	this.getJoueurs()[1] = new Joueur(new Point((this.getNbCaseLargeur() - 1) * this.getTailleCase() ,0),1,3);
    this.getJoueurs()[2] = new Joueur(new Point(0,(this.getNbCaseHauteur() - 1) * this.getTailleCase()),2,0);
    this.getJoueurs()[3] = new Joueur(new Point((this.getNbCaseLargeur() - 1) * this.getTailleCase(),(this.getNbCaseHauteur() - 1) * this.getTailleCase()),3,3);
    
	// Set all animations
	
	// BONUS
	this.getAnimations()["BOMBEUP"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip : 0, delay : 0, nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 0, show : false, ignore : true});
	this.getAnimations()["SPEEDUP"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip : 0 , delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 16, show : false, ignore : true});
	this.getAnimations()["ENABLEMOVINGBOMB"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip : 0 , delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 32, show : false, ignore : true});
	this.getAnimations()["ENABLEBOXINGBOMB"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip:  0 , delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 48, show : false, ignore : true});
	this.getAnimations()["EXPLODEUP"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip:  0 , delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 64, show : false, ignore : true});
	this.getAnimations()["DAMAGEUP"] = new Animation({x : 0, y :0 , largeur : 16, hauteur : 16, yClip:  0 , delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 80, show : false, ignore : true});
	this.getAnimations()["MAXIMUMEXPLODE"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip : 0 , delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 96, show : false, ignore : true});
	
	this.getAnimations()["BOMBEDOWN"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip : 16, delay : 0, nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 0, show : false, ignore : true});
	this.getAnimations()["SPEEDDOWN"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip :16 , delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 16, show : false, ignore : true});
	this.getAnimations()["DISABLEMOVINGBOMB"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip : 16 , delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 32, show : false, ignore : true});
	this.getAnimations()["DISABLEBOXINGBOMB"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip : 16 , delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 48, show : false, ignore : true});
	this.getAnimations()["EXPLODEDOWN"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip: 16 , delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 64, show : false, ignore : true});
	this.getAnimations()["DAMAGEDOWN"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip : 16, delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 80, show : false, ignore : true});
	this.getAnimations()["MINIMUMEXPLODE"] = new Animation({x : 0, y : 0 , largeur : 16, hauteur : 16, yClip : 16, delay : 0 , nbFrame : 1 , image : this.getImages().bonus, loop : true, xDepart : 96, show : false, ignore : true});
	
	
	// DEAD ANIMATIONS
	this.getAnimations()["MORTJ0"] = new Animation({x: 0, y:0, largeur : 18, hauteur : 24, yClip : 0, delay : 375, nbFrame : 4, image : this.getImages().morts, loop: false, xDepart : 0, show : false, ignore : false, duree : 1500});
	this.getAnimations()["MORTJ1"] = new Animation({x: 0, y:0, largeur : 18, hauteur : 24, yClip : 24, delay : 375, nbFrame : 4, image : this.getImages().morts, loop: false, xDepart : 0, show : false, ignore : false, duree : 1500});
	this.getAnimations()["MORTJ2"] = new Animation({x: 0, y:0, largeur : 18, hauteur : 24, yClip : 48, delay : 375, nbFrame : 4, image : this.getImages().morts, loop: false, xDepart : 0, show : false, ignore : false, duree : 1500});
	this.getAnimations()["MORTJ3"] = new Animation({x: 0, y:0, largeur : 18, hauteur : 24, yClip : 72, delay : 375, nbFrame : 4, image : this.getImages().morts, loop: false, xDepart : 0, show : false, ignore : false, duree : 1500});
	// RIGHT
	this.getAnimations()["DROITEJ0"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 0, delay : 250 , nbFrame : 3, image : this.getImages().deplacements, loop : true, xDepart : 18*3, show : false, ignore : true });
	this.getAnimations()["DROITEJ1"] =  new Animation({x : 0, y : 0, largeur : 18 ,hauteur : 24, yClip : 24, delay : 250, nbFrame : 3 , image : this.getImages().deplacements, loop : true, xDepart : 18*3, show : false, ignore : true });
	this.getAnimations()["DROITEJ2"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 48, delay : 250, nbFrame : 3 , image : this.getImages().deplacements, loop : true, xDepart : 18*3, show : false, ignore : true});
	this.getAnimations()["DROITEJ3"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 72, delay : 250, nbFrame : 3, image : this.getImages().deplacement, loop : true, xDepart : 18*3, show : false, ignore : true});
	
	// DOWN
	this.getAnimations()["BASJ0"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 0, delay : 250 , nbFrame : 3, image : this.getImages().deplacements, loop : true, xDepart : 0, show : false, ignore : true });
	this.getAnimations()["BASJ1"] =  new Animation({x : 0, y : 0, largeur : 18 ,hauteur : 24, yClip : 24, delay : 250, nbFrame : 3 , image : this.getImages().deplacements, loop : true, xDepart : 0, show : false, ignore : true});
	this.getAnimations()["BASJ2"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 48, delay : 250, nbFrame : 3 , image : this.getImages().deplacements, loop : true, xDepart : 0, show : false, ignore : true});
	this.getAnimations()["BASJ3"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 72, delay : 250, nbFrame : 3, image : this.getImages().deplacement, loop : true, xDepart : 0, show : false, ignore : true});
	
	// LEFT
	this.getAnimations()["GAUCHEJ0"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 0, delay : 250 , nbFrame : 3, image : this.getImages().deplacements, loop : true, xDepart : 18*9, show : false, ignore : true});
	this.getAnimations()["GAUCHEJ1"] =  new Animation({x : 0, y : 0, largeur : 18 ,hauteur : 24, yClip : 24, delay : 250, nbFrame : 3 , image : this.getImages().deplacements, loop : true, xDepart : 18*9, show : false, ignore : true});
	this.getAnimations()["GAUCHEJ2"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 48, delay : 250, nbFrame : 3 , image : this.getImages().deplacements, loop : true, xDepart : 18*9, show : false, ignore : true});
	this.getAnimations()["GAUCHEJ3"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 72, delay : 250, nbFrame : 3, image : this.getImages().deplacement, loop : true, xDepart : 18*9, show : false, ignore : true});
	
	// UP
	this.getAnimations()["HAUTJ0"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 0, delay : 250 , nbFrame : 3, image : this.getImages().deplacements, loop : true, xDepart : 18*6, show : false, ignore : true });
	this.getAnimations()["HAUTJ1"] =  new Animation({x : 0, y : 0, largeur : 18 ,hauteur : 24, yClip : 24, delay : 250, nbFrame : 3 , image : this.getImages().deplacements, loop : true, xDepart : 18*6, show : false, ignore : true });
	this.getAnimations()["HAUTJ2"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 48, delay : 250, nbFrame : 3 , image : this.getImages().deplacements, loop : true, xDepart : 18*6, show : false, ignore : true});
	this.getAnimations()["HAUTJ3"] =  new Animation({x : 0, y : 0, largeur : 18, hauteur : 24, yClip : 72, delay : 250, nbFrame : 3, image : this.getImages().deplacement, loop : true, xDepart : 18*6, show : false, ignore : true });
	
	// BOMBE LIEE AU JOUEUR 1
	this.getAnimations()["BOMBEJ0B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ0B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ0B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ0B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ0B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	
	// BOMBE LIEE AU JOUEUR 2
	this.getAnimations()["BOMBEJ1B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ1B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ1B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ1B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ1B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	
	// BOMBE LIEE AU JOUEUR 3
	this.getAnimations()["BOMBEJ2B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ2B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ2B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ2B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ2B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	
	// BOMBE LIEE AU JOUEUR 4
	this.getAnimations()["BOMBEJ3B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ3B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ3B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ3B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	this.getAnimations()["BOMBEJ3B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 150 , nbFrame : 3 , image : this.getImages().bombe, loop : true, xDepart : 0, show : false, ignore : false, duree : 3000});
	
	// EXPLOSION LIEE AU JOUEUR 1 (MILIEU DE L EXP)
	this.getAnimations()["EXPLOMJ0B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ0B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ0B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ0B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ0B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 2 (MILIEU DE L EXP)
	this.getAnimations()["EXPLOMJ1B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ1B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ1B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ1B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ1B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 3 (MILIEU DE L EXP)
	this.getAnimations()["EXPLOMJ2B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ2B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ2B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ2B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ2B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 4 (MILIEU DE L EXP)
	this.getAnimations()["EXPLOMJ3B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ3B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ3B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ3B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMJ3B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 0, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 1 (PARTIE GAUCHE DE L'EXPLOSION)
	this.getAnimations()["EXPLOMGJ0B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ0B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ0B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ0B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ0B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 2 (PARTIE GAUCHE DE L'EXPLOSION)
	this.getAnimations()["EXPLOMGJ1B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ1B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ1B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ1B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ1B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});

	// EXPLOSION LIEE AU JOUEUR 3 (PARTIE GAUCHE DE L'EXPLOSION)
	this.getAnimations()["EXPLOMGJ2B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ2B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ2B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ2B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ2B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});

	// EXPLOSION LIEE AU JOUEUR 4 (PARTIE GAUCHE DE L'EXPLOSION)
	this.getAnimations()["EXPLOMGJ3B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ3B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ3B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ3B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMGJ3B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 16, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 1 (PARTIE EXTREMITE GAUCHE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEGJ0B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ0B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ0B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ0B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ0B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 2 (PARTIE EXTREMITE GAUCHE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEGJ1B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ1B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ1B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ1B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ1B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 3 (PARTIE EXTREMITE GAUCHE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEGJ2B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ2B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ2B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ2B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ2B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 4 (PARTIE EXTREMITE GAUCHE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEGJ3B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ3B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ3B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ3B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEGJ3B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 32, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 1 (PARTIE MILIEU DROITE DE L'EXPLOSION)
	this.getAnimations()["EXPLOMDJ0B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ0B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ0B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ0B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ0B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 2 (PARTIE MILIEU DROITE DE L'EXPLOSION)
	this.getAnimations()["EXPLOMDJ1B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ1B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ1B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ1B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ1B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 3 (PARTIE MILIEU DROITE DE L'EXPLOSION)
	this.getAnimations()["EXPLOMDJ2B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ2B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ2B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ2B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ2B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 4 (PARTIE MILIEU DROITE DE L'EXPLOSION)
	this.getAnimations()["EXPLOMDJ3B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ3B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ3B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ3B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOMDJ3B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 48, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 1 (PARTIE EXTREMITE DROITE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEDJ0B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ0B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ0B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ0B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ0B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 2 (PARTIE EXTREMITE DROITE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEDJ1B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ1B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ1B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ1B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ1B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 3 (PARTIE EXTREMITE DROITE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEDJ2B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ2B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ2B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ2B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ2B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 4 (PARTIE EXTREMITE DROITE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEDJ3B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ3B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ3B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ3B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEDJ3B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 64, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 1 (PARTIE VERTICAL HAUTE  DE L'EXPLOSION)
	this.getAnimations()["EXPLOVHJ0B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ0B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ0B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ0B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ0B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 2 (PARTIE VERTICAL HAUTE  DE L'EXPLOSION)
	this.getAnimations()["EXPLOVHJ1B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ1B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ1B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ1B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ1B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 3 (PARTIE VERTICAL HAUTE  DE L'EXPLOSION)
	this.getAnimations()["EXPLOVHJ2B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ2B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ2B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ2B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ2B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 4 (PARTIE VERTICAL HAUTE  DE L'EXPLOSION)
	this.getAnimations()["EXPLOVHJ3B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ3B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ3B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ3B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVHJ3B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 80, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 1 (PARTIE EXTREMITE VERTICALE HAUTE  DE L'EXPLOSION)
	this.getAnimations()["EXPLOEVHJ0B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ0B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ0B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ0B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ0B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});

	// EXPLOSION LIEE AU JOUEUR 2 (PARTIE EXTREMITE VERTICALE HAUTE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEVHJ1B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ1B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ1B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ1B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ1B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 3 (PARTIE EXTREMITE VERTICALE HAUTE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEVHJ2B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ2B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ2B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ2B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ2B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 4 (PARTIE EXTREMITE VERTICALE HAUTE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEVHJ3B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ3B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ3B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ3B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVHJ3B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 96, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 1 (PARTIE VERTICAL BASSE  DE L'EXPLOSION)
	this.getAnimations()["EXPLOVBJ0B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ0B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ0B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ0B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ0B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});

	// EXPLOSION LIEE AU JOUEUR 2 (PARTIE VERTICAL BASSE DE L'EXPLOSION)
	this.getAnimations()["EXPLOVBJ1B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ1B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ1B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ1B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ1B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 3 (PARTIE VERTICAL BASSE DE L'EXPLOSION)
	this.getAnimations()["EXPLOVBJ2B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ2B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ2B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ2B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ2B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 4 (PARTIE VERTICAL BASSE DE L'EXPLOSION)
	this.getAnimations()["EXPLOVBJ3B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ3B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ3B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ3B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOVBJ3B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 112, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	
	// EXPLOSION LIEE AU JOUEUR 1 (PARTIE EXTREMITE VERTICALE BASSE  DE L'EXPLOSION)
	this.getAnimations()["EXPLOEVBJ0B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ0B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ0B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ0B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ0B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 2 (PARTIE EXTREMITE VERTICALE BASSE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEVBJ1B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ1B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ1B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ1B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ1B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 3 (PARTIE EXTREMITE VERTICALE BASSE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEVBJ2B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ2B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ2B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ2B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ2B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	// EXPLOSION LIEE AU JOUEUR 4 (PARTIE EXTREMITE VERTICALE BASSE DE L'EXPLOSION)
	this.getAnimations()["EXPLOEVBJ3B0"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ3B1"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ3B2"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ3B3"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	this.getAnimations()["EXPLOEVBJ3B4"] = new Animation({x : 0 , y : 0 , largeur : 16 , hauteur : 16, yClip : 128, delay : 100 , nbFrame : 5 , image : this.getImages().explosions, loop : true, xDepart : 0, show : false, ignore : false, duree : 500});
	
	
	
}

Game.prototype.getImages = function()
{
	return this._images;
}

Game.prototype.setImages = function(i)
{
	this._images = i;
}
Game.prototype.setPlateau = function(p)
{
	this._plateau = p;
}

Game.prototype.getNbCaseHauteur = function()
{
		return this._nbCaseHauteur;
}

Game.prototype.setNbCaseHauteur = function(h)
{
	this._nbCaseHauteur = h;
}

Game.prototype.getNbCaseLargeur = function()
{
	return this._nbCaseLargeur;
}

Game.prototype.setNbCaseLargeur = function(l)
{
	this._nbCaseLargeur = l;
}

Game.prototype.getAnimations = function() {
	return this._animations;
}

Game.prototype.setAnimations = function(a) 
{
	this._animations = a;
}

Game.prototype.getTailleCase = function()
{
	return this._tailleCase;
}

Game.prototype.setTailleCase = function(t)
{
	this._tailleCase = t;
}

Game.prototype.getLargeurGame = function()
{
	return this._largeurGame;
}

Game.prototype.setLargeurGame = function(l)
{
	this._largeurGame = l;
}

Game.prototype.getHauteurGame = function()
{
	return this._hauteurGame;
}

Game.prototype.setHauteurGame = function(h)
{
	this._hauteurGame = h;
}

Game.prototype.getJoueurs = function()
{
	return this._joueurs;
}

Game.prototype.setJoueurs = function(j)
{
	this._joueurs = j;
}

Game.prototype.toString = function()
{
	var plat = this.getPlateau();
	for(var i = 0 ; i < plat.length ; i++)
	{
		for(var j = 0 ; j < plat[i].length ; j++)
		{
			console.log("I : " + i + " J : " + j + " Type : " + plat[j][i].getType());
		}
	}
}

// Fonction qui permet de dessiner le décor + les animations , c'est ici que tout va se jouer
Game.prototype.Render = function(ctx)
{
	
	ctx.clearRect(0,0,this.getLargeurGame(), this.getHauteurGame()); // A chaque fois on réefface toute la grille
	ctx.beginPath();
	// D'abord la map
	for(var i = 0 ; i < this.getPlateau().length; i++)
	{
		for(var j = 0 ; j < this.getPlateau()[i].length ; j++)
		{
			if(this.getPlateau()[j][i].getType() == "MUR")
			{
				ctx.drawImage(this.getImages().sol,96,0,32,32,j *this.getTailleCase(), i * this.getTailleCase(), 32,32);
			}
			else if(this.getPlateau()[j][i].getType() == "VIDE")
			{
				ctx.drawImage(this.getImages().sol,32,0,32,32,j *this.getTailleCase(), i * this.getTailleCase(), 32,32);
			}
			
			ctx.stroke();
		}
	}
    var joueurs = this.getJoueurs();
	// Viendra ensuite les joueurs
    for(var i = 0 ; i < joueurs.length ; i++)
    {
        var x;
		var direction = joueurs[i].getDirection();
		switch(direction)
		{
			case 0: // DROITE
			x = 18*4;
			break;
			
			case 1: // BAS
			x = 18*1;
			break;
			
			case 2: // GAUCHE
			x = 18*10;
			break;
			
			case 3: // HAUT
			x = 18*7;
			break;
			
			default:
			x = 18*4;
			break;
		}
        if(!joueurs[i].isMoving() && !joueurs[i].isGameOver()) // Si le joueur n'est pas entrain de bouger alors je dessine l'image qui va bien. Sinon l'animation se dessine d'elle même (Pas besoin de else ici)
        {
            ctx.drawImage(this.getImages().deplacements,x,i*24,18,24,joueurs[i].getPoint().getX(), joueurs[i].getPoint().getY(),18,24);
			ctx.rect(joueurs[i].getPoint().getX(), joueurs[i].getPoint().getY(),18,24);
        }
		
		ctx.stroke();
    }
    
    // Puis les animations
    var anim = this.getAnimations();
	for(animation in anim)
	{
		anim[animation].draw(ctx);
	}
	ctx.closePath();
}
Game.prototype.getType = function(num)
{
	var type;
	switch(num)
	{
		case '0' :
		type = "VIDE";
		break;
		
		case '1': 
		type = "MUR";
		break;
		default:
		type = "VIDE";
		break;
	}
	return type;
}

Game.prototype.randomCase = function()
{
	var coord = {};
	var x = Math.floor(Math.random() * (this.getNbCaseLargeur() - 1)) ;
	var y = Math.floor(Math.random() * (this.getNbCaseHauteur() - 1)) ;
	
	if(this.getCase(x* this.getTailleCase() ,y * this.getTailleCase()).getType() != "MUR")
	{
		coord.x = x;
		coord.y = y;
	}
	else
	{
		coord = this.randomCase();
	}
	return coord;
}
// Fonction qui renvoie la première case ou se trouve le joueur
Game.prototype.getCase = function(x,y)
{
	var plateau = this.getPlateau();
	for(var i = 0 ; i < plateau.length ; i++)
	{
		for(var j = 0 ; j < plateau[i].length ; j++)
		{
			if((x >= (plateau[j][i].getPoint().getX() * this.getTailleCase()) && x <= (plateau[j][i].getPoint().getX() * this.getTailleCase()) + this.getTailleCase() ) &&  (y >= (plateau[j][i].getPoint().getY() * this.getTailleCase()) && y <= (plateau[j][i].getPoint().getY() * this.getTailleCase()) + this.getTailleCase()))
			{
				return plateau[j][i];
				break;
			}
		}
	}
	return 'undefined';
}

Game.prototype.drawExplosion = function(idJoueur,idBombe) // Active les animations d'explosions qui vont bien --> Retourne les coordonées de l'explosion
{
		// Animation horizontale de l'explosion
		var animations = this.getAnimations();
		var bombe = animations["BOMBEJ" + idJoueur + "B" + idBombe];
		var exploMJ = animations["EXPLOMJ" + idJoueur + "B" + idBombe];
		exploMJ.setX(bombe.getX());
		exploMJ.setY(bombe.getY());
		if(exploMJ.getY() >= 0 && exploMJ.getY() < this.getHauteurGame()) // Si l'explo est dans le plateau
		{
			exploMJ.Start();
		}
				
		var exploMGJ = animations["EXPLOMGJ" + idJoueur + "B" + idBombe];
		exploMGJ.setX(bombe.getX() + exploMGJ.getLargeur() - this.getTailleCase());
		exploMGJ.setY(bombe.getY());
		if(exploMGJ.getY() >= 0 && exploMGJ.getY() < this.getHauteurGame() && exploMGJ.getX() >= 0 && exploMGJ.getX() < this.getLargeurGame() && this.getCase(exploMGJ.getX(),exploMGJ.getY()).getType() != "MUR") // Si l'explo n'est pas dans un mur
		{
			exploMGJ.Start();
		}
				
		var exploEGJ = animations["EXPLOEGJ" + idJoueur + "B" + idBombe];
		exploEGJ.setX(bombe.getX() - this.getTailleCase());
		exploEGJ.setY(bombe.getY());
		if(exploEGJ.getY() >= 0 && exploEGJ.getY() < this.getHauteurGame() && exploEGJ.getX() >= 0 && exploEGJ.getX() < this.getLargeurGame() && this.getCase(exploMGJ.getX(),exploMGJ.getY()).getType() != "MUR" && this.getCase(exploEGJ.getX(), exploEGJ.getY()).getType() != "MUR") // Si l'explo n'est pas dans un mur 
		{
			exploEGJ.Start();
		}
				
		var exploMDJ = animations["EXPLOMDJ" + idJoueur + "B" + idBombe];
		exploMDJ.setX(bombe.getX() - exploMDJ.getLargeur() + this.getTailleCase());
		exploMDJ.setY(bombe.getY());
		
		// Sur cette condition faut que je teste les deux cases aussi car mon explosion est au milieu de la case 
		if(exploMDJ.getY() >= 0 && exploMDJ.getY() < this.getHauteurGame() && exploMDJ.getX() >= 0 && exploMDJ.getX() < this.getLargeurGame() && this.getCase(exploMDJ.getX(),exploMDJ.getY()).getType() != "MUR" && this.getCase(exploMDJ.getX() + exploMDJ.getLargeur(),exploMDJ.getY()).getType() != "MUR")
		{
			exploMDJ.Start();
		}
				
		var exploEDJ = animations["EXPLOEDJ" + idJoueur + "B" + idBombe];
		exploEDJ.setX(bombe.getX() + this.getTailleCase());
		exploEDJ.setY(bombe.getY());
		if(exploEDJ.getY() >= 0 && exploEDJ.getY() < this.getHauteurGame() && exploEDJ.getX() >= 0 && exploEDJ.getX() < this.getLargeurGame() && this.getCase(exploMDJ.getX(),exploMDJ.getY()) .getType() != "MUR" && this.getCase(exploEDJ.getX(), exploEDJ.getY()).getType() != "MUR" )
		{
			exploEDJ.Start();
		}
				
		// Animation verticale de l'explosion
		var exploVHJ = animations["EXPLOVHJ" + idJoueur + "B" + idBombe];
		exploVHJ.setX(bombe.getX());
		exploVHJ.setY(bombe.getY() + exploVHJ.getHauteur() - this.getTailleCase());
		if(exploVHJ.getY() >= 0 && exploVHJ.getY() < this.getHauteurGame() && exploVHJ.getX() >= 0 && exploVHJ.getX() < this.getLargeurGame() && this.getCase(exploVHJ.getX(),exploVHJ.getY()).getType() != "MUR" )
		{
			exploVHJ.Start();
		}
				
		var exploEVHJ = animations["EXPLOEVHJ" + idJoueur + "B" + idBombe];
		exploEVHJ.setX(bombe.getX());
		exploEVHJ.setY(bombe.getY() - this.getTailleCase());
		if(exploEVHJ.getY() >= 0 && exploEVHJ.getY() < this.getHauteurGame() && exploEVHJ.getX() >= 0 && exploEVHJ.getX() < this.getLargeurGame() &&  this.getCase(exploVHJ.getX(),exploVHJ.getY()).getType() != "MUR" && this.getCase(exploEVHJ.getX(), exploEVHJ.getY()).getType() != "MUR" )
		{
			exploEVHJ.Start();
		}
				
		var exploVBJ = animations["EXPLOVBJ" + idJoueur + "B" + idBombe];
		exploVBJ.setX(bombe.getX());
		exploVBJ.setY(bombe.getY() - exploVBJ.getHauteur() + this.getTailleCase());
		if(exploVBJ.getY() >= 0 && exploVBJ.getY() < this.getHauteurGame() && exploVBJ.getX() >= 0 && exploVBJ.getX() < this.getLargeurGame() && this.getCase(exploVBJ.getX(),exploVBJ.getY()).getType() != "MUR" && this.getCase(exploVBJ.getX(), exploVBJ.getY() + exploVBJ.getHauteur()).getType() != "MUR")
		{
			exploVBJ.Start();
		}
				
		var exploEVBJ = animations["EXPLOEVBJ" + idJoueur + "B" + idBombe];
		exploEVBJ.setX(bombe.getX());
		exploEVBJ.setY(bombe.getY() + this.getTailleCase());
		if(exploEVBJ.getY() >= 0 && exploEVBJ.getY() < this.getHauteurGame() && exploEVBJ.getX() >= 0 && exploEVBJ.getX() < this.getLargeurGame() && this.getCase(exploVBJ.getX(),exploVBJ.getY()).getType() != "MUR" && this.getCase(exploEVBJ.getX(), exploEVBJ.getY()).getType() != "MUR" )
		{
			exploEVBJ.Start();
		}
		
		return {xMilieu : exploMJ.getX(), yMilieu : exploMJ.getY(),xGauche : exploEGJ.getX() , yGauche :  exploEGJ.getY(), xDroite :  exploEDJ.getX() , yDroite : exploEDJ.getY() , xHaut : exploEVHJ.getX() , yHaut : exploEVHJ.getY() , xBas : exploEVBJ.getX(), yBas :  exploEVBJ.getY() , largeur : 16 , hauteur : 16};
}

Game.prototype.generateBonus = function()
{
	var number = Math.floor(Math.random() * 14) + 1;
	var bonus ;
	switch(number)
	{
		case 1:
		bonus = "BOMBEUP";
		break;
		
		case 2:
		bonus = "SPEEDUP";
		break;
		
		case 3:
		bonus = "ENABLEMOVINGBOMB";
		break;
		
		case 4:
		bonus = "ENABLEBOXINGBOMB";
		break;
		
		case 5:
		bonus = "EXPLODEUP";
		break;
		
		case 6:
		bonus = "DAMAGEUP";
		break;
		
		case 7:
		bonus = "MAXIMUMEXPLODE";
		break;
		
		case 8:
		bonus = "BOMBEDOWN";
		break;
		
		case 9:
		bonus = "SPEEDDOWN";
		break;
		
		case 10:
		bonus = "DISABLEMOVINGBOMB";
		break;
		
		case 11:
		bonus = "DISABLEBOXINGBOMB";
		break;
		
		case 12:
		bonus = "EXPLODEDOWN";
		break;
		
		case 13:
		bonus = "DAMAGEDOWN";
		break;
		
		case 14:
		bonus = "MINIMUMEXPLODE";
		break;
		
		default:
		bonus = "NONE";
		break;
	}
	return bonus;
}
