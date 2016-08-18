/** 
		Objet Point - Crée par : HELIEX
		Date de création : 02/08/2016
		Date dernière modification : 02/08/2016
**/

/** Constructeur de Point
	  Prend en paramètre x et y :
	  
		- x : l'asbcisse du point 
		- y : l'ordonnée du point
**/
var Point = function(x,y)
{
	this._x = x;
	this._y = y;
}

Point.prototype.getX = function()
{
	return this._x;
}

Point.prototype.setX = function(x)
{
	this._x = x;
}

Point.prototype.getY = function()
{
	return this._y;
}

Point.prototype.setY = function(y)
{
	this._y = y;
}

Point.prototype.toString = function()
{
	"X : " + this.getX() + " Y : " + this.getY() ;
}