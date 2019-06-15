
var scene = new THREE.Scene();
var clock = new THREE.Clock();
var loader = new THREE.TextureLoader();

var camera, renderer, flyControls, ambientLight, pointLight;
var geometrySphere, geometryRing, geometryBox, planet, ring, token, meteor;
var mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;
var mouse = new THREE.Vector2();

var starGroup = new THREE.Group();
var starLightGroup = new THREE.Group();
var star;

//  name, obj, scale, padding, image
// .65 .75 .8 .7 1 .95 .9 .85
var planetGroup = [
	mercury = new PlainPlanet( 'Mercury', null, 0.75, 0.3, 'images/mercurymap.jpg' ), 
	venus = new PlainPlanet( 'Venus', null, 0.75, 0.3, 'images/venusmap.jpg' ), 
	earth = new TokenPlanet( 'Earth', null, 0.75, 0.3, 'images/earthmap.jpg', 'images/earthtoken.png', null ), 
	mars = new TokenPlanet( 'Mars', null, 0.75, 0.3, 'images/marsmap.jpg', 'images/marstoken.png', null ), 
	jupiter = new PlainPlanet( 'Jupiter', null, 0.75, 0.3, 'images/jupitermap.jpg' ),
	saturn = new RingTokenPlanet( 'Saturn', null, 0.75, 0.3, 'images/saturnmap.jpg', 'images/saturnring.jpg', null, 'images/saturntoken.png', null ), 
	uranus = new PlainPlanet( 'Uranus', null, 0.75, 0.3, 'images/uranusmap.jpg' ),
	neptune = new PlainPlanet( 'Neptune', null, 0.75, 0.3, 'images/neptunemap.jpg' )
], planetNum = planetGroup.length;

var keyboard = {};
var raycaster = new THREE.Raycaster(),INTERSECTED;

var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

var VIEW_ANGLE = 70,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 100;
	
var	CONTROLSPEED = 0.05,
	SPINSPEED = 0.01;


function init() {	

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
		camera.name = 'ShipPOV';
		camera.lookAt(scene.position);

	renderer = new THREE.WebGLRenderer();
		renderer.setSize( WIDTH, HEIGHT );
		document.body.appendChild( renderer.domElement );

    flyControls = new THREE.FlyControls(camera);
    	flyControls.name = "FlyControls"
        flyControls.movementSpeed = 5;
        flyControls.rollSpeed = Math.PI / 40;
        flyControls.autoForward = false;
        flyControls.dragToLook = true;

	ambientLight = new THREE.AmbientLight( 0x404040 , 0.1 );
		ambientLight.name = 'AmbientLight';
		ambientLight.position = camera.position;
		scene.add( ambientLight );

	pointLight = new THREE.PointLight( 0xCCCCCC, 1.5, 15.0 );
		pointLight.name = 'PointLight';
		pointLight.position = camera.position;
		pointLight.castShadow = true;
		scene.add( pointLight );

	setScene();

	// Function called when download progresses
	var onProgress = function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); };

	// Function called when download errors
	var onError = function (error) { console.log('An error happened' + error); };

	animate();
}



function generateRandomNumber( max, min ) {
    highlightedNumber = Math.random() * ( max - min ) + min;
    return highlightedNumber;
};

function pickOne( max, min ) {
    highlightedNumber = Math.floor( Math.random() * 2 ) + 1;
    if ( highlightedNumber == 2 ) { return max; }
    return min;
};


