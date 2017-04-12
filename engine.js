function game(canvas){

	this.sceneList		= new Array();
	this.activeScene	= 0;

	this.canvas 	= canvas;
	this.context	= this.canvas.getContext("2d");

	//set the canvas style
	this.canvas.style.position 	= "absolute";
	this.canvas.style.top 		= "0px";
	this.canvas.style.left 		= "0px";


	this.update = function(){//handle for example the draw call
		deltaTime = 1000/30;

		//make the canvas fit the window
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		//update the current scene
		this.sceneList[this.activeScene].draw(this.canvas, this.context, deltaTime);
	}

	this.addScene = function(scene){
		scene.id = this.sceneList.length;
		this.sceneList.push(scene);
	}


}


function scene(camera){

	this.camera = camera;

	this.objectList = new Array();

	this.addGPObject = function(gpObject){
		this.objectList.push(gpObject);
	}

	this.draw = function(canvas, context, deltaTime){
		this.camera.update(canvas, context, deltaTime);
		for (var i = 0; i < this.objectList.length; i++) {
			this.objectList[i].draw(this.camera);
		};
	}

}


function gpObject(){//graphical physical Object
	this.position 	= new vector2D(0, 0);
	this.size  		= new vector2D(0, 0);
	this.color 		= "red"

	this.image = null;
	this.fixWidth = true;
	this.fixHeight = true;//should the object fit the Image

	this.move = new vector2D(0, 0)

	this.draw = function(camera){
		ScreenPosition = camera.getScreenPosition(this.position)
		camera.context.fillStyle = this.color;

		//the movement
		currentMove = new vector2D(0, 0)
		currentMove.add(this.move);
		currentMove.times(camera.deltaTime);
		this.position.add(currentMove)

		if(this.image != null){//if there is a Image
			//fit the size
			if(this.fixWidth && !this.fixHeight){
				//fix width
				factor = this.size.x0/this.image.width;
				this.size.x1 = factor*this.image.height;
			}else if(!this.fixWidth && this.fixHeight){
				//fix height
				factor = this.size.x1/this.image.height;
				this.size.x0 = factor*this.image.height;
			}
			camera.context.drawImage(this.image, ScreenPosition.x0, ScreenPosition.x1, this.size.x0*camera.zoomFactor, this.size.x1*camera.zoomFactor);
		}else{
			camera.context.fillRect(ScreenPosition.x0, ScreenPosition.x1, this.size.x0*camera.zoomFactor, this.size.x1*camera.zoomFactor);
		}
	}
}


function camera(){
	this.zoomFactor = 1;
	this.position = new vector2D(0, 0);

	this.canvas		= null;
	this.context 	= null;

	this.centerTo = null; //if a gpObject should always in the middle of the window

	this.deltaTime = 0;

	this.ZoomInToFitWithOf = null;

	this.update = function(canvas, context, deltaTime){
		this.canvas		= canvas;
		this.context 	= context;
		this.deltaTime	= deltaTime;

		if(this.ZoomInToFitWithOf != null){//zoom in
			this.zoomFactor = this.canvas.width/this.ZoomInToFitWithOf;
		}

		if(this.centerTo != null){//center the camera
			centerPoint = new vector2D(0, 0)
			centerPoint.add(this.centerTo.position);

			
			objectCenter = new vector2D(0, 0)
			objectCenter.add(this.centerTo.size);
			objectCenter.times(0.5);

			centerPoint.add(objectCenter);
			//centerPoint.divided(this.zoomFactor)
			

			this.position = centerPoint;
			this.position.add(new vector2D( -(canvas.width/2)/this.zoomFactor, -(canvas.height/2)/this.zoomFactor ));

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

 
}

