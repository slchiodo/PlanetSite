
var scene, camera, renderer, loader, clock, flyControls;
var geometrySphere, geometryRing, geometryBox, planet, ring, token, textureLoader;
var mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;
var mouse = new THREE.Vector2();

var planetGroup = [
	mercury = new PlainPlanet('Mercury', null, 'images/mercurymap.jpg' ), 
	venus = new PlainPlanet('Venus', null, 'images/venusmap.jpg' ), 
	earth = new TokenPlanet('Earth', null, 'images/earthmap.jpg', 'images/earthtoken.png', null ), 
	mars = new TokenPlanet('Mars', null, 'images/marsmap.jpg', 'images/marstoken.png', null ), 
	jupiter = new PlainPlanet('Jupiter', null, 'images/jupitermap.jpg' ),
	saturn = new RingTokenPlanet('Saturn', null, 'images/saturnmap.jpg', 'images/saturnring.jpg', null, 'images/saturntoken.png', null ), 
	uranus = new PlainPlanet('Uranus', null, 'images/uranusmap.jpg' ),   //'images/uranusring.jpg', null
	neptune = new PlainPlanet('Neptune', null, 'images/neptunemap.jpg' )
], planetNum = planetGroup.length;

var keyboard = {};
var raycaster = new THREE.Raycaster(),INTERSECTED;

var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight,
	ASPECT = WIDTH / HEIGHT,
	CONTROLSPEED = 0.05,
	SPINSPEED = 0.01;

function init() {
	var light;

	scene = new THREE.Scene();
	clock = new THREE.Clock();
	loader = new THREE.TextureLoader();
	textureLoader = new THREE.TextureLoader();

	camera = new THREE.PerspectiveCamera( 75, ASPECT, 0.1, 1000 );
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

	light = new THREE.AmbientLight( 0xFFFFFF, 0.3 );
		light.name = 'AmbientLight';
		light.position.set(camera.position);
		scene.add(light);

	light = new THREE.DirectionalLight( 0xFFFDF1, 0.7 ); // warm yellow light
		light.name = 'DirectionalLight';
    	light.position = camera.position;
    	scene.add(light);

	setScene();

	// Move camera back to see scene
	console.log(camera.position);

	// Function called when download progresses
	var onProgress = function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); };

	// Function called when download errors
	var onError = function (error) { console.log('An error happened' + error); };

	animate();
}


