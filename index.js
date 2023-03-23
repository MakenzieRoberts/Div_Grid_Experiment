// // TODO: Clean up what I have so far.

// create the grid container
const grid = document.createElement("div");
grid.id = "grid";
const row = document.querySelector(".row");
// const cell = document.querySelector(".cell");
const numColumns = 64; // Must be equal to the image's width/height (in pixels). The image must have the same width and height (ex. 64x64) - for now. In the future, I'll make it so the grid can be any size, and the image will be scaled to fit the grid.
// TODO: instead of separate variables for width and height, use an object or array to store the values
const cellWidth = 4; // (px) - For 1 to 1 scale, set both to 1
const cellHeight = 4; // (px)

// TODO: get image width/height and then pass it on to numColumns so the grid is always the same size as the image. (in the future also make it so the grid doesn't need to have an equal number of rows and columns. And even later than that... lol... allow the user can choose the size of the grid)
// TODO: allow for more than a 26x26 grid (constrained by the alphabet). Maybe I could use numbers instead? so they'd be labelled like:
// 1-1, 1-2, 1-3
// 2-1, 2-2, 2-3
// 3-1, 3-2, 3-3
// TODO: Remove blank canvas space, or use it to display the image that's being div-if-ied
// ******** ▼ **** ▼ **** ▼ ****** CANVAS TEST ****** ▼ **** ▼ **** ▼ *******

// const canvas = document.createElement("canvas");
// const context = canvas.getContext("2d");
// const image = new Image();

// image.onload = function () {
// 	console.log(image.height + " " + image.width);
// 	canvas.width = image.width;
// 	canvas.height = image.height;
// 	context.drawImage(image, 0, 0, image.width, image.height);
// 	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
// 	const pixels = imageData.data;
// 	let hexColours = [];
// 	for (let i = 0; i < pixels.length; i += 4) {
// 		const red = pixels[i];
// 		const green = pixels[i + 1];
// 		const blue = pixels[i + 2];
// 		const alpha = pixels[i + 3];
// 		const hexColor = rgbToHex(red, green, blue);
// 		// Do something with the hex color value
// 		hexColours.push(hexColor);
// 		// console.log(hexColor);
// 	}
// 	// function getHexColours(array) {
// 	// 	return hexColours;
// 	// }
// 	// console.log(hexColours);
// 	// console.log(getHexColours(hexColours));
// 	const finalHexArray = hexColours;
// };

// image.src = "../images/img2.png";

// function rgbToHex(red, green, blue) {
// 	const r = red.toString(16).padStart(2, "0");
// 	const g = green.toString(16).padStart(2, "0");
// 	const b = blue.toString(16).padStart(2, "0");
// 	return "#" + r + g + b;
// }
// ******** ▲ **** ▲ **** ▲ ****** CANVAS TEST ****** ▲ **** ▲ **** ▲ *******

// // create the grid cells
// for (let i = 0; i < numColumns; i++) {
// 	const row = document.createElement("div");
// 	row.id = "row-" + String.fromCharCode(97 + i);
// 	row.className = "row";
// 	for (let j = 1; j <= numColumns; j++) {
// 		const cell = document.createElement("div");
// 		cell.className = "cell " + String.fromCharCode(97 + i) + " " + "_" + j;
// 		cell.id = String.fromCharCode(97 + i) + j.toString();
// 		row.appendChild(cell);
// 		// if cell.id

// 		// cell.style.border = `1px solid aqua`;
// 	}
// 	grid.appendChild(row);
// 	row.style.gridTemplateColumns = `repeat(${numColumns}, auto)`;
// }

// // !REFERENCE (querySelector): https://bobbyhadz.com/blog/javascript-get-element-by-id-contains

// Colouring divs with rainbow pattern for easier identification
// window.addEventListener("DOMContentLoaded", (event) => {
// 	console.log("DOM fully loaded and parsed");
// 	const allCells = document.querySelectorAll(`[class*="cell"]`);

