myGame = new game(document.getElementById("game"));
Interval = null;

//loading the Images
PlayerImage = new Image();
PlayerImage.src = "./player.png"
	
IceImage = new Image();
IceImage.src = "./ice.png";
	
RoadImage = new Image();
RoadImage.src = "./road.png"


function startDriving(roadLength){

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
	neededIce 	= Math.ceil(roadLength/iceDistance);

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
		IceBlock[i].position = new vector2D(x , -i*800 + y);
		IceBlock[i].addComponent(new componentAdjustSize());
		IceBlock[i].addComponent(new componentBasicDraw());
		driverScene.addGPObject(IceBlock[i]);
	}


	//the finish line
	WinLine = new gpObject();
	WinLine.size = new vector2D(700, 100);
	WinLine.color = "blue";
	WinLine.tag = "gameover"
	WinLine.color = "green";
	WinLine.onCollide = function(ele){
		if(ele == player){
			alert("win");
			driverScene.drop();
			startDriving(5000)
		}
	}
	WinLine.position = new vector2D(-350 , -roadLength);
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
			alert("gameover");
			driverScene.drop();
			startDriving(3000)
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
			alert("gameover");
			driverScene.drop();
			startDriving(3000)
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
			alert("gameover");
			driverScene.drop();
			startDriving(3000)
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
		
}

if(Interval == null){
		Interval = setInterval(function(){myGame.update();}, Math.floor(1000/30));
}

startDriving(3000)
