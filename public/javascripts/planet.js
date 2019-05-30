
function Planet( name, planetOBJ, picture ) {
	this.name = name;
  	this.planetOBJ = planetOBJ;
  	this.pic = picture;
}

function RingTokenPlanet( name, planetOBJ, picture, ring, ringOBJ, token, tokenOBJ ) { 
   	Planet.call( this, name, planetOBJ, picture );
   	this.type = 'RingTokenPlanet';
  	this.ring = ring;
  	this.ringOBJ = ringOBJ;
  	this.token = token;
  	this.tokenOBJ = tokenOBJ;
}

function RingPlanet( name, planetOBJ, picture, ring, ringOBJ ) { 
	Planet.call( this, name, planetOBJ, picture );
   	this.type = 'RingPlanet';
  	this.ring = ring;
  	this.ringOBJ = ringOBJ;
}

function TokenPlanet( name, planetOBJ, picture, token, tokenOBJ ) { 
	Planet.call( this, name, planetOBJ, picture );
   	this.type = 'TokenPlanet';
  	this.token = token;
  	this.tokenOBJ = tokenOBJ;
}

function PlainPlanet( name, planetOBJ, picture ) { 
	Planet.call( this, name, planetOBJ, picture );
   	this.type = 'PlainPlanet';
}