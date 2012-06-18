Tetris = (function() {

var scale = 24;
var width = 10;
var height = 20;

var speed = 1000;

var $ = function(id) {return document.getElementById(id)};
var dc = function(tag) {return document.createElement(tag)};

var levels = [
	{p:500, s:1000, bg:"sun.jpg"},
	{p:1000, s:700, bg:"mercury.jpg"},
	{p:2000, s:500, bg:"venus.jpg"},
	{p:5000, s:400, bg:"earth.jpg"},
	{p:10000, s:300, bg:"mars.jpg"},
	{p:25000, s:200, bg:"jupiter.jpg"},
	{p:50000, s:150, bg:"saturn.jpg"},
	{p:100000, s:100, bg:"uranus.jpg"},
	{p:250000, s:75, bg:"neptune.jpg"}
];

var game;
var paused = false;
var running = false;
var activePiece;
var activePieceType = -1;
var nextPieceType = -1;
var activeRot = 0;
var field = [];
var fieldRows = [];
var level = 0;
var score = 0;

var lineScore = [30,120,270,520];
var lines = 0;

var curX = 0;
var curY = 0;
var timer = 0;


function init() {
	game = $("gamefield");

	updateGameInfo();

	registerEvents();

	if (location.search) {
		loadGame(decodeURIComponent(location.search.substring(1)));
	} else {
		splash();
	}
}

function clearField() {
	game.innerHTML = "";
	fieldRows = [];
	for (var y=0;y<height;y++) {
		var row = dc("div");
		row.style.position = "absolute";
		row.style.top = y*scale+"px";
		row.style.left = "0px";
		row.style.width = width*scale+"px";
		row.style.height = scale+"px";
		fieldRows[y] = row;
		game.appendChild(row);

		field[y] = [];
		for (var x=0;x<width;x++) {
			field[y][x] = 0;
		}
	}
}

function splash() {
}

function registerEvents() {
	addEvent($('tetris'), "keydown", onKeyDown);
}

function addEvent(el, event, handler) {
	if (el.addEventListener)
		el.addEventListener(event, handler, false); 
	else if (el.attachEvent)
		el.attachEvent("on" + event, handler); 
}

function onKeyDown(e) {
	e = e || window.event;
	var keyCode = e.which || e.keyCode;
//console.log(keyCode);
	switch (keyCode) {
		case 13: // enter
			dropPiece();
			break;
		case 32: // space
			if (!running) {
				startGame();
				return;
			}
		case 38: // up
			rotateActivePiece();
			break;
		case 39: // left
			moveActivePiece(1, 0);
			break;
		case 37: // right
			moveActivePiece(-1, 0);
			break;
		case 40: // down
			moveActivePiece(0, 1);
			break;
		case 83 :
			saveGame();
			break;
		/*
		case 76:
			loadGame("{f:\"00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033300000000300000\",p:{x:3,y:1,r:0,t:1}}");
			break;
		*/
		case 80:
			togglePause();
		default : 
			return false;
	}
	if (e.preventDefault)
		e.preventDefault();
	return true;
}

function dropPiece() {
	for (var y=0;y<height;y++) {
		if (!moveActivePiece(0, 1))
			break;
	}
}

function menu() {
}



function startGame() {
	speed = levels[level].s;
	clearField();
	updateGameInfo();

	//createPiece();
	running = true;
	nextCycle();
}

function cycle() {
	if (running) {
		if (!paused) {
			if (!activePiece) {
				activePieceType = nextPieceType > -1 ? nextPieceType : Math.floor(Math.random() * basePieces.length);
				activePiece = createPiece(activePieceType);
				activeRot = 0;
				curX = Math.floor(width/2-2);
				curY = 0;
				rebuildPiece(activePiece, activePieceType, activeRot);
				game.appendChild(activePiece);
	
				if (!canMoveTo(curX, curY)) {
					gameOver();
					return;
				}

				nextPieceType = Math.floor(Math.random() * basePieces.length);
				updateNextPiece();
				moveActivePiece(0,0);
			} else {
				moveActivePiece(0,1);
			}
		}
		nextCycle();
	}
}

function nextCycle() {
	clearTimeout(timer);
	timer = setTimeout(cycle, speed);
}

function togglePause() {
	paused = !paused;
	if (paused) {
		// show pause text
	} else {
		// hide pause text
	}
}

function gameOver() {
	running = false;
	activePiece = null;
}

function rotateActivePiece() {
	if (!activePiece) return;
	if (paused || !running) return;

	activeRot++;
	if (activeRot > 3) activeRot = 0;
	if (canMoveTo(curX, curY)) {
		rebuildPiece(activePiece, activePieceType, activeRot);
	} else {
		activeRot--;
		if (activeRot < 0) activeRot = 3;
	}
}

function moveActivePiece(addX, addY) {
	if (!activePiece) return;
	if (paused || !running) return;

	var newX = curX + addX;
	var newY = curY + addY;
	if (canMoveTo(newX, newY)) {
		curX = newX;
		curY = newY;
		activePiece.style.left = curX*scale+"px";
		activePiece.style.top = curY*scale+"px";
		return true;
	} else {
		if (addY > 0) { // moving down
			landPiece();
			activePiece = null;
		}
	}
	return false;
}

function landPiece() {
	var pieceDesc = basePieces[activePieceType];
	for (var i=0;i<pieceDesc.length;i++) {
		for (var j=0;j<pieceDesc.length;j++) {
			(function() {
			if (pieceDesc[i][j]) {
				var px = rotateX(j,i,pieceDesc.length,activeRot);
				var py = rotateY(j,i,pieceDesc.length,activeRot);
				var block = activePiece.blocks[py][px];
				activePiece.removeChild(block);
				fieldRows[curY+py].appendChild(block)
				block.style.left = (curX+px)*scale+"px";
				block.style.top = "0px";
				field[curY + py][curX + px] = activePieceType+1;
			}
			})();
		}
	}
	game.removeChild(activePiece);
	setTimeout(checkRows, 50);
	nextCycle();
}

function checkRows() {
	var fullRows = [];
	for (var y=0;y<height;y++) {
		var rowFull = true;
		for (var x=0;x<width;x++) {
			if (!field[y][x])
				rowFull = false;
		}
		if (rowFull) {
			fullRows.push(y);
		}
	}

	if (fullRows.length) {
		score += lineScore[fullRows.length-1]*(level+1);
		lines += fullRows.length;
		updateGameInfo();
		checkLevel();
	}

	for (var i=0;i<fullRows.length;i++) {
		var copyField = [];
		var copyRows = [];
		for (var y=0;y<height;y++) {
			copyField[y] = [];
			copyRows[y] = fieldRows[y].innerHTML;
			for (var x=0;x<width;x++) {
				copyField[y][x] = field[y][x];
			}
		}

		fieldRows[fullRows[i]].innerHTML = "";
		for (var y=fullRows[i];y>=0;y--) {
			fieldRows[y].innerHTML = copyRows[y-1]||"";
			for (var x=0;x<width;x++) {
				field[y][x] = y > 0 ? copyField[y-1][x] : 0;
			}
		}
	}
	
}

function updateGameInfo() {
	$("tetris-score-text").innerHTML = "Score: " + score;
	$("tetris-lines-text").innerHTML = "Lines: " + lines;
	$("tetris-level-text").innerHTML = "Level: " + (level+1);
}

function checkLevel() {
	if (levels[level]) {
		if (score >= levels[level].p) {
			level++;
			speed = levels[level].s;
			updateGameInfo();
		}
	}
}

function canMoveTo(x,y) {
	var pieceDesc = basePieces[activePieceType];
	for (var i=0;i<pieceDesc.length;i++) {
		for (var j=0;j<pieceDesc.length;j++) {
			if (pieceDesc[i][j]) {
				var px = rotateX(j,i,pieceDesc.length,activeRot);
				var py = rotateY(j,i,pieceDesc.length,activeRot);
				if (isBlocked(x+px, y+py))
					return false;
			}
		}
	}
	return true;
}

function isBlocked(x,y) {
	if (x < 0 || y < 0) return true;
	if (x >= width || y >= height) return true;
	return field[y][x];
}

function nextLevel() {
}

var basePieces = [
	[
		[0,1,0,0],	// I
		[0,1,0,0],
		[0,1,0,0],
		[0,1,0,0]
	],
	[
		[0,0,1],	// J
		[0,0,1],
		[0,1,1]
	],
	[
		[1,1,1],	// T
		[0,1,0],
		[0,0,0]
	],
	[
		[1,0,0],	// L
		[1,0,0],
		[1,1,0]
	],
	[
		[1,1],		// O
		[1,1]
	],
	[
		[0,1,1],	// Z
		[1,1,0],
		[0,0,0]
	],
	[
		[1,1,0],	// S
		[0,1,1],
		[0,0,0]
	]
];

var pieceColors = ["#00f0f0", "#0000f0", "#a000f0", "#f0a000", "#f0f000", "#f00000", "#00f000"];

function createPiece(pieceType) {



	var pieceDesc = basePieces[pieceType];

	var div = dc("div");
	div.style.position = "absolute";
	div.style.top = curY*scale + "px";
	div.style.left = curX*scale + "px";
	div.style.width = pieceDesc.length*scale + "px";
	div.style.height = pieceDesc.length*scale + "px";

	return div;
}

function updateNextPiece() {
	var div = $("tetris-next-piece");
	div.innerHTML = "";
	var piece = createPiece(nextPieceType);
	var rot = 0;
	piece.style.left = "48px";
	piece.style.top = "24px";
	switch (nextPieceType) {
		case 0:
			rot = 1;
			piece.style.top = "0px";
			break;
		case 2:
			rot = 3;
			break;
		case 3:
		case 4:
			piece.style.left = "72px";
			break;
		case 5:
		case 6:
			rot = 1;
			piece.style.left = "72px";
			break;
		default:
	}
	rebuildPiece(piece, nextPieceType, rot);
	div.appendChild(piece);
}

function rebuildPiece(div, pieceType, rot) {
	div.innerHTML = "";
	var pieceDesc = basePieces[pieceType];
	div.blocks = [];
	for (var i=0;i<pieceDesc.length;i++)
		div.blocks[i] = [];
	for (var i=0;i<pieceDesc.length;i++) {
		for (var j=0;j<pieceDesc.length;j++) {
			if (pieceDesc[i][j]) {
				var px = rotateX(j,i,pieceDesc.length, rot);
				var py = rotateY(j,i,pieceDesc.length, rot);
				var block = createBlock(pieceColors[pieceType],px,py,pieceDesc.length);
				div.appendChild(block);
				div.blocks[py][px] = block;
			}
		}
	}
}

function rotateX(j,i,size, rot) {
	switch (rot) {
		case 0:
			var px = j; break;
		case 1:
			var px = i; break;
		case 2:
			var px = (size-1)-j; break;
		case 3:
			var px = (size-1)-i; break;
	}
	return px;
}

function rotateY(j,i,size, rot) {
	switch (rot) {
		case 0:
			var py = i; break;
		case 1:
			var py = (size-1)-j; break;
		case 2:
			var py = (size-1)-i; break;
		case 3:
			var py = j;break;
	}
	return py;
}


function createBlock(color,x,y) {
	var div = dc("div");
	div.className = "tetris-block";
	div.style.backgroundColor = color;
	div.style.borderColor = color;

	div.style.left = x*scale + "px";
	div.style.top = y*scale + "px";

	return div;
}

function serialize() {
	var fieldString = "\"";
	for (var y=0;y<height;y++) {
		for (var x=0;x<width;x++) {
			fieldString += field[y][x];
		}
	}
	fieldString += "\"";

	var pieceString  = "{"
		+ "x:"+curX+",y:"+curY+",r:"+activeRot+",t:"+activePieceType
	+ "}";

	var gameString = "{"
		+ "f:" + fieldString + ","
		+ "p:" + pieceString + ","
		+ "n:" + nextPieceType + ","
		+ "s:" + score + ","
		+ "v:" + level + ","
		+ "l:" + lines
	+ "}";
	return gameString;
}

function loadGame(gameString) {
	clearField();
	// TODO: Fix this.
	var oldGame = eval("("+gameString+")");
	var f = oldGame.f.split("");
	var p = oldGame.p;
	for (var y=0;y<height;y++) {
		for (var x=0;x<width;x++) {
			field[y][x] = parseInt(f.shift(),10);
			if (field[y][x]) {
				var block = createBlock(pieceColors[field[y][x]-1],x,0);
				fieldRows[y].appendChild(block);
			}
		}
	}

	activeRot = p.r;
	curX = p.x;
	curY = p.y;
	activePieceType = p.t;

	nextPieceType = oldGame.n;
	score = oldGame.s;
	level = oldGame.v;
	lines = oldGame.l;
	speed = levels[level].s;

	updateGameInfo();
	updateNextPiece();

	activePiece = createPiece(activePieceType);
	rebuildPiece(activePiece, activePieceType, activeRot);
	curY = p.y;
	curX = p.x;

	activePiece.style.top = curY*scale + "px";
	activePiece.style.left = curX*scale + "px";
	game.appendChild(activePiece);


	if (!running) {
		running = true;
		nextCycle();
	}
}

window.__json_callbacks = {};
var jsonCallCount = 0;

function callJSON(url, callback) {
	jsonCallCount++;
	var script = document.createElement("script");
	window.__json_callbacks["fn_" + jsonCallCount] = function(response) {
		document.body.removeChild(script);
		if (callback)
			callback(response);
	}
	script.setAttribute("type", "text/javascript");
	document.body.appendChild(script);
	script.src = url + "&callback=__json_callbacks.fn_" + jsonCallCount;
}

function saveGame() {
	if (!running) return;

	var wasPaused = paused;
	paused = true;
	var gameString = serialize();
	var url = "http://www.nihilogic.dk/labs/tetris/?" + encodeURIComponent(gameString);
	callJSON(
		"http://json-tinyurl.appspot.com/?url=" + encodeURIComponent(url),
		function(res) {
			if (res.ok) {
				prompt("Your game has been saved. Go to this URL to load the game whenever you please:", res.tinyurl);
			} else {
				alert("Oops. Something went wrong when trying to save the game!");
			}
			paused = wasPaused;
		}
	);
}


return init;

})();
console.warn('Starting game');
Tetris();
