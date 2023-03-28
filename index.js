/* 
		/* ************************************************************************** /*
		/*                                ✨ Notes ✨                                /*
		/* ************************************************************************** /*

		    ---     For my own readability during development, for this project I'll be using
		            block comments (/*) for regular comments, and line comments (//) for
		            commented-out code


		/* ************************** 📝 Quick To-Do List 📝 *********************** /*

		!TODO :     🌟 FEATURE 🌟   - Animation on-click (Turn the laptop screen on and
		                            off in img2 on-click) 

		                            - Link door to another page containing a different room

		!TODO :     ❔ Instead of separate variables for width and height, use an object or
		            array to store the values

		!TODO :     ❕❕❕ Maybe use async/promise/listener/something to call the draw image
		            function when image loads (image onload) so it still works the same
		            but can be removed from the extract hex function
		            (single-responsibility principle)

					image.addEventListener('load', function() {
							console.log('Image loaded successfully!');
							// Code to execute after image has loaded
					});

		!TODO :     Figure out how to handle images with transparency. See what hex is
		            extracted on a fully transparent pixel.See if I can get the "a" value
		            (opacity value) from rgbToHex(). 

		!TODO :     Create a main "controller" function that calls the other functions

		!DONE :     If createGrid() and colourCodeGrid() can be removed from
		            DOMContentLoaded listener

		!DONE :     Put image display in it's own function (right now it's in
		            extractImageData() which breaks the single-responsibility principle)

		!DONE :     Clean up what I have so far. (Date: March 23 2023, 7:40pm)

		!DONE :     Remove blank canvas space, or use it to display the image that's being
		            div-if-ied

		!DONE :     Get image width/height and then pass it on to numColumns so the grid
		            is always the same size as the image. (in the future also make it so
		            the doesn't need to have an equal number of rows and columns. And even
		            later than that... lol... allow the user can choose the size of the
		            grid)

		!DONE :     Allow for more than a 26x26 grid (constrained by the alphabet). Maybe
		            I could use numbers instead? so they'd be labelled like: r1-c1, r1-c2,
		            r1-c3 r2-c1, r2-c2, r2-c3 r3-c1, r3-c2, r3-c3 (r for row and c for
		            column)

*/

/* ************************************************************************** */
/*                         🧱 Variables & Constants 🧱                       */
/* ************************************************************************** */

const imgSrc = "../images/book.png";
const cellWidth = 1; /* (px) - For 1 to 1 scale, set both to 1 */
const cellHeight = 1; /* (px) */

/* ************************************************************************** */
/*                    👂 DOMContentLoaded Event Listener 👂                   */
/* ************************************************************************** */

window.addEventListener("DOMContentLoaded", async (event) => {
	console.log("DOM content loaded.");

	//  imageData = { width: image.width, height: image.height, hexColours: hexArray };
	// let imageData = await extractImageData(imgSrc); // This was returning undefined before, but I fixed it with the async/await/promises
	const canvas = document.getElementById("canvas");
	const context = canvas.getContext("2d");

	await loadImage(imgSrc).then((image) => {
		drawImage(canvas, context, image);
	});

	let imageData = await extractImageData(canvas, context);

	createGrid(imageData.width, imageData.height);
	colourCodeGrid(imageData.width, imageData.height);

	// imageData = null; /* Comment/Uncomment to test */

	if (!imageData) {
		colourCodeGrid();
	} else {
		/* TODO: In the future, make this toggle a class on and off instead. It's neater. */
		const allCells = document.querySelectorAll(`[class*="cell"]`);
		allCells.forEach((element) => {
			element.style.border = `none`;
			element.classList.remove("labelled");
		});
		console.log("imageData: ", imageData);
		console.log("imageData.hexColours: ", imageData.hexColours);
		applyExtractedColoursToGrid(imageData.hexColours);
	}
});

/* ************************************************************************** */
/*      ✏️ drawImage(): Draws original input image on screen ✏️    */
/* ************************************************************************** */

function drawImage(canvas, context, image) {
	console.log(image.height + " " + image.width);

	canvas.width = image.width;
	canvas.height = image.height;

	context.drawImage(image, 0, 0, image.width, image.height);
}

/* ************************************************************************** */
/*    	    ⏳ loadImage(): Loads image for use in other functions ⏳         */
/* ************************************************************************** */

function loadImage(imgSrc) {
	return new Promise((resolve) => {
		const image = new Image();
		image.onload = () => {
			resolve(image);
		};
		image.src = imgSrc;
		console.log("loadImage() finished.");
	});
}

/* ************************************************************************** */
/*     ⛏️ extractImageData(): Get image data & add hex values to array ⛏️   */
/* ************************************************************************** */

