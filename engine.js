//disable scrolling
window.addEventListener("scroll", preventMotion, false);
window.addEventListener("touchmove", preventMotion, false);

function preventMotion(event){
   	window.scrollTo(0, 0);
   	event.preventDefault();
   	event.stopPropagation();
}



function game(canvas){

	this.sceneList		= new Array();
	this.activeScene	= 0;

	this.canvas 	= canvas;
	this.context	= this.canvas.getContext("2d");

	//set the canvas style
	this.canvas.style.position 	= "absolute";
	this.canvas.style.top 		= "0px";
	this.canvas.style.left 		= "0px";


	//touch and click events

	touchStartCount = 0;//for not trigger the event twice on mobile
	clickStartCount = 0;

	this.touchStart = function(event){
		if(touchStartCount >= clickStartCount){
			position = new vector2D(
				event.touches[0].pageX,
				event.touches[0].pageY); 
			this.controlStart(position);
		}

		touchStartCount++;
	}

	this.clickStart = function(event){
		if(clickStartCount >= touchStartCount){
			position = new vector2D(
				event.clientX,
				event.clientY);
			this.controlStart(position);
		}
		clickStartCount++;

	}


	touchEndCount = 0;//for not trigger the event twice on mobile
	clickEndCount = 0;

	this.touchEnd = function(event){
		if(touchEndCount >= clickEndCount){
			position = new vector2D(
				lastTouchMove.touches[0].pageX,
				lastTouchMove.touches[0].pageY); 
			this.controlEnd(position);
		}
		touchEndCount++;

	}

	this.clickEnd = function(event){
		if(clickEndCount >= touchEndCount){
			position = new vector2D(
				event.clientX,
				event.clientY);
			this.controlEnd(position);
		}
		clickEndCount++;
	}

	theGame = this;//for the events

	this.canvas.addEventListener ('touchstart', function(event){theGame.touchStart(event)});
	this.canvas.addEventListener ('mousedown',  function(event){theGame.clickStart(event)});

	this.canvas.addEventListener ('touchend', function(event){theGame.touchEnd(event)});
	this.canvas.addEventListener ('mouseup',  function(event){theGame.clickEnd(event)});

	this.canvas.addEventListener('touchmove', function(event) {
  		lastTouchMove = event;
	});

	controlStartPosition = null;//for the height Level events

	this.controlStart = function(position){//touchstart event for smart phone and mouse down on PC
		controlStartPosition = position;

		for (var i = 0; i < this.sceneList.length; i++) {//go to all element and trigger the event
			if(this.sceneList[i].controlStart != null){
				this.sceneList[i].controlStart(position)
			}
		};
	}

	this.controlEnd = function(position){//touchend event for smart phone and mouse up on PC
		for (var i = 0; i < this.sceneList.length; i++) {//go to all element and trigger the event
			if(this.sceneList[i].controlEnd != null){
				this.sceneList[i].controlEnd(position)
			}
		};

		//height Level events
		wayX = position.x0 - controlStartPosition.x0;
		wayY = position.x1 - controlStartPosition.x1;
		if(Math.abs(wayX) > Math.abs(wayY) && wayX > 0){
			//pull right
			for (var i = 0; i < this.sceneList.length; i++) {//go to all element and trigger the event
				if(this.sceneList[i].pullRight != null){
					this.sceneList[i].pullRight()
				}
			};
		}

		else if(Math.abs(wayX) > Math.abs(wayY) && wayX < 0){
			//pull left
			for (var i = 0; i < this.sceneList.length; i++) {//go to all element and trigger the event
				if(this.sceneList[i].pullLeft != null){
					this.sceneList[i].pullLeft()
				}
			};
		}
		else if(Math.abs(wayX) < Math.abs(wayY) && wayY < 0){
			//pull Up
			for (var i = 0; i < this.sceneList.length; i++) {//go to all element and trigger the event
				if(this.sceneList[i].pullUp != null){
					this.sceneList[i].pullUp()
				}
			};
		}

		else if(Math.abs(wayX) < Math.abs(wayY) && wayY > 0){
			//pull left
			for (var i = 0; i < this.sceneList.length; i++) {//go to all element and trigger the event
				if(this.sceneList[i].pullDown != null){
					this.sceneList[i].pullDown()
				}
			};
		}
	}



	this.update = function(){//handle for example the draw call
		deltaTime = 1000/30;

		//make the canvas fit the window
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		//update the current scene
		this.sceneList[this.activeScene].draw(this.canvas, this.context, deltaTime);
	}

	this.addScene = function(scene){
		scene.id 	= this.sceneList.length;
		scene.game 	= this;
		this.sceneList.push(scene);
	}


}