/* SET UP SCENE */
function setScene() {
	// Set background image
	loader.load( 'images/sky.jpg' , function(texture) { scene.background = texture; });

	// Create shapes for planets, rings and tokens
	geometrySphere = new THREE.SphereGeometry( 1, 50, 50 );
	var geometrySphereLittle = new THREE.SphereGeometry( 0.01, 5, 5 );
	geometryBox = new THREE.BoxGeometry( 0.25, 0.25, 0.05 );

	var currpos = 1.0;
	var currposY = 0.25;
	var texture, material;
	var distanceX = 11;
	var distanceY = 5;
	var distanceZ = -10;
	// var bmap = THREE.ImageUtils.loadTexture('./images/texture.jpg');

	material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	for ( i = 0; i < 15; i++ ) {
		// Both positive
		star = new THREE.Mesh( geometrySphereLittle, material );
			star.name = "Star";
	        star.position.x = generateRandomNumber( 0, 1.1 ) * distanceX;
	        star.position.y = generateRandomNumber( 0, 1.1 ) * distanceY;
	        star.position.z = generateRandomNumber( 0, 1.3 ) * distanceZ;
	        star.emissive = 0xffffff;
			starGroup.add(star);
		distanceX = distanceX * -1;
		distanceY = distanceY * -1;

		// Both negative
		star = new THREE.Mesh( geometrySphereLittle, material );
			star.name = "Star";
	        star.position.x = generateRandomNumber( 0, 1.1 ) * distanceX;
	        star.position.y = generateRandomNumber( 0, 1.1 ) * distanceY;
	        star.position.z = generateRandomNumber( 0, 1.3 ) * distanceZ;
	        star.emissive = 0xffffff;
	        starGroup.add(star);
	    distanceY = distanceY * -1;

	    // Only x negative
	    star = new THREE.Mesh( geometrySphereLittle, material );
			star.name = "Star";
	        star.position.x = generateRandomNumber( 0, 1.1 ) * distanceX;
	        star.position.y = generateRandomNumber( 0, 1.1 ) * distanceY;
	        star.position.z = generateRandomNumber( 0, 1.3 ) * distanceZ;
	        star.emissive = 0xffffff;
	        starGroup.add(star);
	    distanceX = distanceX * -1;
		distanceY = distanceY * -1;

		// Only y  negative
	    star = new THREE.Mesh( geometrySphereLittle, material );
			star.name = "Star";
	        star.position.x = generateRandomNumber( 0, 1.1 ) * distanceX;
	        star.position.y = generateRandomNumber( 0, 1.1 ) * distanceY;
	        star.position.z = generateRandomNumber( 0, 1.3 ) * distanceZ;
	        star.emissive = 0xffffff;
	        starGroup.add(star);
		distanceY = distanceY * -1;

	}
	scene.add(starGroup);

	var vFOV = THREE.Math.degToRad( camera.fov ); // convert vertical fov to radians
	var height = 2 * Math.tan( vFOV / 2 ) * 5; // visible height
	var width = height * camera.aspect;           // visible width
	var currplanet;
	
	texture = loader.load( 'images/meteor.jpg' );
	material = new THREE.MeshPhongMaterial( { map: texture } );
	geometrySphereLittle = new THREE.SphereGeometry( 0.1, 50, 50 );
	meteor = new THREE.Mesh( geometrySphereLittle, material );
		meteor.name = "Meteor";
		meteor.position.x = -width;
	    meteor.position.z = -height;
	    meteor.emissive = 0xffffff;
	scene.add(meteor);

	for (i = 0; i < planetNum; i++) {
		// Save current planet object to temporary value
		currplanet = planetGroup[i];

		// Create planet
		texture = loader.load( currplanet.pic );
		material = new THREE.MeshPhongMaterial( { map: texture } );
			// material.bumpMap = THREE.ImageUtils.loadTexture();

		geometrySphere = new THREE.SphereGeometry( currplanet.scale, 50, 50 );

		planet = new THREE.Mesh( geometrySphere, material );
			planet.name = currplanet.name;
			planet.position.x = 10 * Math.sin( currpos*Math.PI/4  );
			planet.position.z = -10 * Math.cos( currpos*Math.PI/4  );
			// planet.position.y = planet.position.y + 1 * currposY;
			scene.add( planet );

		geometrySphere = new THREE.SphereGeometry( currplanet.scale+0.02, 50, 50 );
		var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, side: THREE.BackSide } );
		var outlineMesh1 = new THREE.Mesh( geometrySphere, outlineMaterial1 );
			outlineMesh1.name = "Outline";
			outlineMesh1.position.x = planet.position.x;
			outlineMesh1.position.y = planet.position.y;
			outlineMesh1.position.z = planet.position.z;
			outlineMesh1.visible = false;
			scene.add( outlineMesh1 );

		currplanet.planetOBJ = planet;
		currplanet.planetOutline = outlineMesh1;
		currpos += 1;
		currposY = pickOne( -1.0, 1.0 );

		if ( i == Math.floor( planetNum / 2 ) ) {
			pointLight.target = planet;
		}

		// Create ring for corresponding planets
		if ( currplanet.type == 'RingPlanet' || currplanet.type == 'RingTokenPlanet') {
			geometryRing = new THREE.RingGeometry( (currplanet.scale+0.5), (currplanet.scale+0.75), 50 );
			texture = loader.load( currplanet.ring );
			material = new THREE.MeshPhongMaterial( { map: texture } );
			ring = new THREE.Mesh( geometryRing, material );
				ring.name = "Ring";
				ring.rotation.x = Math.PI / -2.35;
				ring.position.x = planet.position.x;
				ring.position.z = planet.position.z;
				// ring.position.y += planet.position.y;
				scene.add( ring );
		}

		// Create token for corresponding planets
		if ( currplanet.type == 'TokenPlanet' || currplanet.type == 'RingTokenPlanet' ) {
			geometryBox = new THREE.BoxGeometry( (currplanet.scale/2), (currplanet.scale/2),  (currplanet.scale/2));
			texture = loader.load( currplanet.token );
	  		material = new THREE.MeshPhongMaterial( { map: texture } );

  			token = new THREE.Mesh( geometryBox, material );
	  			token.name = "Token";
	  			token.position.y += (currplanet.scale*1.5) + planet.position.y;
				token.position.x = planet.position.x;
				token.position.z = planet.position.z;
				token.visible = false;
	  			scene.add( token );
	  		currplanet.tokenOBJ = token;
		}
	}
}