async function extractImageData(canvas, context) {
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	// Using Uint32Array to improve performance
	const pixels = new Uint32Array(imageData.data);

	/*
				Extraction goes to left to right for each row of pixels, starting at the top
				left and moving down each row. That way it will correspond with the grid
				construction perfectly.
			*/
	let hexColours = [];
	for (let i = 0; i < pixels.length; i += 4) {
		const red = pixels[i];
		const green = pixels[i + 1];
		const blue = pixels[i + 2];
		const alpha = pixels[i + 3];
		const hexColor = rgbaToHex(red, green, blue, alpha);
		hexColours.push(hexColor);
		// console.log(hexColor);
	}

	// function rgbToHex(red, green, blue) {
	// 	const r = red.toString(16).padStart(2, "0");
	// 	const g = green.toString(16).padStart(2, "0");
	// 	const b = blue.toString(16).padStart(2, "0");
	// 	return "#" + r + g + b;
	// }

	function rgbaToHex(red, green, blue, alpha) {
		const r = red.toString(16).padStart(2, "0");
		const g = green.toString(16).padStart(2, "0");
		const b = blue.toString(16).padStart(2, "0");
		const a = alpha.toString(16).padStart(2, "0");
		return "#" + r + g + b + a;
	}

	let imageDataObj = {
		width: imageData.width,
		height: imageData.height,
		hexColours: hexColours,
	};
	return imageDataObj;
}

/* ************************************************************************** */
/*      🏗️ createGrid(): Create grid & add formulaic class/id labels 🏗️      */
/* ************************************************************************** */

/* create the grid cells */
function createGrid(width, height) {
	const numColumns = width;
	const numRows = height;
	const grid = document.createElement("div");
	grid.id = "grid";
	for (let i = 1; i <= numRows; i++) {
		const row = document.createElement("div");
		row.id = "row-" + i;
		row.className = "row";
		for (let j = 1; j <= numColumns; j++) {
			const cell = document.createElement("div");
			cell.className = "cell labelled r" + i + " " + "c" + j;
			cell.id = "c" + j + "-" + "r" + i;

			row.appendChild(cell);
		}
		grid.appendChild(row);
		row.style.gridTemplateColumns = `repeat(${numColumns}, auto)`;
	}
	document.body.appendChild(grid);
	const allCells = document.querySelectorAll(`[class*="cell"]`);
	allCells.forEach((element) => {
		element.style.width = `${cellWidth}px`;
		element.style.height = `${cellHeight}px`;
	});
}

/* ************************************************************************** */
/*     🌈 colourCodeGrid(): Add rainbow colour pattern to grid columns 🌈    */
/* ************************************************************************** */

/* 	
	!REFERENCE (querySelector):
	https://bobbyhadz.com/blog/javascript-get-element-by-id-contains
*/

/* Colouring divs with rainbow pattern for easier identification */
function colourCodeGrid(width, height) {
	const numColumns = width;
	const numRows = height;
	const allCells = document.querySelectorAll(`[class*="cell"]`);

	let count = 1;
	while (count < numColumns + 1) {
		let classVar = `"c${count}"`;
		const selectedCells = document.querySelectorAll(`[class$=${classVar}]`);
		// let colourNum = 1;
		selectedCells.forEach((element) => {
			let colourNum = count;

			if (colourNum > 10) {
				colourNum = (colourNum % 10) + 1;
			}

			// console.log("--------------🔽--------------");
			// console.inspect({ colourNum });
			// console.inspect({ count });
			// console.log("--------------🔼--------------");

			/* TODO: Why does this work up to 20???? */
			switch (colourNum) {
				case 1:
					element.style.border = `1px solid blue`;
					break;
				case 2:
					element.style.border = `1px solid aqua`;
					break;
				case 3:
					element.style.border = `1px solid green`;
					break;
				case 4:
					element.style.border = `1px solid lime`;
					break;
				case 5:
					element.style.border = `1px solid yellow`;
					break;
				case 6:
					element.style.border = `1px solid orange`;
					break;
				case 7:
					element.style.border = `1px solid red`;
					break;
				case 8:
					element.style.border = `1px solid pink`;
					break;
				case 9:
					element.style.border = `1px solid magenta`;
					break;
				case 10:
					element.style.border = `1px solid purple`;
					// colourNum = 1;
					break;
				default: {
					console.log("default switch break executing");
					break;
				}
			}
			colourNum++;
		});
		count++;
	}
}

/* ************************************************************************** */
/*      🎨 applyExtractedColoursToGrid(): Add hex values to grid cells 🎨    */
/* ************************************************************************** */

function applyExtractedColoursToGrid(hexArray) {
	const allCells = document.querySelectorAll(`[class*="cell"]`);
	allCells.forEach((element) => {
		element.style.backgroundColor = hexArray.shift();
	});
}

/* ************************************************************************** */
/*                         📜 Console Log Formatter 📜                       */
/* ************************************************************************** */

/*
    Fun console display so I don't lose my mind 😊 - I copied the original code for this and altered it to suit my needs
    SOURCE: https://medium.com/@MrWhy/console-log-big-emoji-507cfe9a2e6f
*/

/* Define your custom commands and emoji */
var commands = [
	["important", " ❗"],
	["issue", "⚠️"],
	["note", "📝"],
	["inspect", "🔎"],
	["damnit", "☠️"],
	["idea", "✨"],
	["todo", "📌"],
];