function scene(camera){

	this.camera = camera;

	this.game = null;//reverence to the game i which the scene is in 

	this.objectList = new Array();

	this.addGPObject = function(gpObject){
		gpObject.scene = this;
		this.objectList.push(gpObject);
	}

	this.draw = function(canvas, context, deltaTime){
		this.camera.update(canvas, context, deltaTime);
		for (var i = 0; i < this.objectList.length; i++) {
			this.objectList[i].draw(this.camera);
		};
	}

	this.drop = function(){
		this.game.sceneList = remove(this.game.sceneList, this);
	}

}


function gpObject(){//graphical physical Object
	
	this.scene = null;//to address the scene in which the object is in

	this.components = new Array();

	this.draw = function(camera){
		for(var i = 0; i < this.components.length; i++){
			if(this.components[i].draw != null){
				this.components[i].draw(camera);
			}
		}
	}

	this.addComponent = function(component){
		component.gpObject = this;
		if(component.init != null){component.init();}
		this.components.push(component);
	}

	this.addParameter = function(name, value){//to add a variable to the object (if it not exist) (by components)
		if(this[name] == null){
			this[name] = value;
		}
	}

	this.drop = function(){
		this.game.sceneList = remove(this.scene.sceneList, this);
	}
}



function camera(){
	this.zoomFactor = 1;
	this.position = new vector2D(0, 0);

	this.canvas		= null;
	this.context 	= null;

	this.focusTo = null; //if a gpObject should always in the middle of the window
	this.focusPosition = setting.CENTER; //should the gpObject be in the middle or same were else


	this.deltaTime = 0;

	this.ZoomInToFitWithOf = null;

	this.update = function(canvas, context, deltaTime){
		this.canvas		= canvas;
		this.context 	= context;
		this.deltaTime	= deltaTime;

		if(this.ZoomInToFitWithOf != null){//zoom in
			this.zoomFactor = this.canvas.width/this.ZoomInToFitWithOf;
		}

		if(this.focusTo != null && this.focusPosition == setting.CENTER){//center the camera
			centerPoint = new vector2D(0, 0)
			centerPoint.add(this.focusTo.position);

			
			objectCenter = new vector2D(0, 0)
			objectCenter.add(this.focusTo.size);
			objectCenter.times(0.5);

			centerPoint.add(objectCenter);
			

			this.position = centerPoint;
			this.position.add(new vector2D( -(canvas.width/2)/this.zoomFactor, -(canvas.height/2)/this.zoomFactor ));

		}else if(this.focusTo != null && this.focusPosition == setting.BOTTOM){
			//center on X
			centerPoint = new vector2D(0, 0)
			centerPoint.add(this.focusTo.position);

			
			objectCenter = new vector2D(0, 0)
			objectCenter.add(this.focusTo.size);
			objectCenter.times(0.5);

			centerPoint.add(objectCenter);
			

			this.position = centerPoint;
			this.position.x0-=(canvas.width/2)/this.zoomFactor
			//to the bottom on X
			this.position.x1 =-(this.canvas.height/this.zoomFactor)+(this.focusTo.position.x1 + this.focusTo.size.x1)
		}

		this.context.clearRect(0, 0, canvas.width, canvas.height)//clear the canvas

	}

	this.getScreenPosition = function(position){//translate a world position into a Screen position
		newPosition = new vector2D(0, 0);
		newPosition.add(position);
		newPosition.subtract(this.position);
		newPosition.times(this.zoomFactor);
		return newPosition;
	}
}


