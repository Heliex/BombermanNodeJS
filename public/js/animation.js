/** 
		Objet Animation - Crée par : HELIEX
		Date de création : 02/08/2016
		Date dernière modification : 04/08/2016
**/


/** Constructeur d'animation 
	  Prend en paramètre un object options (N pour optionnel, O pour obligatoire) :
	  
		- x : l'asbcisse ou dessiner l'animation -> O
		- y : l'ordonnée ou dessiner l'animation ->  O
		- largeur : largeur de la frame de l'animation  -> O
		- hauteur : hauteur de la frame de l'animation -> O
		- xDepart : l'abscisse du départ de la frame sur le gros sprites -> N
		- yClip : l'ordonnée sur laquelle se situe la frame sur le gros sprite -> N
		- delay : Le temps qui s'écoule entre 2 frame -> O
		- nbFrame : le nombre de frame qui constitue l'animation -> O
		- image : l'image de référence -> O
		- loop : Indique si on boucle sur l'animation ou si elle se fait qu'une fois -> N
		- frameIndex : Index sur lequel on se situe -> N
		- ignoreDuree : Indique si l'animation ne tient pas compte de la durée passé en paramètre -> N
		- duree : Durée de l'animation totale -> N
		- show : Indique s'il on dessine l'animation immédiatement ou non -> N
        - offset : Permet de décaler l'affichage horizontalement (Notammenet sur les trucs qui font pas 32 de large)
		
	  Attribut du constructeur :
		- timer : Permet d'établir des calculs pour les animations (notamment le changement de frame)
		- timerAtStart : Permet de calculer lorsque l'on tient compte de la durée totale de l'animation le temps écoulé

**/
var Animation = function(options) {

	this._x = options.x;
	this._y = options.y;
	this._largeur = options.largeur;
	this._hauteur = options.hauteur;
	this._xDepart = options.xDepart || 0;
	this._yClip = options.yClip || 0 ;
	this._delay = options.delay;
	this._nbFrame = options.nbFrame;
	this._image = options.image;
	this._loop = options.loop || false ;
	this._frameIndex = options.frameIndex || 0;
	this._timer = Date.now();
	this._timerAtStart = Date.now();
	this._ignoreDuree = options.ignore || false;
	this._duree = options.duree || 0 ;
	this._show = options.show || false;
    this._offset = options.offset ||0;
	this._ended = false;

};

Animation.prototype.isEnded = function()
{
	return this._ended;
}

Animation.prototype.setEnd = function(e)
{
	this._ended = e;
}
Animation.prototype.getOffset = function()
{
    return this._offset;
}

Animation.prototype.setOffset = function(o)
{
    this._offset = o;
}
// Fonction qui renvoie la propriété IgnoreDuree -> Permet de savoir si on ignore la durée totale de l'animation ou non
Animation.prototype.isIgnoringDuree = function()
{
	return this._ignoreDuree;
}

// Fonction qui permet de set la propriété ignoreDuree
Animation.prototype.setIgnore = function(i)
{
	this._ignoreDuree = i;
}

// Fonction qui récupère le timer au lancement de l'animation
Animation.prototype.getTimerAtStart = function()
{
	return this._timerAtStart;
}

// Fonction qui permet de modifier le timer au lancement de l'animation
Animation.prototype.setTimerAtStart = function(t)
{
	this._timerAtStart = t;
}

// Fonction qui retourne si l'animation doit se dessiner ou non
Animation.prototype.isShowing = function()
{
	return this._show;
}

// Fonction qui démarre l'animation
Animation.prototype.Start = function()
{
	this._show = true;
	if(!this.isIgnoringDuree) // S'il on ignore pas la durée dans ce cas faut repartir de 0 (C'est une animation qui est ponctuelle)
	{
		this.setEnd(false);
		this.setFrameIndex(0);
	}
	this.setTimerAtStart(Date.now());
}

// Fonction qui permet de stopper l'animation
Animation.prototype.Stop = function()
{
	this._show = false;
}

// Fonction qui permet de récupérer la durée de l'animation
Animation.prototype.getDuree = function()
{
	return this._duree;
}

// Fonction qui permet de modifier la durée de l'animation
Animation.prototype.setDuree = function(d)
{
	this._duree = d;
}

// Fonction qui permet de récuperé l'abscisse de l'animation
Animation.prototype.getX = function()
{
	return this._x;
}

// Fonction qui permet de modifier l'abscisse de l'animation
Animation.prototype.setX = function(x)
{
	this._x = x;
}

// Fonction qui permet de récuperé l'ordonnée de l'animation
Animation.prototype.getY = function()
{
	return this._y;
}

// Fonction qui permet de modifier l'ordonnée de l'animation
Animation.prototype.setY = function(y)
{
	this._y = y;
}

