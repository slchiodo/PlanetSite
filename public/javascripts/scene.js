

/* SET UP SCENE */
function setScene() {
	// Set background image
	loader.load( 'images/sky.jpg' , function(texture) { scene.background = texture; });

	// Create shapes for planets, rings and tokens
	geometrySphere = new THREE.SphereGeometry( 1, 50, 50 );
	var geometrySphereLittle = new THREE.SphereGeometry( 0.01, 5, 5 );
	geometryBox = new THREE.BoxGeometry( 0.25, 0.25, 0.05 );

	var currpos = -1.0;
	var currposY = 1.0;
	var texture, material;
	var light;
	// var bmap = THREE.ImageUtils.loadTexture('./images/texture.jpg');

	material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	for ( i = 0; i < 20; i++ ) {
		// Both positive
		star = new THREE.Mesh( geometrySphereLittle, material );
			star.name = "Star";
	        star.position.x = generateRandomNumber( 0, 1.1 ) * distanceX;
	        star.position.y = generateRandomNumber( 0, 1.1 ) * distanceY;
	        star.position.z = generateRandomNumber( 0.2, 1.0 ) * distanceZ;
	        star.emissive = 0xffffff;
			starGroup.add(star);
		distanceX = distanceX * -1;
		distanceY = distanceY * -1;

		// Both negative
		star = new THREE.Mesh( geometrySphereLittle, material );
			star.name = "Star";
	        star.position.x = generateRandomNumber( 0, 1.1 ) * distanceX;
	        star.position.y = generateRandomNumber( 0, 1.1 ) * distanceY;
	        star.position.z = generateRandomNumber( 0.2, 1.0 ) * distanceZ;
	        star.emissive = 0xffffff;
	        starGroup.add(star);
	    distanceY = distanceY * -1;

	    // Only x negative
	    star = new THREE.Mesh( geometrySphereLittle, material );
			star.name = "Star";
	        star.position.x = generateRandomNumber( 0, 1.1 ) * distanceX;
	        star.position.y = generateRandomNumber( 0, 1.1 ) * distanceY;
	        star.position.z = generateRandomNumber( 0.2, 1.0 ) * distanceZ;
	        star.emissive = 0xffffff;
	        starGroup.add(star);
	    distanceX = distanceX * -1;
		distanceY = distanceY * -1;

		// Only y  negative
	    star = new THREE.Mesh( geometrySphereLittle, material );
			star.name = "Star";
	        star.position.x = generateRandomNumber( 0, 1.1 ) * distanceX;
	        star.position.y = generateRandomNumber( 0, 1.1 ) * distanceY;
	        star.position.z = generateRandomNumber( 0.2, 1.0 ) * distanceZ;
	        star.emissive = 0xffffff;
	        starGroup.add(star);
		distanceY = distanceY * -1;

	}
	scene.add(starGroup);

	geometrySphereLittle = new THREE.SphereGeometry( 0.1, 5, 5 );
	texture = loader.load( 'images/meteor.jpg' );
	material = new THREE.MeshPhongMaterial( { map: texture } );
	meteor = new THREE.Mesh( geometrySphereLittle, material );
		meteor.name = "Meteor";
		meteor.position.x = -5;
	    meteor.position.z = -5;
	    meteor.emissive = 0xffffff;
	scene.add(meteor);

	for (i = 0; i < planetNum; i++) {
		// Save current planet object to temporary value
		var currplanet = planetGroup[i];

		// Create planet
		texture = loader.load( currplanet.pic );
		// material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

		material = new THREE.MeshPhongMaterial( { map: texture } );
			// material.bumpMap = THREE.ImageUtils.loadTexture();

		geometrySphere = new THREE.SphereGeometry( currplanet.scale, 50, 50 );
		geometryRing = new THREE.RingGeometry( (currplanet.scale+0.5), (currplanet.scale+0.75), 50 );
		geometryBox = new THREE.BoxGeometry( (currplanet.scale/3), (currplanet.scale/3), 0.05 );

		planet = new THREE.Mesh( geometrySphere, material );
			planet.name = currplanet.name;
			planet.position.x = 10 * Math.sin( currpos );
			planet.position.z = -10 * Math.cos( currpos ) + generateRandomNumber( 0.1, 1.0 );
			planet.position.y = planet.position.y * currposY;
			scene.add( planet );

		currplanet.planetOBJ = planet;
		currpos += currplanet.padding;
		currposY = pickOne( -1.0, 1.0 );

		if ( i == Math.floor( planetNum / 2 ) ) {
			directionalLight.target = planet;
		}

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
	  		// material = new THREE.MeshPhongMaterial( { map: texture } );
	  		material = new THREE.MeshBasicMaterial( { color: 0x555555 } );
  			token = new THREE.Mesh( geometryBox, material );
	  			token.name = "Token";
	  			token.position.y += (currplanet.scale*1.5) + planet.position.y;
				token.position.x = planet.position.x;
				token.position.z = planet.position.z;
				token.visible - false;
	  			scene.add( token );

	  		currplanet.tokenOBJ = token;
		}
	}
}