function vector2D(x0, x1){
	this.x0 = x0;
	this.x1 = x1;

	this.add = function(vector){
		this.x0 += vector.x0;
		this.x1 += vector.x1;
	}

	this.subtract = function(vector){
		this.x0 -= vector.x0;
		this.x1 -= vector.x1;	
	}

	this.times = function(scalar){
		this.x0*=scalar;
		this.x1*=scalar;
	}

	this.divided = function(scalar){
		this.x0/=scalar;
		this.x1/=scalar;
	}

	this.getString = function(){
		return "(" + this.x0 + "|" + this.x1 + ")";
	}

	this.copy = function(){
		newVector = new vector2D(0, 0);
		newVector.add(this);
		return newVector;
	}
}


idCount = -1;
function getAId(){//return a unique if for every gameobject or other stuff that need
	idCount++;
	return idCount;
}

function remove(array, element){
	var index = array.indexOf(element);
	if (index > -1) {
    	array.splice(index, 1);
	}
	return array;
}

setting = new Array();
setting.CENTER = 0;
setting.BOTTOM = 1;



// the components

function componentCollide(){

	this.init = function(){
		this.gpObject.addParameter("position",	new vector2D(0, 0));
		this.gpObject.addParameter("size", 		new vector2D(0, 0));

		this.gpObject.addParameter("onCollide", null);
	}

	this.draw = function(camera){
		if(this.gpObject.onCollide != null){ //don't even test if there is no collide function
			for (var i = 0; i < this.gpObject.scene.objectList.length; i++) {//check every object from the scene
				currentObject = this.gpObject.scene.objectList[i];
				if (this.gpObject.position.x0 < currentObject.position.x0 + currentObject.size.x0 &&
  					this.gpObject.position.x0 + this.gpObject.size.x0 > currentObject.position.x0 &&
   					this.gpObject.position.x1 < currentObject.position.x1 &&
   					this.gpObject.position.x1 + this.gpObject.size.x1 > currentObject.position.x1
   					) {
						this.gpObject.onCollide(currentObject);
					}
			};
		}
	}
}

function componentMovement(){

	this.init = function(){
		this.gpObject.addParameter("move",		new vector2D(0, 0));
		this.gpObject.addParameter("position",	new vector2D(0, 0));
	}

	this.draw = function(camera){ // width and height, movement etc

		ScreenPosition = camera.getScreenPosition(this.gpObject.position)
		camera.context.fillStyle = this.gpObject.color;

		//the movement
		currentMove = new vector2D(0, 0)
		currentMove.add(this.gpObject.move);
		currentMove.times(camera.deltaTime);
		this.gpObject.position.add(currentMove);
	};
}


function componentAdjustSize(){

	this.init = function(){
		this.gpObject.addParameter("size",	new vector2D(0, 0));

		this.gpObject.addParameter("image", 	null);
		this.gpObject.addParameter("fixWidth", 	true);
		this.gpObject.addParameter("fixHeight", true);
	}

	this.draw = function(camera){ // width and height

		if(this.gpObject.image != null){//if there is a Image
			//fit the size
			if(this.gpObject.fixWidth && !this.fixHeight){
				//fix width
				factor = this.gpObject.size.x0/this.gpObject.image.width;
				this.gpObject.size.x1 = factor*this.gpObject.image.height;
			}else if(!this.gpObject.fixWidth && this.gpObject.fixHeight){
				//fix height
				factor = this.gpObject.size.x1/this.gpObject.image.height;
				this.size.x0 = factor*this.gpObject.image.height;
			}
		}

	};
}

function componentBasicDraw(){
	this.init = function(){


		this.gpObject.addParameter("position",	new vector2D(0, 0));
		this.gpObject.addParameter("size", 		new vector2D(0, 0));

		this.gpObject.addParameter("color", 	"red");
		this.gpObject.addParameter("image", 	null);

		this.gpObject.addParameter("visible",	true);
	}

	this.draw = function(camera){
		if(this.gpObject.visible){
			ScreenPosition = camera.getScreenPosition(this.gpObject.position)

			if(this.gpObject.image != null){//if there is a Image
				camera.context.drawImage(this.gpObject.image, ScreenPosition.x0, ScreenPosition.x1, this.gpObject.size.x0*camera.zoomFactor, this.gpObject.size.x1*camera.zoomFactor);
			}else{
				camera.context.fillStyle = this.gpObject.color;
				camera.context.fillRect(ScreenPosition.x0, ScreenPosition.x1, this.gpObject.size.x0*camera.zoomFactor, this.gpObject.size.x1*camera.zoomFactor);
			}
		}
	}
}

