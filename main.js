driver = new game(document.getElementById("game"));

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



driver.addScene(driverScene);

IceImage = new Image();
IceImage.src = "./ice.png";

RoadImage = new Image();
RoadImage.src = "./road.png"

road = new gBackground();
road.size = new vector2D(600, 100);
road.color = "blue";
road.image = RoadImage;
road.fixHeight = false;
road.position = new vector2D(-300, -800);
driverScene.addGPObject(road);

IceBlock = new Array();

for(i = 0; i <= 100; i++){
	IceBlock[i] = new gpObject();
	IceBlock[i].size = new vector2D(100, 100);
	IceBlock[i].color = "blue";
	IceBlock[i].name = "Ice"
	IceBlock[i].image = IceImage;
	IceBlock[i].fixHeight = false;
	x = Math.round(Math.random()*600-300);
	y = Math.round(Math.random()*300) - 800;
	IceBlock[i].position = new vector2D(x , -i*800 + y);
	driverScene.addGPObject(IceBlock[i]);
}


player = new gpObject();
player.size = new vector2D(100, 100);
player.onCollide = function(ele){
	if(ele.name == "Ice"){
		alert("gameover: " + ele.name);
	}
}
player.position = new vector2D(-50, 0);
PlayerImage = new Image();
PlayerImage.src = "./player.png"
player.image= PlayerImage;
player.fixHeight = false;
player.move = new vector2D(0, -0.5)
driverScene.addGPObject(player);
driverCam.focusTo = player;

cameraFocus = new gpObject();
cameraFocus.size = new vector2D(100, 200);
cameraFocus.color = "rgba(0, 0, 0, 0)"
cameraFocus.position = new vector2D(-50, 100);
cameraFocus.fixHeight = false;
cameraFocus.move = new vector2D(0, -0.5)
driverScene.addGPObject(cameraFocus);
driverCam.focusTo = cameraFocus;



Interval = setInterval(function(){driver.update();}, Math.floor(1000/30));