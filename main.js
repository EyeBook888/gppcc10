driver = new game(document.getElementById("game"));

driverCam = new camera();
driverScene = new scene(driverCam)
driver.addScene(driverScene);



exampleBackground = new gpObject();
exampleBackground.size = new vector2D(100, 100);
exampleBackground.color = "blue";
exampleBackground.position = new vector2D(-10, -300);
driverScene.addGPObject(exampleBackground);

exampleBackground1 = new gpObject();
exampleBackground1.size = new vector2D(100, 100);
exampleBackground1.color = "blue";
exampleBackground1.position = new vector2D(10, -500);
driverScene.addGPObject(exampleBackground1);

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