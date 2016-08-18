/** 
		Objet Point - Cr�e par : HELIEX
		Date de cr�ation : 02/08/2016
		Date derni�re modification : 02/08/2016
**/

/** Constructeur de Point
	  Prend en param�tre x et y :
	  
		- x : l'asbcisse du point 
		- y : l'ordonn�e du point
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