'use strict';


(function(exports, models)
{
	models.card = null;
	models.nameplate = null;
	models.blankCard = null;
	models.box = null;
	models.dialog = null;

	function preloadModels(cb)
	{
		var loader = new THREE.ColladaLoader();
		var modelsToGo = 4;

		// pre-load card model
		loader.load('models/card.dae', function(result)
		{
			models.card = result.scene.children[0].children[0];
			models.card.scale.set(2,2,2);

			models.blankCard = generateCard(['']);

			modelsToGo--;
			if(modelsToGo === 0)
				cb();
		});

		// preload nameplate model
		loader.load('models/nameplate.dae', function(result)
		{
			models.nameplate = result.scene.children[0].children[0];
			models.nameplate.scale.set(2,2,2);

			modelsToGo--;
			if(modelsToGo === 0)
				cb();
		});

		loader.load('models/box.dae', function(result)
		{
			models.box = result.scene.children[0].children[0];
			models.box.scale.set(2,2,2);

			var texLoader = new THREE.TextureLoader();
			texLoader.load('models/box.png', function(tex){
				models.box.material = new THREE.MeshBasicMaterial({map: tex});
				modelsToGo--;
				if(modelsToGo === 0)
					cb();
			});
		});

		loader.load('models/dialog.dae', function(result)
		{
			models.dialog = result.scene.children[0];

			modelsToGo--;
			if(modelsToGo === 0)
				cb();
		});
	}

	function generateCard(text, color)
	{
		// card face texture resolution
		var cardWidth = 256;
		var model = models.card.clone();
		var fontStack = '"Helvetica Neue", Helvetica, Arial, Sans-Serif';
		
		// set up canvas
		var bmp = document.createElement('canvas');
		var g = bmp.getContext('2d');
		bmp.width = 2*cardWidth;
		bmp.height = 2*cardWidth;
		g.fillStyle = color === 'black' ? 'black' : 'white';
		g.fillRect(0, 0, 2*cardWidth, 2*cardWidth);
		
		// write text
		g.textAlign = 'left';
		g.font = 'bold '+(0.09*cardWidth)+'px '+fontStack;
		g.fillStyle = color === 'black' ? 'white' : 'black';
		for(var i=0; i<text.length; i++){
			g.fillText(text[i], 0.08*cardWidth, (0.15+0.12*i)*cardWidth);
		}
		
		// draw logo
		var edgeLength = 15;
		var x = 0.08*cardWidth, y = 1.33*cardWidth;
		g.lineWidth = 2;
		g.strokeStyle = color === 'black' ? 'white' : 'black';
		g.moveTo(x, y);
		g.lineTo(x+edgeLength/2, y-edgeLength*Math.sin(Math.PI/3));
		g.lineTo(x+edgeLength, y);
		g.moveTo(x+edgeLength/4, y);
		g.lineTo(x+3*edgeLength/4, y);
		g.stroke();

		// draw footer
		g.font = (0.05*cardWidth)+'px '+fontStack;
		g.fillText("Holograms Against Humanity", x+1.5*edgeLength, y);
		
		// draw card back
		g.font = 'bold '+(0.15*cardWidth)+'px '+fontStack;
		g.fillText('Holograms', 1.1*cardWidth, 0.22*cardWidth);
		g.fillText('Against', 1.1*cardWidth, 0.37*cardWidth);
		g.fillText('Humanity', 1.1*cardWidth, 0.52*cardWidth);
		
		// assign texture
		model.material = new THREE.MeshBasicMaterial({
			map: new THREE.CanvasTexture(bmp)
		});

		return model;
	}

	function generateTitleCard()
	{
		// card face texture resolution
		var cardWidth = 256;
		var model = models.card.clone();
		var fontStack = '"Helvetica Neue", Helvetica, Arial, Sans-Serif';

		// set up canvas
		var bmp = document.createElement('canvas');
		var g = bmp.getContext('2d');
		bmp.width = 2*cardWidth;
		bmp.height = 2*cardWidth;
		g.fillStyle = 'black';
		g.fillRect(0, 0, 2*cardWidth, 2*cardWidth);
		
		// draw card
		g.font = 'bold '+(0.15*cardWidth)+'px '+fontStack;
		g.fillStyle = 'white';

		g.fillText('Holograms', 0.1*cardWidth, 0.22*cardWidth);
		g.fillText('Against', 0.1*cardWidth, 0.37*cardWidth);
		g.fillText('Humanity', 0.1*cardWidth, 0.52*cardWidth);

		g.fillText('Holograms', 1.1*cardWidth, 0.22*cardWidth);
		g.fillText('Against', 1.1*cardWidth, 0.37*cardWidth);
		g.fillText('Humanity', 1.1*cardWidth, 0.52*cardWidth);
	
		// assign texture
		model.material = new THREE.MeshBasicMaterial({
			map: new THREE.CanvasTexture(bmp)
		});

		return model;
	}

	function generateNameplate(name)
	{
		// card face texture resolution
		var texWidth = 256;
		var model = models.nameplate.clone();
		var fontStack = '"Helvetica Neue", Helvetica, Arial, Sans-Serif';
		
		// set up canvas
		var bmp = document.createElement('canvas');
		var g = bmp.getContext('2d');
		bmp.width = texWidth;
		bmp.height = texWidth;
		g.fillStyle = '#38281C';
		g.fillRect(0, 0, texWidth, texWidth);

		g.font = 'bold 25px '+fontStack;
		g.textAlign = 'center';
		g.fillStyle = 'white';
		g.fillText(name, texWidth/2, 35);
		g.fillText(name, texWidth/2, 86);

		// assign texture
		model.material = new THREE.MeshBasicMaterial({
			map: new THREE.CanvasTexture(bmp)
		});

		return model;
	}

	function generateDialog(text, acceptCb, declineCb)
	{
		// card face texture resolution
		var texWidth = 512;
		var model = models.dialog.clone();
		var fontStack = '"Helvetica Neue", Helvetica, Arial, Sans-Serif';
		
		// set up canvas
		var bmp = document.createElement('canvas');
		var g = bmp.getContext('2d');
		bmp.width = texWidth;
		bmp.height = texWidth;

		// draw background
		g.fillStyle = 'blue';
		g.fillRect(0, 0, texWidth, texWidth-170);
		g.fillStyle = 'red';
		g.fillRect(0, texWidth-170, texWidth/2, 170);
		g.fillStyle = 'green';
		g.fillRect(texWidth/2, texWidth-170, texWidth/2, 170);

		g.font = 'bold 25px '+fontStack;
		g.textAlign = 'center';
		g.fillStyle = 'black';

		// assign texture
		model.traverse(function(mesh){
			mesh.material = new THREE.MeshBasicMaterial({
				map: new THREE.CanvasTexture(bmp)
			});
		});


		return model;
	}

	function sphericalToMatrix(theta, phi, radius)
	{
		// determine position
		var x = radius * Math.cos(phi) * Math.sin(theta);
		var y = radius * Math.cos(phi) * Math.cos(theta);
		var z = radius * Math.sin(phi);

		// determine rotation
		var basisZ = new THREE.Vector3(-x, -y, -z).normalize();
		var basisX = new THREE.Vector3().crossVectors( basisZ, new THREE.Vector3(0,0,1) );
		var basisY = new THREE.Vector3().crossVectors( basisX, basisZ );

		// combine into matrix
		var mat = new THREE.Matrix4();
		mat.makeBasis( basisX, basisY, basisZ );
		mat.setPosition( new THREE.Vector3(x, y, z) );

		return mat;
	}

	function rebalanceTable(newTurnOrder, oldTurnOrder)
	{
		newTurnOrder = newTurnOrder || [];
		oldTurnOrder = oldTurnOrder || [];

		var angle = 2*Math.PI/newTurnOrder.length;
		var cardRadius = 0.5, row1Angle = Math.PI/5, row2Angle = Math.PI/3, row1Sep = Math.PI/10, row2Sep = 1.5*Math.PI/10;

		// flip box when first player joins/leaves
		if(newTurnOrder.length > 0){
			gameObjects.box.rotation.set(0, 0, 0);
			gameObjects.titleCard.visible = false;
		}
		else {
			gameObjects.box.rotation.set(Math.PI, 0, 0);
			gameObjects.titleCard.visible = false;
		}

		// add new players, adjust old players
		for(var i=0; i<newTurnOrder.length; i++)
		{
			// attempt to get seat at index
			var seat = root.getObjectByName(newTurnOrder[i].playerId);
			if(seat)
			{
				// player is already in the game, move them to position
				seat.position.set(-1.05*tableRadius*Math.sin(i*angle), -1.05*tableRadius*Math.cos(i*angle), 1.5);
				seat.rotation.set(0, 0, -angle*i);
			}
			else
			{
				// create new seat for player
				seat = new THREE.Object3D();
				seat.name = newTurnOrder[i].playerId;
				seat.position.set(-tableRadius*Math.sin(i*angle), -tableRadius*Math.cos(i*angle), 1.5);
				seat.rotation.set(0, 0, -angle*i);

				// add nameplate for the player
				var nameplate = generateNameplate(newTurnOrder[i].displayName);
				nameplate.name = 'nameplate';
				nameplate.position.set(0, 0.15, -0.64);
				nameplate.rotation.set(0, 0, Math.PI/2);
				seat.add(nameplate);

				if(newTurnOrder[i].playerId === Game.playerInfo.playerId)
				{
					// register "Leave" action
					nameplate.addEventListener('cursorup', function(evt){
						Game.socket.emit('playerLeave', Game.playerInfo.playerId, Game.playerInfo.displayName,
							Game.playerInfo.displayName+' has left the game.'
						);
					});
				}
				else
				{
					// register "Kick" action
					(function(nameplate, opponentInfo){
						console.log('Registering kick event');
						nameplate.addEventListener('cursorup', function(evt){
							console.log('kicking');
							Game.socket.emit('playerKickRequest', opponentInfo.playerId, opponentInfo.displayName);
						});
					})(nameplate, newTurnOrder[i]);
				}

				// add seat to the table
				root.add(seat);
			}
		}

		// remove absent players
		for(var i=0; i<oldTurnOrder.length; i++)
		{
			// determine if old player is in new turn order
			for(var j=0, playerIn=false; j<newTurnOrder.length && !playerIn; j++){
				playerIn = playerIn || newTurnOrder[j].playerId === oldTurnOrder[i].playerId;
			}

			if(!playerIn){
				var seat = root.getObjectByName(oldTurnOrder[i].playerId);
				root.remove(seat);
			}
		}
	}

	exports.preloadModels = preloadModels;
	exports.generateCard = generateCard;
	exports.generateTitleCard = generateTitleCard;
	exports.generateNameplate = generateNameplate;
	exports.generateDialog = generateDialog;
	exports.sphericalToMatrix = sphericalToMatrix;
	exports.rebalanceTable = rebalanceTable;

})(window.Utils = window.Utils || {}, window.Models = window.Models || {});

