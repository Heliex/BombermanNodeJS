/** 
		Objet Case - Cr�e par : HELIEX
		Date de cr�ation : 02/08/2016
		Date derni�re modification : 02/08/2016
**/

/** Constructeur de Case
	  Prend en param�tre un object options (N pour optionnel, O pour obligatoire) :
	  
		- point : Le point d'ou part la case -> O
		- cote : le c�t� d'une case (sachant que c'est que des carr� du coup) -> O
		- type : le type de la case (qui sera utile � l'objet game) -> N
**/
var Case = function(options)
{
	this._point = options.point;
	this._cote = options.cote;
	this._type = options.type || "VIDE";
}

// Fonction qui retourne le point associ� � la case
Case.prototype.getPoint = function()
{
	return this._point;
}

// Fonction qui modifie le point associ� � la case
Case.prototype.setPoint = function(p)
{
	this._point = p;
}

// Fonction qui renvoie la taille d'un cote d'une case
Case.prototype.getCote = function()
{
	return this._cote;
}

// Fonction qui modifie la taille d'un cote d'une case
Case.prototype.setCote = function(c)
{
	this._cote = c;
}

// Fonction qui retourne le type de la case
Case.prototype.getType = function()
{
	return this._type;
}

// Fonction qui modifie le type de la case
Case.prototype.setType = function(t)
{
	this._type = t;
}