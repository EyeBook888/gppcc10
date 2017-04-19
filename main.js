myGame = new game(document.getElementById("game"));
Interval = null;



// -------------- core Loop ------------
//loading the Images
PlayerImage = new Image();
PlayerImage.src = "./player.png"
	
IceImage = new Image();
IceImage.src = "./ice.png";
	
RoadImage = new Image();
RoadImage.src = "./road.png"

bridgeLeftImage = new Image();
bridgeLeftImage.src = "./bridgeLeft.png"

bridgeRightImage = new Image();
bridgeRightImage.src = "./bridgeRight.png"


function startDriving(roadLength){

	var roadLength = 700*roadLength;

	driverCam = new camera();
	driverCam.ZoomInToFitWithOf = 700;
	driverCam.focusPosition = setting.BOTTOM;
	driverScene = new scene(driverCam)
	
	
	driverScene.pullLeft = function(){
		player.move = new vector2D(-0.25, -0.5)
		//player.position.add(new vector2D(-100, 0))
	}
	driverScene.pullRight = function(){
		player.move = new vector2D(0.25, -0.5)
		//player.position.add(new vector2D(100, 0))
	}
	
	driverScene.pullDown = function(){
		player.move = new vector2D(0, -0.5)
	}
	
	driverScene.pullUp = function(){
		player.move = new vector2D(0, -0.5)
	}
	
	
	
	myGame.addScene(driverScene);
	myGame.activeScene = driverScene.id;
	
	road = new gpObject();
	road.size = new vector2D(600, 100);
	road.color = "blue";
	road.image = RoadImage;
	road.fixHeight = false;
	road.position = new vector2D(-300, -800);
	road.addComponent(new componentAdjustSize());
	road.addComponent(new componentBackground());
	driverScene.addGPObject(road);
	
	iceDistance = 800;
	neededIce 	= Math.floor(roadLength/iceDistance);

	IceBlock = new Array();
	
	for(i = 0; i <= neededIce; i++){
		IceBlock[i] = new gpObject();
		IceBlock[i].size = new vector2D(100, 100);
		IceBlock[i].color = "blue";
		IceBlock[i].tag = "gameover"
		IceBlock[i].image = IceImage;
		IceBlock[i].fixHeight = false;
		x = Math.round(Math.random()*600-300);
		y = Math.round(Math.random()*300) - 800;
		IceBlock[i].position = new vector2D(x , Math.max(-i*800 + y, -roadLength));
		IceBlock[i].addComponent(new componentCollide());
		IceBlock[i].addComponent(new componentAdjustSize());
		IceBlock[i].addComponent(new componentBasicDraw());

		driverScene.addGPObject(IceBlock[i]);
	}

	//bridge
	y = -Math.round(Math.random()*roadLength);

	bridgeLeft = new gpObject();
	bridgeLeft.size = new vector2D(350, 00);
	bridgeLeft.color = "blue";
	bridgeLeft.tag = "gameover"
	bridgeLeft.image = bridgeLeftImage;
	bridgeLeft.fixHeight = false;
	bridgeLeft.position = new vector2D(-500 , y);
	bridgeLeft.addComponent(new componentCollide());
	bridgeLeft.addComponent(new componentAdjustSize());
	bridgeLeft.addComponent(new componentBasicDraw());
	driverScene.addGPObject(bridgeLeft);


	bridgeRight = new gpObject();
	bridgeRight.size = new vector2D(350, 00);
	bridgeRight.color = "blue";
	bridgeRight.tag = "gameover"
	bridgeRight.image = bridgeRightImage;
	bridgeRight.fixHeight = false;
	bridgeRight.position = new vector2D(150 , y);
	bridgeRight.addComponent(new componentCollide());
	bridgeRight.addComponent(new componentAdjustSize());
	bridgeRight.addComponent(new componentBasicDraw());
	driverScene.addGPObject(bridgeRight);



	//the finish line
	WinLine = new gpObject();
	WinLine.size = new vector2D(700, 100);
	WinLine.color = "rgba(0, 255, 0, 0.3)";
	WinLine.onCollide = function(ele){
		if(ele == player){
			fadeOut.fadeIn();
			//player.move.x1 = Math.min(player.move.x1+10, 0);//dirty but it works
			this.onCollide = function(ele){};
		}
	}
	WinLine.position = new vector2D(-350 , -roadLength -WinLine.size.x1);
	WinLine.addComponent(new componentAdjustSize())
	WinLine.addComponent(new componentCollide())
	WinLine.addComponent(new componentBasicDraw())
	driverScene.addGPObject(WinLine);


	//Borders -> not let the Player out of the screen

	looseLeftBorder = new gpObject();
	looseLeftBorder.size = new vector2D(100, roadLength +500);
	looseLeftBorder.tag = "gameover"
	looseLeftBorder.color = "red";
	looseLeftBorder.onCollide = function(ele){
		if(ele == player){
			gameover();
			this.onCollide = function(ele){};
		}
	}
	looseLeftBorder.position = new vector2D(-450 , -roadLength);
	looseLeftBorder.addComponent(new componentAdjustSize())
	looseLeftBorder.addComponent(new componentCollide())
	looseLeftBorder.addComponent(new componentBasicDraw())
	driverScene.addGPObject(looseLeftBorder);

	looseRightBorder = new gpObject();
	looseRightBorder.size = new vector2D(100, roadLength +500);
	looseRightBorder.tag = "gameover"
	looseRightBorder.color = "red";
	looseRightBorder.onCollide = function(ele){
		if(ele == player){
			gameover();
			this.onCollide = function(ele){};
		}
	}
	looseRightBorder.position = new vector2D(350 , -roadLength);
	looseRightBorder.addComponent(new componentAdjustSize())
	looseRightBorder.addComponent(new componentCollide())
	looseRightBorder.addComponent(new componentBasicDraw())
	driverScene.addGPObject(looseRightBorder);

	
	
	player = new gpObject();
	player.size = new vector2D(100, 100);
	player.onCollide = function(ele){
		if(ele.tag == "gameover"){
			gameover();
			this.onCollide = function(ele){};
		}
	}
	player.position = new vector2D(-50, 0);
	player.image= PlayerImage;
	player.fixHeight = false;
	player.move = new vector2D(0, -0.5)
	
	player.addComponent(new componentAdjustSize())
	player.addComponent(new componentCollide())
	player.addComponent(new componentBasicDraw())
	player.addComponent(new componentMovement())

	driverScene.addGPObject(player);


	score = new gpObject();
	score.addComponent(new componentAdjustSizeGUI());
	score.addComponent(new componentBasicDraw())
	score.addComponent(new componentTextDraw());

	score.addComponent(new function(){//update the driven km
		this.draw = function(camera){
			distance = player.position.x1/-700;
			distance = Math.round(distance*10)/10;
			if(distance%1 == 0){
				distance = distance + ".0"
			}

			this.gpObject.text = distance + "km";
		}
	})

	score.color = "white"
	score.positionUI = new vector2D(0, 0);
	score.sizeUI = new vector2D(0.3, 0.04);
	score.text = "0km";
	score.textAlign = setting.RIGHT;
	score.textSize = setting.DYNAMIC;
	driverScene.addGPObject(score);




	
	cameraFocus = new gpObject();
	cameraFocus.size = new vector2D(100, 250);
	cameraFocus.color = "rgba(0, 0, 0, 0)"
	cameraFocus.position = new vector2D(-50, 0);
	cameraFocus.fixHeight = false;
	cameraFocus.move = new vector2D(0, -0.5)
	cameraFocus.addComponent(new componentAdjustSize())
	cameraFocus.addComponent(new componentCollide())
	cameraFocus.addComponent(new componentBasicDraw())
	cameraFocus.addComponent(new componentMovement())
	driverScene.addGPObject(cameraFocus);
	driverCam.focusTo = cameraFocus;


	fadeOut = new gpObject();
	fadeOut.sizeUI = new vector2D(1, 1)
	fadeOut.endColorRGB = [0, 191, 255]
	fadeOut.positionUI = new vector2D(0, 0)
	fadeOut.fadeTime = 2000
	fadeOut.addComponent(new componentFadeIn())
	fadeOut.addComponent(new componentAdjustSizeGUI());
	fadeOut.addComponent(new componentBasicDraw())
	driverScene.addGPObject(fadeOut);
	fadeOut.onFadeIn = function(){
		driverScene.drop();

		//open the menu
		myGame.activeScene = menuScene.id;
	}
	
		
}