// 	let count = 1;
// 	while (count < numColumns + 1) {
// 		let classVar = `"_${count}"`;
// 		const selectedCells = document.querySelectorAll(`[class$=${classVar}]`);
// 		selectedCells.forEach((element) => {
// 			var colourNum = count;
// 			if (colourNum > 10) {
// 				colourNum -= 10;
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
// 		});
// 		count++;
// 	}
// });

// // append the grid to the body
// document.body.appendChild(grid);

// Putting grid stuff in it's own function
async function extractHexColours() {
	const canvas = document.getElementById("canvas");
	const context = canvas.getContext("2d");

	const image = new Image(); // Using optional size for image

	// Load an image of intrinsic size 300x227 in CSS pixels
	image.src = "../images/img2.png";

	// image.onload = drawImageActualSize; // Draw when image has loaded

	function drawImageActualSize() {
		// Use the intrinsic size of image in CSS pixels for the canvas element
		canvas.width = this.naturalWidth;
		canvas.height = this.naturalHeight;

		// Will draw the image as 300x227, ignoring the custom size of 60x45
		// given in the constructor
		context.drawImage(this, 0, 0);

		// // To use the custom size we'll have to specify the scale parameters
		// // using the element's width and height properties - lets draw one
		// // on top in the corner:
		// context.drawImage(this, 0, 0, this.width, this.height);
	}
	const hexArray = await new Promise((resolve) => {
		image.onload = async function () {
			// When image has loaded, draw it to canvas
			drawImageActualSize; // This function uses the 'this' keyword, so we need to call it like this. TODO: Get more familiar with the intricacies of the 'this' keyword

			console.log(image.height + " " + image.width);

			canvas.width = image.width;
			canvas.height = image.height;

			context.drawImage(image, 0, 0, image.width, image.height);
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			const pixels = imageData.data;

			let hexColours = [];
			for (let i = 0; i < pixels.length; i += 4) {
				const red = pixels[i];
				const green = pixels[i + 1];
				const blue = pixels[i + 2];
				const alpha = pixels[i + 3];
				const hexColor = rgbToHex(red, green, blue);
				// Do something with the hex color value
				hexColours.push(hexColor);
				// console.log(hexColor);
			}
			resolve(hexColours);
			// function getHexColours(array) {
			// 	return hexColours;
		};
	});

	function rgbToHex(red, green, blue) {
		const r = red.toString(16).padStart(2, "0");
		const g = green.toString(16).padStart(2, "0");
		const b = blue.toString(16).padStart(2, "0");
		return "#" + r + g + b;
	}

	console.log(hexArray);
	return hexArray;
}

