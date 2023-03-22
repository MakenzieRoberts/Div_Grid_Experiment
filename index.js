// // TODO: Clean up what I have so far.

// create the grid container
const grid = document.createElement("div");
const row = document.querySelector(".row");
grid.id = "grid";
const numColumns = 20;

// ******** ▼ **** ▼ **** ▼ ****** CANVAS TEST ****** ▼ **** ▼ **** ▼ *******

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const image = new Image();

image.onload = function () {
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
	// function getHexColours(array) {
	// 	return hexColours;
	// }
	// console.log(hexColours);
	// console.log(getHexColours(hexColours));
	const finalHexArray = hexColours;
};

image.src = "../images/img2.png";

function rgbToHex(red, green, blue) {
	const r = red.toString(16).padStart(2, "0");
	const g = green.toString(16).padStart(2, "0");
	const b = blue.toString(16).padStart(2, "0");
	return "#" + r + g + b;
}
// ******** ▲ **** ▲ **** ▲ ****** CANVAS TEST ****** ▲ **** ▲ **** ▲ *******

// create the grid cells
for (let i = 0; i < numColumns; i++) {
	const row = document.createElement("div");
	row.id = "row-" + String.fromCharCode(97 + i);
	row.className = "row";
	for (let j = 1; j <= numColumns; j++) {
		const cell = document.createElement("div");
		cell.className = "cell " + String.fromCharCode(97 + i) + " " + "_" + j;
		cell.id = String.fromCharCode(97 + i) + j.toString();
		row.appendChild(cell);
		// if cell.id

		// cell.style.border = `1px solid aqua`;
	}
	grid.appendChild(row);
	row.style.gridTemplateColumns = `repeat(${numColumns}, auto)`;
}

// !REFERENCE (querySelector): https://bobbyhadz.com/blog/javascript-get-element-by-id-contains

// // Colouring divs with rainbow pattern for easier identification
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

function createGrid() {
	console.log("DOM fully loaded and parsed");
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
	// append the grid to the body
	document.body.appendChild(grid);
}
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
			let objectName = Object.getOwnPropertyNames(arguments[0]).toString();
			if (typeof arguments[0] === "object") {
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