/** 
	Méthode qui permet de dessiner l'animation, c'est cette méthode qui est puissante
**/
Animation.prototype.draw = function (ctx)
{
	if(this.isShowing()) // Si le dessin est activé
	{
		if(!this.isIgnoringDuree()) // Si on ignore pas la durée alors on va calculer pour stopper l'animation si le timer dépasse la durée
		{
			if(Date.now() - this.getTimerAtStart() > this.getDuree()) // Si ça dépasse
			{
				this.Stop(); // On stoppe l'animation
				this.setEnd(true);
			}
			else
			{
				ctx.beginPath();
				if(Date.now() - this.getTimer() > this.getDelay() && this.getFrameIndex() < (this.getNbFrame() - 1)) // Si le timer est dépassé et que je dépasse pas la frame alors je passe à la frame suivante
				{
					this.setTimer(Date.now());
					this.setFrameIndex(this.getFrameIndex() + 1);
				}
				else if(Date.now() - this.getTimer() > this.getDelay() &&  this.getFrameIndex() == (this.getNbFrame() - 1) && this.isLooping()) // Sur la dernière frame je repars à 0
				{
					this.setFrameIndex(0);
				}
				ctx.drawImage(this._image,this.getFrameIndex() * this.getLargeur() + this.getXDepart() , this.getYClip(),this.getLargeur(), this.getHauteur(),this.getX() + this.getOffset(),this.getY(), this.getLargeur(), this.getHauteur());
				ctx.closePath();
			}
		}
		else
		{
			ctx.beginPath();
			if(Date.now() - this.getTimer() > this.getDelay() && this.getFrameIndex() < (this.getNbFrame() - 1)) // Si le timer est dépassé et que je dépasse pas la frame alors je passe à la frame suivante
			{
				this.setTimer(Date.now());
				this.setFrameIndex(this.getFrameIndex() + 1);
			}
			else if(Date.now() - this.getTimer() > this.getDelay() &&  this.getFrameIndex() == (this.getNbFrame() - 1) && this.isLooping()) // Sur la dernière frame je repars à 0
			{
				this.setFrameIndex(0);
			}
			ctx.drawImage(this._image,this.getFrameIndex() * this.getLargeur() + this.getXDepart() , this.getYClip(),this.getLargeur(), this.getHauteur(),this.getX() + this.getOffset() ,this.getY(), this.getLargeur(), this.getHauteur());
			ctx.closePath();
		}
	}
	
}

// Fonction qui retourne la largeur de l'animation
Animation.prototype.getLargeur = function() 
{
	return this._largeur;
}

// Fonction qui modifie la largeur de l'animation
Animation.prototype.setLargeur = function(l)
{
	this._largeur = l;
}

// Fonction qui retourne la hauteur de l'animation
Animation.prototype.getHauteur = function()
{
	return this._hauteur;
}

// Fonction qui modifie la hauteur de l'animation
Animation.prototype.setHauteur = function(h)
{
	this._hauteur = h;
}

// Fonction qui retourne le X d'ou on doit partir dans le sprite
Animation.prototype.getXDepart = function()
{
	return this._xDepart;
}

// Fonction qui modifie le X d'ou on part dans le sprite
Animation.prototype.setXDepart = function(x)
{
	this._xDepart = x;
}

// Fonction qui retourne le Y d'ou on part dans le sprite
Animation.prototype.getYClip = function()
{
	return this._yClip;
}

// Fonction qui modifie le Y d'ou on part dans le sprite
Animation.prototype.setYClip = function(y)
{
	this._yClip = y;
}

// Fonction qui récupère le temps entre deux frame
Animation.prototype.getDelay = function()
{
	return this._delay;
}

// Fonction qui modifie le temps entre 2 frame
Animation.prototype.setDelay = function(d)
{
	this._delay = d;
}

// Fonction qui recupère le nombre de frame de l'animation
Animation.prototype.getNbFrame = function()
{
	return this._nbFrame;
}

// Fonction qui modifie le nombre de frame de l'animation
Animation.prototype.setNbFrame = function(n)
{
	this._nbFrame = n;
}

// Fonction qui récupère l'image associée à l'animation
Animation.prototype.getImage = function()
{
	return this._image;
}

// Fonction qui modifie l'image associée à l'animation
Animation.prototype.setImage = function(i)
{
	this._image = i;
}

// Fonction qui renseigne si l'animation loop
Animation.prototype.isLooping = function()
{
	return this._loop;
}

// Fonction qui permet de faire (ou non ) loop l'animation
Animation.prototype.setLooping = function(l)
{
	this._loop = l
}

// Fonction qui retourne l'index courant de la frame de l'animation
Animation.prototype.getFrameIndex = function()
{
	return this._frameIndex;
}

// Fonction qui modifie l'index courant de la frame de l'animation
Animation.prototype.setFrameIndex = function(i)
{
	this._frameIndex = i;
}

// Fonction qui récupère le timer a la CREATION de l'animation
Animation.prototype.getTimer = function()
{
	return this._timer;
}

// Fonction qui modifie le timer de la creation de l'animation
Animation.prototype.setTimer = function(t)
{
	this._timer = t;
}