window.addEventListener("DOMContentLoaded", async (event) => {
	console.log("DOM fully loaded and parsed");
	let hexArray = await extractHexColours(); // This was returning undefined before, but I fixed it with the async/await/promises
	console.log(hexArray);
	createGrid();
	colourCodeGrid();
	// hexArray = null;
	if (!hexArray) {
		colourCodeGrid();
	} else {
		// TODO: In the future, make this toggle a class on and off instead. It's neater.
		const allCells = document.querySelectorAll(`[class*="cell"]`);
		allCells.forEach((element) => {
			element.style.border = `none`;
			element.classList.remove("labelled");
		});

		applyExtractedColoursToGrid(hexArray);
	}

	function applyExtractedColoursToGrid(hexArray) {
		const allCells = document.querySelectorAll(`[class*="cell"]`);
		allCells.forEach((element) => {
			element.style.backgroundColor = hexArray.shift();
		});
	}

	// function hexColourExtraction() {
	// 	const canvas = document.createElement("canvas");
	// 	const context = canvas.getContext("2d");
	// 	const image = new Image();

	// 	image.onload = async function () {
	// 		console.log(image.height + " " + image.width);
	// 		canvas.width = image.width;
	// 		canvas.height = image.height;
	// 		context.drawImage(image, 0, 0, image.width, image.height);
	// 		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	// 		const pixels = imageData.data;
	// 		let hexColours = [];
	// 		for (let i = 0; i < pixels.length; i += 4) {
	// 			const red = pixels[i];
	// 			const green = pixels[i + 1];
	// 			const blue = pixels[i + 2];
	// 			const alpha = pixels[i + 3];
	// 			const hexColor = rgbToHex(red, green, blue);
	// 			// Do something with the hex color value
	// 			hexColours.push(hexColor);
	// 			// console.log(hexColor);
	// 		}
	// 		// function getHexColours(array) {
	// 		// 	return hexColours;
	// 		// }
	// 		console.log(hexColours);
	// 		// console.log(getHexColours(hexColours));
	// 		return hexColours;
	// 	};

	// 	image.src = "../images/img3.png";

	// 	function rgbToHex(red, green, blue) {
	// 		const r = red.toString(16).padStart(2, "0");
	// 		const g = green.toString(16).padStart(2, "0");
	// 		const b = blue.toString(16).padStart(2, "0");
	// 		return "#" + r + g + b;
	// 	}
	// }

	// create the grid cells
	function createGrid() {
		for (let i = 0; i < numColumns; i++) {
			const row = document.createElement("div");
			row.id = "row-" + String.fromCharCode(97 + i);
			row.className = "row";
			for (let j = 1; j <= numColumns; j++) {
				const cell = document.createElement("div");
				cell.className =
					"cell labelled " + String.fromCharCode(97 + i) + " " + "_" + j;
				cell.id = String.fromCharCode(97 + i) + j.toString();

				row.appendChild(cell);
				// if cell.id

				// cell.style.border = `1px solid aqua`;
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

	function colourCodeGrid() {
		const allCells = document.querySelectorAll(`[class*="cell"]`);

		let count = 1;
		while (count < numColumns + 1) {
			let classVar = `"_${count}"`;
			const selectedCells = document.querySelectorAll(`[class$=${classVar}]`);
			selectedCells.forEach((element) => {
				var colourNum = count;
				if (colourNum > 10) {
					colourNum -= 10;
				}

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
						colourNum = 1;
						break;
					default: {
						console.log("default switch break executing");
						break;
					}
				}
			});
			count++;
		}
	}
});

// function createGrid(grid) {
// 	console.log("DOM fully loaded and parsed");
// 	const allCells = document.querySelectorAll(`[class*="cell"]`);

// 	let count = 1;
// 	while (count < numColumns + 1) {
// 		let classVar = `"_${count}"`;
// 		const selectedCells = document.querySelectorAll(`[class$=${classVar}]`);
// 		selectedCells.forEach((element) => {
// 			var colourNum = count;
// 			if (colourNum > 10) {
// 				colourNum -= 10;
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
// 		});
// 		count++;
// 	}
// 	document.body.appendChild(grid);
// }

/* ************************************************************************** */
/*                            CONSOLE LOG FORMATTER                           */
/* ************************************************************************** */

/*
    Fun console display so I don't lose my mind 😊 - I copied the original code for this and altered it to suit my needs
    SOURCE : https://medium.com/@MrWhy/console-log-big-emoji-507cfe9a2e6f
*/

// Define your custom commands and emoji
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
	// Create custom commands
	commands.forEach(function (command) {
		window.console[command[0]] = function () {
			// Second argument is size, default is 11px
			var size = 20;
			if (arguments.length > 1) {
				size = [].pop.call(arguments);
			}
			// Get arguments as a string
			var args = Array.prototype.slice
				.call(arguments)
				.toString()
				.split(",")
				.join(",");
			// Log to the console with emoji
			// console.log(arguments[0]);

			if (typeof arguments[0] === "object") {
				let objectName = Object.getOwnPropertyNames(arguments[0]).toString();
				console.log(
					"%c" + command[1] + "%c🔻%c" + " " + "Object: %c" + objectName,
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

// Log to the console!
console.important("Fix immediately!");
console.issue("Fix this later...", 20);
console.note("Note to self...", 20);
console.inspect("Let's see...", 20);
console.damnit("Damnit!", 20);
console.idea("I have an idea!", 20);
console.todo("TODO: ", 20);

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
*/

// Q: What does %c do?
// A: %c is a CSS placeholder. It allows you to apply CSS to the text that follows it. The second argument is a string of CSS rules.

// Q: How do I initialize a node project?
// A: npm init
