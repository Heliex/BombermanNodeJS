/** 
		Objet Joueur - Crée par : HELIEX
		Date de création : 02/08/2016
		Date dernière modification : 09/08/2016
**/

/** Constructeur de Joueur
	  Prend en paramètre le point et le numéro du joueur et sa direction de base :
	  
		- p : Le point ou se situe le joueur
		- numJoueur : le numéro du joueur
		- direction : La direction dans laquelle le joueur est initlialisé ( 0 = DROITE ; 1 = BAS ; 2 = GAUCHE ; 3 = HAUT)
        
      Attribut : 
        - isMoving : Permet de savoir si le joueur se déplace -> Par défaut a false
**/
var Joueur = function(p,numJoueur,direction)
{
	this._point = p;
	this._num = numJoueur;
    this._isMoving = false;
	this._direction = direction || 0 ;
	this._nbBombeRestante = 1;
	this._maxBombe = 5;
    this._nbBombeOnBoard = 0;
	this._isInExplosion = false;
	this._pv = 3;
	this._isGameOver = false;
	this._timerDamage = Date.now();
	this._delayBetweenDamage = 500;
	this._vitesseDepla = 3;
	this._vitesseMax = 16;
}

Joueur.prototype.getVitesseDepla = function()
{
	return this._vitesseDepla;
}

Joueur.prototype.setVitesseDepla = function(v)
{
	this._vitesseDepla = v;
}

Joueur.prototype.getVitesseMax = function()
{
	return this._vitesseMax;
}

Joueur.prototype.setVitesseMax = function(v)
{
	this._vitesseMax = v;
}
Joueur.prototype.getDelayBetweenDamage = function()
{
	return this._delayBetweenDamage;
}

Joueur.prototype.setDelayBetweenDamage = function(d)
{
	this._delayBetweenDamage = d;
}

Joueur.prototype.getTimerDamage = function()
{
	return this._timerDamage;
}

Joueur.prototype.setTimerDamage = function(t)
{
	this._timerDamage = t;
}

Joueur.prototype.isGameOver = function()
{
	return this._isGameOver;
}

Joueur.prototype.setGameOver = function(g)
{
	this._isGameOver = g;
}
Joueur.prototype.getPv = function()
{
	return this._pv;
}

Joueur.prototype.setPv = function(p)
{
	this._pv = p;
}
Joueur.prototype.isInExplosion = function()
{
	return this.isInExplosion;
}

Joueur.prototype.setInExplosion = function(e)
{
	this._isInExplosion = e;
}
Joueur.prototype.getNbBombeOnBoard = function()
{
    return this._nbBombeOnBoard;
}

Joueur.prototype.setNbBombeOnBoard = function(n)
{
    this._nbBombeOnBoard = n;
}

Joueur.prototype.getMaxBombe = function()
{
	return this._maxBombe;
}

Joueur.prototype.setMaxBombe = function(mb)
{
	this._maxBombe = mb;
}

Joueur.prototype.getNbBombeRestante = function()
{
	return this._nbBombeRestante;
}

Joueur.prototype.setNbBombeRestante = function(n)
{
	this._nbBombeRestante = n;
}
Joueur.prototype.removeBombeRestante = function()
{
	if(this.getNbBombeRestante() >= 1 )
	{
		this._nbBombeRestante--;
        this._nbBombeOnBoard++;
	}
}

Joueur.prototype.addBombeRestante = function()
{

	if(this.getNbBombeRestante() < this.getMaxBombe())
	{
			this._nbBombeRestante++;
			this._nbBombeOnBoard--;
	}
}
Joueur.prototype.getDirection = function()
{
	return this._direction;
}

Joueur.prototype.setDirection = function(d)
{
	this._direction = d;
}

Joueur.prototype.getPoint = function()
{
	return this._point;
}

Joueur.prototype.setPoint = function(p)
{
	this._point = p;
}

Joueur.prototype.getNum = function()
{
	return this._num;
}

Joueur.prototype.setNum = function(n)
{
	this._num = n;
}

Joueur.prototype.toString = function()
{
	console.log("Numéro du joueur : " + this.getNum() + " " + this.getPoint().toString());
}

Joueur.prototype.isMoving = function()
{
    return this._isMoving;
}

Joueur.prototype.setMove = function(m)
{
    this._isMoving = m;
}