(function () {
	if (!window.console) return;
	/* Create custom commands */
	commands.forEach(function (command) {
		window.console[command[0]] = function () {
			/* Second argument is size, default is 11px */
			var size = 20;
			if (arguments.length > 1) {
				size = [].pop.call(arguments);
			}
			/* Get arguments as a string */
			var args = Array.prototype.slice
				.call(arguments)
				.toString()
				.split(",")
				.join(",");
			/* Log to the console with emoji */
			// console.log(arguments[0]);

			if (typeof arguments[0] === "object") {
				let objectName = Object.getOwnPropertyNames(arguments[0]).toString();

				console.log(
					"%c" +
						command[1] +
						"%c🔻%c" +
						" " +
						"Object: %c" +
						objectName +
						" " +
						Object.values(arguments[0]),
					"font-size: " + size + "px",
					"font-size: 80%",
					"font-size: 100%",
					"font-weight: bold"
				);
				console.log(arguments[0]);
			} else {
				console.log(
					"%c" + command[1] + "\t" + args,
					"font-size: " + size + "px"
				);
			}
		};
	});
})();

/* Examples */
// console.important("Fix immediately!");
// console.issue("Fix this later...", 20);
// console.note("Note to self...", 20);
// console.inspect("Let's see...", 20);
// console.damnit("Damnit!", 20);
// console.idea("I have an idea!", 20);
// console.todo("TODO: ", 20);

/* ************************************************************************** */
/*                              💼 Other Stuff 💼                             */
/* ************************************************************************** */

/*
	┌————————————————————————————————————————————————————————————————————————————————————————————┐
	│                                                                                            │
	│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
	│  ░░░░█████╗░░█████╗░██████╗░██╗██╗░░░░░░█████╗░████████╗░░░░░░░██████╗░░░░░██╗░█████╗░░░░  │
	│  ░░░██╔══██╗██╔══██╗██╔══██╗██║██║░░░░░██╔══██╗╚══██╔══╝░░░░░░██╔═══██╗░░░██╔╝██╔══██╗░░░  │
	│  ░░░██║░░╚═╝██║░░██║██████╔╝██║██║░░░░░██║░░██║░░░██║░░░░░░░░░██║██╗██║░░██╔╝░███████║░░░  │
	│  ░░░██║░░██╗██║░░██║██╔═══╝░██║██║░░░░░██║░░██║░░░██║░░░░░░░░░╚██████╔╝░██╔╝░░██╔══██║░░░  │
	│  ░░░╚█████╔╝╚█████╔╝██║░░░░░██║███████╗╚█████╔╝░░░██║░░░░░░░░░░╚═██╔═╝░██╔╝░░░██║░░██║░░░  │
	│  ░░░░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚══════╝░╚════╝░░░░╚═╝░░░░░░░░░░░░╚═╝░░░╚═╝░░░░╚═╝░░╚═╝░░░  │
	│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
	└————————————————————————————————————————————————————————————————————————————————————————————┘

	Q: What does %c do?
	A: %c is a CSS placeholder. It allows you to apply CSS to the text that follows it. The second argument is a string of CSS rules.

	Q: How do I initialize a node project?
	A: npm init 
*/

/* ************************************************************************** */
/*      🌈 Alt colourCodeGrid() that colours by row instead of column 🌈     */
/* ************************************************************************** */

// function colourCodeGrid() {
// 	const allCells = document.querySelectorAll(`[class*="cell"]`);

// 	let count = 1;
// 	while (count < numColumns + 1) {
// 		let classVar = `"_${count}"`;
// 		const selectedCells = document.querySelectorAll(`[class$=${classVar}]`);
// 		let colourNum = 1;
// 		selectedCells.forEach((element) => {
// 			// var colourNum = count;

// 			if (colourNum == 11) {
// 				colourNum = 1;
// 			}

// 			switch (colourNum) {
// 				case 1:
// 					element.style.border = `1px solid blue`;
// 					break;
// 				case 2:
// 					element.style.border = `1px solid aqua`;
// 					break;
// 				case 3:
// 					element.style.border = `1px solid green`;
// 					break;
// 				case 4:
// 					element.style.border = `1px solid lime`;
// 					break;
// 				case 5:
// 					element.style.border = `1px solid yellow`;
// 					break;
// 				case 6:
// 					element.style.border = `1px solid orange`;
// 					break;
// 				case 7:
// 					element.style.border = `1px solid red`;
// 					break;
// 				case 8:
// 					element.style.border = `1px solid pink`;
// 					break;
// 				case 9:
// 					element.style.border = `1px solid magenta`;
// 					break;
// 				case 10:
// 					element.style.border = `1px solid purple`;
// 					colourNum = 1;
// 					break;
// 				default: {
// 					console.log("default switch break executing");
// 					break;
// 				}
// 			}
// 			colourNum++;
// 		});
// 		count++;
// 	}
// }
