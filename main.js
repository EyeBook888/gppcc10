
savegame = new Array();//everything the has to be save to recreate a game
savegame.money = 0;



myGame = new game(document.getElementById("game"));
Interval = null;



// -------------- core Loop ------------
//loading the Images
truckImage = new Image();
truckImage.src = "./truck.png"

vwImage = new Image();
vwImage.src = "./vw.png"
	
IceImage = new Image();
IceImage.src = "./ice.png";
	
RoadImage = new Image();
RoadImage.src = "./road.png"

bridgeLeftImage = new Image();
bridgeLeftImage.src = "./bridgeLeft.png"

bridgeRightImage = new Image();
bridgeRightImage.src = "./bridgeRight.png"


snowImage = new Image();
snowImage.src = "./snow.png"

function car(name, image, width){
	this.image = image;
	this.width = width;
	this.name = name;
}


carList = new Array();
carList.push(new car("Käfer", vwImage, 60));
carList.push(new car("Truck", truckImage, 100));

currentCar = carList[0];

function startDriving(roadLength){

	var roadLength = 700*roadLength;

	driverCam = new camera();
	driverCam.ZoomInToFitWithOf = 700;
	driverCam.focusPosition = setting.BOTTOM;
	driverScene = new scene(driverCam);
	
	
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
			savegame.money+=Math.round(roadLength/100);
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
	player.size = new vector2D(currentCar.width, 100);
	player.onCollide = function(ele){
		if(ele.tag == "gameover"){
			gameover();
			this.onCollide = function(ele){};
		}
	}
	player.position = new vector2D(-50, 0);
	player.image= currentCar.image;
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


//--------- function for buttons that has to be use over and over again ------
function createMoneyLable(){
	Money = new gpObject();
	Money.sizeUI = new vector2D(0.2, 0.05)
	Money.positionUI = new vector2D(0.8, 0);
	Money.addComponent(new componentAdjustSizeGUI());
	Money.addComponent(new componentBasicDraw())
	Money.addComponent(new componentTextDraw())
	Money.addComponent(new function(){
		this.draw = function(camera){
			this.gpObject.text = savegame.money + "€";
		}
	})
	Money.color = "rgba(0,0,0,0)";
	Money.textSize = setting.DYNAMIC;
	Money.number = i;
	Money.text = "0€";
	return Money;
}

backImage = new Image();
backImage.src = "back.png";

function createBackButton(){
	back = new gpObject();
	back.sizeUI = new vector2D(0.2, 0.05)
	back.positionUI = new vector2D(0.01, 0.01)
	back.addComponent(new componentAdjustSizeGUI());
	back.addComponent(new componentAdjustSize());
	back.addComponent(new componentBasicDraw())
	back.addComponent(new componentClick())
	back.fixHeight = false;

	back.image = backImage;
	back.onClick = function(){
		myGame.activeScene = menuScene.id;
	}
	return back;
}


function addBackgroundAndSnow(scene){
	//the background
	MenuBackground = new gpObject();
	MenuBackground.sizeUI = new vector2D(1, 1)
	MenuBackground.positionUI = new vector2D(0, 0)
	MenuBackground.addComponent(new componentAdjustSizeGUI());
	MenuBackground.addComponent(new componentBasicDraw())
	MenuBackground.color = "rgb(0, 191, 255)";
	scene.addGPObject(MenuBackground)
	
	//snow
	snow = new Array();
		
	for(i = 0; i <= 60; i++){
		snow[i] = new gpObject();
		snow[i].size = new vector2D(15, 15);
		snow[i].color = "white";
		snow[i].tag = "gameover"
		snow[i].image = snowImage;
		snow[i].fixHeight = false;
		x = (Math.random()*700*2)-700;;
		y = 10000;
		snow[i].position = new vector2D(x, y);
		snow[i].addComponent(new componentMovement());
		snow[i].addComponent(new componentAdjustSize());
		snow[i].addComponent(new componentBasicDraw());
	
		snow[i].addComponent(new function(){
			this.draw = function(camera){
				if(this.gpObject.position.x1 >= camera.canvas.height / camera.zoomFactor){
					x = (Math.random()*700*2)-700;
					y = - Math.random()* (camera.canvas.height / camera.zoomFactor);
					this.gpObject.position = new vector2D(x, y);
				}
			}
		});
	
		snow[i].move = new vector2D(0.1, 0.5)
		scene.addGPObject(snow[i]);
	}
}



//-------------- menu --------------

menuCam = new camera();
menuCam.ZoomInToFitWithOf = 700;
menuCam.focusPosition = setting.BOTTOM;


menuScene = new scene(menuCam)
myGame.addScene(menuScene);

addBackgroundAndSnow(menuScene);

menuScene.addGPObject(createMoneyLable());

missionButton = new gpObject();
missionButton.sizeUI = new vector2D(0.6, 0.1)
missionButton.positionUI = new vector2D(0.2, 0.1)
missionButton.addComponent(new componentAdjustSizeGUI());
missionButton.addComponent(new componentBasicDraw())
missionButton.addComponent(new componentTextDraw())
missionButton.addComponent(new componentClick())
missionButton.color = "rgb(255, 255, 255)";
missionButton.text = "mission"
missionButton.onClick = function(){
	myGame.activeScene = missionSelectScene.id;
}
missionButton.textAlign = setting.CENTER;
missionButton.textSize = setting.DYNAMIC;
menuScene.addGPObject(missionButton)



carShop = new gpObject();
carShop.sizeUI = new vector2D(0.6, 0.1)
carShop.positionUI = new vector2D(0.2, 0.25)
carShop.addComponent(new componentAdjustSizeGUI());
carShop.addComponent(new componentBasicDraw())
carShop.addComponent(new componentTextDraw())
carShop.addComponent(new componentClick())
carShop.color = "rgb(255, 255, 255)";
carShop.text = "car shop"
carShop.onClick = function(){
	myGame.activeScene = shopScene.id;
}
carShop.textAlign = setting.CENTER;
carShop.textSize = setting.DYNAMIC;
menuScene.addGPObject(carShop)

//local authorities

authorities = new gpObject();
authorities.sizeUI = new vector2D(0.6, 0.1)
authorities.positionUI = new vector2D(0.2, 0.4)
authorities.addComponent(new componentAdjustSizeGUI());
authorities.addComponent(new componentBasicDraw())
authorities.addComponent(new componentTextDraw())
authorities.addComponent(new componentClick())
authorities.color = "rgb(255, 255, 255)";
authorities.text = "local authorities"
authorities.onClick = function(){
	alert("coming soon");
}
authorities.textAlign = setting.CENTER;
authorities.textSize = setting.DYNAMIC;
menuScene.addGPObject(authorities)



//-------------- shop --------------

shopCam = new camera();
shopCam.ZoomInToFitWithOf = 700;
shopCam.focusPosition = setting.BOTTOM;


shopScene = new scene(shopCam)
myGame.addScene(shopScene);


addBackgroundAndSnow(shopScene);
shopScene.addGPObject(createMoneyLable());

offerBackground = new Array();
offerCarImage = new Array();
i = 0;
for(i = 0; i < carList.length; i++){
	x = i%3;
	y = Math.floor(i/3);
	offerBackground[i] = new gpObject();
	offerBackground[i].sizeUI = new vector2D(0.3, 0.27)
	offerBackground[i].positionUI = new vector2D(x*0.33 + 0.015, y*0.30 + 0.115)
	offerBackground[i].addComponent(new componentAdjustSizeGUI());
	offerBackground[i].addComponent(new componentBasicDraw())
	offerBackground[i].addComponent(new componentClick())
	offerBackground[i].carId = i;
	offerBackground[i].color = "rgb(255, 255, 255)";
	offerBackground[i].onClick = function(){
		//change the color to green to show that this this car is selected
		for (var i = 0; i < offerBackground.length; i++) {
			offerBackground[i].color = "white";
		};

		this.color = "green";
		currentCar = carList[this.carId];
	}

	shopScene.addGPObject(offerBackground[i])
	offerCarImage[i] = new gpObject();
	offerCarImage[i].sizeUI = new vector2D(0.1, 0.27)
	offerCarImage[i].positionUI = new vector2D(x*0.33 + 0.015 + 0.1, y*0.30 + 0.115 + 0.01)
	offerCarImage[i].addComponent(new componentAdjustSizeGUI());
	offerCarImage[i].addComponent(new componentAdjustSize());
	offerCarImage[i].addComponent(new componentBasicDraw());
	offerCarImage[i].fixHeight = false;
	offerCarImage[i].image = carList[i].image;
	shopScene.addGPObject(offerCarImage[i])
		


}


shopScene.addGPObject(createBackButton())




//------------ mission select ------------

missionSelectCam = new camera();
missionSelectCam.ZoomInToFitWithOf = 700;


missionSelectScene = new scene(missionSelectCam)
myGame.addScene(missionSelectScene);


addBackgroundAndSnow(missionSelectScene);

missionSelectScene.addGPObject(createMoneyLable());


missionOfferBackground = new Array();
for(i = 0; i < 9; i++){
	missionOfferBackground[i] = new gpObject();
	missionOfferBackground[i].sizeUI = new vector2D(0.9, 1/10-0.01)
	missionOfferBackground[i].positionUI = new vector2D(0.05, i*(1/10) + 0.1);
	missionOfferBackground[i].addComponent(new componentAdjustSizeGUI());
	missionOfferBackground[i].addComponent(new componentBasicDraw())
	missionOfferBackground[i].addComponent(new componentTextDraw())
	missionOfferBackground[i].addComponent(new componentClick())
	missionOfferBackground[i].color = "rgb(255, 255, 255)";
	missionOfferBackground[i].textSize = setting.DYNAMIC;
	missionOfferBackground[i].number = i;
	missionOfferBackground[i].text = ((i+1)*2) + "km";
	missionOfferBackground[i].onClick = function(){
		startDriving((this.number+1)*2)
	}
	missionSelectScene.addGPObject(missionOfferBackground[i])
}



missionSelectScene.addGPObject(createBackButton())