function componentBackground(){

	this.init = function(){
		this.gpObject.addParameter("position",	new vector2D(0, 0));
		this.gpObject.addParameter("size", 		new vector2D(0, 0));

		this.gpObject.addParameter("color", 	"red");
		this.gpObject.addParameter("image", 	null);
	}

	this.draw = function(camera){

		screenSize = new vector2D(
			Math.floor(this.gpObject.size.x0*camera.zoomFactor)-1,
			Math.floor(this.gpObject.size.x1*camera.zoomFactor)-1)//the size the object has on the screen

		//how many tiles are needed to fill the canvas
		tiles = new vector2D((camera.canvas.width/screenSize.x0)+2,
		 (camera.canvas.height/screenSize.x1)+2);

		for (var x = -1; x < tiles.x0; x++) {
			for (var y = -1; y < tiles.x1; y++) {
				if(this.gpObject.image != null){//if there is a Image
					
					offsetX = camera.getScreenPosition(this.gpObject.position).x0%(screenSize.x0);
					offsetY = camera.getScreenPosition(this.gpObject.position).x1%(screenSize.x1);

					camera.context.drawImage(this.gpObject.image,
					 x*screenSize.x0 + offsetX, 
					 y*screenSize.x1 + offsetY, 
					 screenSize.x0+1, 
					 screenSize.x1+1);
				}else{
					camera.context.fillStyle = this.gpObject.color;
					camera.context.fillRect(
						x*screenSize.x0 + offsetX, 
						y*screenSize.x1 + offsetY, 
						screenSize.x0+1, 
						screenSize.x1+1);
				}
			};
		};

	}
}


function componentAdjustSizeGUI(){
	this.init = function(){
		this.gpObject.addParameter("position",	new vector2D(0, 0));
		this.gpObject.addParameter("size",		new vector2D(0, 0));

		this.gpObject.addParameter("positionUI",	new vector2D(0, 0));
		this.gpObject.addParameter("sizeUI",	new vector2D(0, 0));
	}

	this.draw = function(camera){

		//translate the screen position(in percent) to world position
		position = new vector2D(0, 0);
		position.add(this.gpObject.positionUI);


		position.x0 *= camera.canvas.width;	//to px values
		position.x1 *= camera.canvas.height;

		position.divided(camera.zoomFactor);

		position.add(camera.position);


		this.gpObject.position = position;


		//translate the screen width(in percent) to world width
		size = new vector2D(0, 0);
		size.add(this.gpObject.sizeUI);

		size.x0 *= camera.canvas.width;	//to px values
		size.x1 *= camera.canvas.height;

		size.divided(camera.zoomFactor);

		this.gpObject.size = size;
	}
}

function componentTextDraw(){
	this.init = function(){
		this.gpObject.addParameter("text", "");
		this.gpObject.addParameter("textSize", 12);
	}

	this.draw = function(camera){
		camera.context.fillStyle = "black"
		camera.context.font = this.gpObject.textSize + "px Arial";

		textPosition = camera.getScreenPosition(this.gpObject.position);
		textPosition.x1+=this.gpObject.textSize;

		camera.context.fillText(this.gpObject.text, textPosition.x0, textPosition.x1);
	}
}

function componentFadeIn(){
	this.init = function(){
		this.gpObject.addParameter("endColorRGB", [255, 255, 255]);
		this.gpObject.addParameter("fadeTime", 2000);
		this.gpObject.addParameter("startTime", 0);
		
		this.gpObject.addParameter("fadeIn", function(){
			this.visible = true;
			this.startTime = new Date().getTime();
		})

		this.gpObject.visible = false;


	}

	this.draw = function(camera){
		passedTime =  new Date().getTime() - this.gpObject.startTime;
		visibilityPercent = Math.min(1, passedTime/this.gpObject.fadeTime);
		this.gpObject.color = 
			"rgba(" + this.gpObject.endColorRGB[0] + 
				"," + this.gpObject.endColorRGB[1] + 
				"," + this.gpObject.endColorRGB[2] + 
				"," + visibilityPercent + ")";
		console.log(this.gpObject.color);
	}
}