/* SET UP SCENE */
function setScene() {
	// Set background image
	loader.load( 'images/sky.jpg' , function(texture) { scene.background = texture; });

	// Create shapes for planets, rings and tokens
	geometrySphere = new THREE.SphereGeometry( 1, 32, 50 );
	geometryRing = new THREE.RingGeometry( 1.6, 1.7, 50 );
	geometryBox = new THREE.BoxGeometry( 0.75, 1.0, 0.01 );

	var currpos = -1.0;
	var currposY = 2.0;
	var texture, material;
	// var bmap = THREE.ImageUtils.loadTexture('./images/texture.jpg');

	for (i = 0; i < planetNum; i++) {
		// Save current planet object to temporary value
		var currplanet = planetGroup[i];

		// Create planet
		texture = loader.load( currplanet.pic );
		material = new THREE.MeshPhongMaterial( { map: texture } );
			// material.bumpMap = THREE.ImageUtils.loadTexture();

		planet = new THREE.Mesh( geometrySphere, material );
			planet.name = currplanet.name;
			planet.position.x = 15 * Math.sin( currpos );
			planet.position.z = -15 * Math.cos( currpos );
			planet.position.y += currposY;
			scene.add( planet );

		currplanet.planetOBJ = planet;
		currpos += 0.285;
		currposY = currposY * -1;


		// Create ring for corresponding planets
		if ( currplanet.type == 'RingPlanet' || currplanet.type == 'RingTokenPlanet') {
			texture = loader.load( currplanet.ring );
			material = new THREE.MeshPhongMaterial( { map: texture } );
			ring = new THREE.Mesh( geometryRing, material );
				ring.name = "Ring";
				ring.rotation.x = Math.PI / -2.35;
				ring.position.x = planet.position.x;
				ring.position.z = planet.position.z;
				ring.position.y += planet.position.y;
				scene.add( ring );

			currplanet.ringOBJ = ring;
		}

		// Create token for corresponding planets
		if ( currplanet.type == 'TokenPlanet' || currplanet.type == 'RingTokenPlanet' ) {
			texture = loader.load( currplanet.token );
	  		material = new THREE.MeshPhongMaterial( { map: texture } );
  			token = new THREE.Mesh( geometryBox, material );
	  			token.name = "Token";
	  			token.position.y += 2 + planet.position.y;
				token.position.x = planet.position.x;
				token.position.z = planet.position.z;
				token.visible - false;
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
    if ( currplanet.ringOBJ != null ) { currplanet.ringOBJ.rotation.z -= SPINSPEED; }
    if ( currplanet.type == 'TokenPlanet' || currplanet.type == 'RingTokenPlanet' ) {
    	currplanet.tokenOBJ.visible = true;
    	currplanet.tokenOBJ.rotation.y -= SPINSPEED;
    }
}

// Set all token objects to hidden
function setTokensFalse() {
	for (var i = 0; i < planetNum; i++) {
		var currplanet = planetGroup[i];
		scene.remove( currplanet.light );
		if ( currplanet.type == 'TokenPlanet' || currplanet.type == 'RingTokenPlanet' ) {
			if ( currplanet.tokenOBJ != null ) { currplanet.tokenOBJ.visible = false; }
		}
	}
}


/* COMMUNICATION */
/* Obtains parameters from the hash of the URL */
function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
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
  	if ( intersects.length > 0 ) { 
  		var object = intersects[0].object;
  		if ( object.name != 'Ring' && object.name != 'Token' ) {
  			var currplanet = findPlanet( object.name );
  			if ( currplanet.type == 'TokenPlanet' || currplanet.type == 'RingTokenPlanet' ) {
  				// add highlight for shapes
  				if ( currplanet != null ) { rotatePlanet( object , currplanet ); }
  			}
  		}
  	}

  	// Update controls
    var delta = clock.getDelta();
    flyControls.update( delta );

  	// Render scene and camera	
	renderer.render( scene, camera );
}


/* EVENT LISTENERS -- Check bellow for event listener functions */
document.addEventListener('mousemove', onMouseMove, false); // 
window.addEventListener( 'resize', onWindowResize, false ); // 


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


/* HTML COMPONENT FUNCTIONALITY */
var albumId =  "62CwfDeiM9t81FaFHebuUm";
var access_token = "BQCzkfcGKSDwXCWUrC5dmSlbVBCp91bQk0EZdR1SsTjX-2jOrPTy_T7vcVIbUpRIaqCCrhaPMpj6Vl5O6YK56MDOcElwRFWD-eUaHQholIrXc2XV4DYbf90f9A-n9qzA6jI-0E2WTOnbN72_crfoujf2NWy3X_bckNTQ9s0sbnBR8JSL_nrM&refresh_token=AQDo0oiSnbWU5HDyYQ_-ZUcbzW2ssr7SjXOGIerRSD9s1AIpEfgnKP-OScU5MKfc1hYee4Dkp37j27PYtYUXYM32uNSpw_2g6T5aWm6mA9YSv3LVh5fICnBDyumbiXYN5XHwpw"

// Music button selected -- check user login, get album, play music, move planets + stars
function musicButton() {
	const accBtn = document.querySelector(".accept-btn [id=accept]");
    console.log("BUTTON CLICKED");
    // Get album information
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        headers: { 'Authorization': 'Bearer ' + access_token },
        success: function (response) {
            console.log(response);
        }
    });
}


/* Spotify SDK Music Player */
window.onSpotifyWebPlaybackSDKReady = () => {
    const token = access_token;
    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
};



