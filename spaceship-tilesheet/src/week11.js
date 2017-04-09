var _stage = document.getElementById("stage");
var _canvas = document.querySelector("canvas");
var surface = _canvas.getContext("2d"); // d is lowercase!

const ROWS = 6;
const COLS = 8;
const SIZE = 100;
const SCROLL = 5;

_canvas.width = COLS*SIZE;
_canvas.height = ROWS*SIZE;

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

var map = []; // = new Array(ROWS);
var player = {x:SIZE*2, y:SIZE*3, speed:10, 
              dX:0, dY:0, image:null};
var missile = {x: 51, y: 51, speed: 50, image:null};
 // 30fps


initGame();
var uIval = setInterval(update, 33.34);
function initGame()
{
	var pImage = new Image();
	pImage.src = "../img/ship.png";
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
			tempTile.image.src = "../img/asteroids.png";
			map[row][col] = tempTile;
		}
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
		default:
				console.log("Unhandled key.");
				break;
	}
}

function update() // Going to run 30fps
{
	movePlayer();
	scrollMap();
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

function scrollMap()
{
			//console.log(map.length);


	

if(map[map.length-1][0].y >= 600)
		{
			
			//console.log(map[0][0].y);
			
			

			//map.push(a);
			var temparr = [];
			
			for(var p = 0; p< map[0].length; p++)
			{

				var tempTile = { x: p*SIZE, y:-1*SIZE, image:null };
			
			tempTile.image = new Image();// Temp line.
			tempTile.image.src = "../img/Asteroids.png";
			
			temparr[p] = tempTile;
			
			}
			map.unshift(temparr);
			//console.log(map.length);
			map.pop();

		//console.log(map[map.length-1], map.length);
		
		
		
	}
	for (var row = 0; row <map.length; row++)
	{
		for (var col = 0; col < map[0].length; col++)
		{
			map[row][col].y += SCROLL;
		}
	}
}

function render()
{
	
	surface.clearRect(0, 0, _canvas.width, _canvas.height); // x, y, w, h
	// Render map...
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