/* PLANET FUNCTIONALITY */
// Find plant in planetGroup
function findPlanet( name ) {
	for (var i = 0; i < planetNum; i++) { 
		if ( name == planetGroup[i].name ) { return planetGroup[i]; }
	}
	return null;
}

// Rotate planet, ring and token if applicable
function rotatePlanet( obj, currplanet ) {
    obj.rotation.y -= SPINSPEED;
    currplanet.planetOutline.visible = true;
    if ( currplanet.ringOBJ != null ) { currplanet.ringOBJ.rotation.z -= SPINSPEED; }
    if ( currplanet.type == 'TokenPlanet' || currplanet.type == 'RingTokenPlanet' ) {
    	currplanet.tokenOBJ.visible = true;
    	currplanet.tokenOBJ.rotation.y -= SPINSPEED;
    }
    if ( currplanet.type == 'RingPlanet' || currplanet.type == 'RingTokenPlanet' ) {
    	console.log("HERE");
    	// currplanet.ringOutline.visible = true;
    }
}

// Set all token objects to hidden
function setTokensFalse() {
	for (var i = 0; i < planetNum; i++) {
		var currplanet = planetGroup[i];
		if ( currplanet.type == 'TokenPlanet' || currplanet.type == 'RingTokenPlanet' ) {
			if ( currplanet.tokenOBJ != null ) { currplanet.tokenOBJ.visible = false; }
		}
	}
}


// Set all outline objects to hidden
function setOutlineFalse() {
	for (var i = 0; i < planetNum; i++) {
		var currplanet = planetGroup[i];
		currplanet.planetOutline.visible = false;

		// if ( currplanet.type == 'TokenPlanet' || currplanet.type == 'RingTokenPlanet' ) {
		// 	if ( currplanet.tokenOBJ != null ) { currplanet.tokenOBJ.visible = false; }
		// }
	}
}


/* ANIMATE */
function animate() {
	requestAnimationFrame( animate );
	render();
}


/* RENDER */
function render() {
	// Check if object in scene is interested 
 	raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    setTokensFalse();
    setOutlineFalse();
  	if ( intersects.length > 0 ) { 
  		var object = intersects[0].object;
  		if ( object.name != 'Ring' && object.name != 'Token' && object.name != 'Meteor' && object.name != 'Outline' ) {
  			var currplanet = findPlanet( object.name );
  			if ( currplanet.type == 'TokenPlanet' || currplanet.type == 'RingTokenPlanet' ) {
  				// add highlight for shapes
  				if ( currplanet != null ) { rotatePlanet( object , currplanet ); }
  			}
  		}
  	}

  	// Change meteor position
  // 	if ( meteor.position.z > camera.fov ) { 
  // 		scene.remove(meteor); 
  // 	} else {
  // 		meteor.position.x += 0.01;
		// meteor.position.z = meteor.position.z + 0.005;
  // 	}

  	// Update controls
    var delta = clock.getDelta();
    flyControls.update( delta );

  	// Render scene and camera	
    // console.log(scene);
    // console.log(camera);
	renderer.render( scene, camera );
}


/* EVENT LISTENERS -- Check bellow for event listener functions */
document.addEventListener('mousemove', onMouseMove, false); // 
window.addEventListener( 'resize', onWindowResize, false ); // 


// add even listenter and connect to function


/* EVENT LISTENER FUNCTIONS -- Check above for event listener order */
// Determine location of mouse for raycaster object intersection
function onMouseMove( event ) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

// Resize window and update global values
function onWindowResize() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	ASPECT = WIDTH / HEIGHT;
    camera.aspect = ASPECT;
    camera.updateProjectionMatrix();
    renderer.setSize( WIDTH, HEIGHT );
}