function gameover(){
	//alert("gameover");
	player.move = new vector2D(0, 0)
	fadeOut.fadeTime = 500
	fadeOut.fadeIn();
}


if(Interval == null){
		Interval = setInterval(function(){myGame.update();}, Math.floor(1000/60));
}





//-------------- menu --------------



menuCam = new camera();
menuCam.ZoomInToFitWithOf = 700;
menuCam.focusPosition = setting.BOTTOM;


menuScene = new scene(menuCam)
myGame.addScene(menuScene);


//the background
MenuBackground = new gpObject();
MenuBackground.sizeUI = new vector2D(1, 1)
MenuBackground.positionUI = new vector2D(0, 0)
MenuBackground.addComponent(new componentAdjustSizeGUI());
MenuBackground.addComponent(new componentBasicDraw())
MenuBackground.color = "rgb(0, 191, 255)";
menuScene.addGPObject(MenuBackground)

missionButton = new gpObject();
missionButton.sizeUI = new vector2D(0.6, 0.1)
missionButton.positionUI = new vector2D(0.2, 0.2)
missionButton.addComponent(new componentAdjustSizeGUI());
missionButton.addComponent(new componentBasicDraw())
missionButton.addComponent(new componentTextDraw())
missionButton.addComponent(new componentClick())
missionButton.color = "rgb(255, 255, 255)";
missionButton.text = "Start"
missionButton.onClick = function(){
	startDriving(10)
}
missionButton.textAlign = setting.CENTER;
missionButton.textSize = setting.DYNAMIC;
menuScene.addGPObject(missionButton)


//----------------------------------


//startDriving(3)
