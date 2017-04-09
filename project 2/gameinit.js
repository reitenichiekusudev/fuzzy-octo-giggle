var canvas = document.getElementById("mycanvas")
var _stage = document.getElementById("stage");
var surface = canvas.getContext("2d"); // d is lowercase!


const ROWS = 6;
const COLS = 8;
const SIZE = 100;
const SCROLL = 5;
const BGWIDTH = 700;
const BGHEIGHT = 600;



canvas.width = COLS*SIZE;
canvas.height = ROWS*SIZE;

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var missilefired = false;
var spacePressed= false;

var map = []; // = new Array(ROWS);
var bg = [];
var missilearr = [];
var player = {x:SIZE*2, y:SIZE*3, speed:10, 
              dX:0, dY:0, image:null};

 // 30fps

initGame();
var uIval = setInterval(update, 33.34);
function initGame()
{
	var pImage = new Image();
	pImage.src = "assets/ship.png";
	player.image = pImage;
	generateMap();
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}

function generateMap()
{
	for (var row = 0; row < ROWS+1; row++) // Run 6 times for each row
	{
		map[row] = []; // = new Array(COLS+1);
		for (var col = 0; col < COLS; col++) // Runs 9 times for each col
		{
			var tempTile = { x:col*SIZE, y:(row-1)*SIZE, image:null };
			tempTile.image = new Image();// Temp line.
			tempTile.image.src = "assets/Blank.png";
			map[row][col] = tempTile;
		}
	}
	for (var p = 0; p<3; p ++)
	{
		var tempbg = {x: 0, y: (p-1)*BGHEIGHT, image: null };
		tempbg.image = new Image();
		tempbg.image.src = "assets/stars.jpg";
		bg[p] = tempbg;
	}

}

function onKeyDown(event)
{
	switch(event.keyCode)
	{
		case 37: // Left.
				if ( leftPressed == false )
					leftPressed = true;
				break;
		case 39: // Right.
				if ( rightPressed == false )
					rightPressed = true;
				break;
		case 38: // Up.
				if ( upPressed == false )
					upPressed = true;
				break;
		case 40: // Down.
				if ( downPressed == false )
				downPressed = true;
				break;
		case 32: //space
				if (spacePressed = false)
				spacePressed = true;
				break;
		default:
				console.log("Unhandled key.");
				break;
	}
}

function onKeyUp(event)
{
	switch(event.keyCode)
	{
		case 37: // Left.
				leftPressed = false;
				break;
		case 39: // Right.
				rightPressed = false;
				break;
		case 38: // Up.
				upPressed = false;
				break;
		case 40: // Down.
				downPressed = false;
				break;
		case 32: //space
				spacePressed = false;
				break;
		default:
				console.log("Unhandled key.");
				break;
	}
}

function update() // Going to run 30fps
{
	movePlayer();
	scrollMap();
	
	if (spacePressed == true)
	missileconstructor();
	missilemover(missilearr);
	// move enemies
	// collision check
	// animate sprites
	render();
}

function movePlayer()
{
	if ( leftPressed == true && player.x > SIZE/2 ) 
		player.x -= player.speed; 
	if ( rightPressed == true && player.x < 800 - SIZE/2 )
		player.x += player.speed;
	if ( upPressed == true && player.y > SIZE/2)
		player.y -= player.speed;
	if ( downPressed == true && player.y < 600 - SIZE/2)
		player.y += player.speed;
}

function missileconstructor()
{
	
	
		var missile = {x: player.x+SIZE/2, y: player.y+30, speed: 30, image:null};
		missilearr.push(missile);
	
}
function missilemover(missile)
{
	for(var m = 0; m<missile.length; m++)
	{
		missile[m].y += missile[m].speed;
	}

}

function scrollMap()
{
			
if(map[map.length-1][0].y >= 600)
		{
			var temparr = [];			
			for(var p = 0; p< map[0].length; p++)
			{
				var rngg = Math.floor((Math.random()*10)+1);
				var tempTile = { x: p*SIZE, y:-1*SIZE, image:null };			
			tempTile.image = new Image();// Temp line.
			if(rngg === 1)
			tempTile.image.src = "assets/asteroids.png";
			else
			tempTile.image.src = "assets/Blank.png";			
			temparr[p] = tempTile;
			}
			map.unshift(temparr);
			//console.log(map.length);
			map.pop();

		//console.log(map[map.length-1], map.length);
		
					
			
		
	}

if(bg[0].y >= 0)
{

				var tempTile2 = { x: 0, y:-1*BGHEIGHT, image:null };			
			tempTile2.image = new Image();// Temp line.
			tempTile2.image.src = "assets/stars.jpg";			
			
			
			bg.unshift(tempTile2);
			//console.log(map.length);
			bg.pop();
}



	for (var row = 0; row <map.length; row++)
	{
		for (var col = 0; col < map[0].length; col++)
		{
			map[row][col].y += SCROLL;
		}
	}
	for (var l = 0; l< 3; l++)
	{
		bg[l].y += SCROLL;
	}
}



function render()
{
	
	surface.clearRect(0, 0, canvas.width, canvas.height); // x, y, w, h
	// Render map...
	for(var y = 0; y<3; y++)
	{
		if(bg[y].image !== null)
			surface.drawImage(bg[y].image, bg[y].x, bg[y].y);
	}
	for (var row = 0; row < map.length; row++)
	{
		//console.log(map.length);
		for (var col = 0; col < map[0].length; col++)
		{
			if (map[row][col].image !== null)
				surface.drawImage(map[row][col].image,
								  map[row][col].x,
								  map[row][col].y);
		}
	}
	
	// Render player...
	surface.drawImage(player.image,player.x-SIZE/2,player.y-SIZE/2);
}

