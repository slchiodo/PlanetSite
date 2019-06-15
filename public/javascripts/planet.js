
function Planet( name, planetOBJ, scale, padding, picture ) {
	this.name = name;
  this.planetOBJ = planetOBJ;
  this.planetOutline;
  this.scale = scale;
  this.padding = padding;
  this.pic = picture;
}

function RingTokenPlanet( name, planetOBJ, scale, padding, picture, ring, ringOBJ, token, tokenOBJ ) { 
  Planet.call( this, name, planetOBJ, scale, padding, picture );
  this.type = 'RingTokenPlanet';
  this.ring = ring;
  this.ringOBJ = ringOBJ;
	this.token = token;
  this.tokenOBJ = tokenOBJ;
}

function RingPlanet( name, planetOBJ, scale, padding, picture, ring, ringOBJ ) { 
	Planet.call( this, name, planetOBJ, scale, padding, picture );
  this.type = 'RingPlanet';
  this.ring = ring;
  this.ringOBJ = ringOBJ;
  this.ringOutline;
}

function TokenPlanet( name, planetOBJ, scale, padding, picture, token, tokenOBJ ) { 
	Planet.call( this, name, planetOBJ, scale, padding, picture );
  this.type = 'TokenPlanet';
	this.token = token;
  this.tokenOBJ = tokenOBJ;
}

function PlainPlanet( name, planetOBJ, scale, padding, picture ) { 
	Planet.call( this, name, planetOBJ, scale, padding, picture );
 	this.type = 'PlainPlanet';
}


