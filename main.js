driver = new game(document.getElementById("game"));

driverCam = new camera();
driverCam.ZoomInToFitWithOf = 500;
driverScene = new scene(driverCam)
driver.addScene(driverScene);

IceImage = new Image();
IceImage.src = "./ice.png";

exampleBackground = new gpObject();
exampleBackground.size = new vector2D(100, 100);
exampleBackground.color = "blue";
exampleBackground.image = IceImage;
exampleBackground.fixHeight = false;
exampleBackground.position = new vector2D(-10, -300);
driverScene.addGPObject(exampleBackground);

exampleBackground1 = new gpObject();
exampleBackground1.size = new vector2D(100, 100);
exampleBackground1.color = "blue";
exampleBackground1.image = IceImage;
exampleBackground1.fixHeight = false;
exampleBackground1.position = new vector2D(10, -500);
driverScene.addGPObject(exampleBackground1);

exampleBackground2 = new gpObject();
exampleBackground2.size = new vector2D(100, 100);
exampleBackground2.color = "blue";
exampleBackground2.image = IceImage;
exampleBackground2.fixHeight = false;
exampleBackground2.position = new vector2D(10, -800);
driverScene.addGPObject(exampleBackground2);

player = new gpObject();
player.size = new vector2D(100, 100);
PlayerImage = new Image();
PlayerImage.src = "./player.png"
player.image= PlayerImage;
player.fixHeight = false;
player.move = new vector2D(0, -1)
driverScene.addGPObject(player);
driverCam.centerTo = player;



Interval = setInterval(function(){driver.update();}, Math.floor(1000/30));