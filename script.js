// TODO: Clean up what I have so far.

// create the grid container
const grid = document.createElement("div");
const row = document.querySelector(".row");
grid.id = "grid";
const numColumns = 20;

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

// Colouring divs with rainbow pattern for easier identification
window.addEventListener("DOMContentLoaded", (event) => {
	console.log("DOM fully loaded and parsed");
	// const selectedCells = document.querySelectorAll(`[id*="1"]`);
	// console.log(selectedCells);
	// selectedCells.forEach((element) => {
	// 	element.style.border = `1px solid aqua`;
	// });

	const allCells = document.querySelectorAll(`[class*="cell"]`);

	// console.log(allCells);

	// allCells.forEach((element) => {
	// 	console.log(element);
	// 	element.style.border = `1px solid red`;
	// 	console.log(count);
	// 	for (let i = 1; i < 10; i++) {
	// 		if (element.className.includes(`_${count}`)) {
	// 			element.style.backgroundColor = "green";
	// 		}
	// 	}
	// });

	// for (let l = "a".charCodeAt(0); l <= "z".charCodeAt(0); l++) {
	// 	let letter = String.fromCharCode(l);
	// 	console.log(letter);

	// var loop = true;
	// while ((loop = true)) {
	let count = 1;
	while (count < numColumns + 1) {
		let classVar = `"_${count}"`;
		const selectedCells = document.querySelectorAll(`[class$=${classVar}]`);
		selectedCells.forEach((element) => {
			// console.log(element);
			// element.style.border = `1px solid red`;
			// console.log({ count });
			// for (let i = 1; i < 10; i++) {
			// 	if (element.className.includes(`_${count}`)) {
			// 		element.style.backgroundColor = "green";
			// 	}
			// }

			// TODO: Get the colours to repeat every 10 columns.

			/* 
			✨✨✨BRAINSTORMING...✨✨✨
			 var num = 0;
			 case 1 + n:
			 then after 1 loop, n = 1, and the case is 2, or maybe add 10 each loop through 10 or something...

			 or maybe reset it like num = count - 10;? or if count = 10 subtract 10? but we need to keep the count so we can copy count like n = count. if n = 10{n-=10}... hmm
			 */
			var num = count;
			if (num > 10) {
				num -= 10;
			}
			// I FIXED IT!!!
			// 💃 I AM A GENIUS!!! 💃

			switch (num) {
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
					num = 1;
					break;
				default: {
					console.log("default switch break executing");
					break;
				}
			}

			// 1 	blue
			// 2   aqua
			// 3 	green
			// 4 	lime
			// 5 	yellow
			// 6 	orange
			// 7 	red
			// 8 	pink
			// 9 	magenta
			// 10 	purple
		});

		count++;
	}
	// loop = false;

	// }
	// }
});

// set the grid-template-columns property
// grid.style.gridTemplateColumns = "repeat(100, auto)";

// append the grid to the body
document.body.appendChild(grid);

// // create the column number labels
// const columnLabels = document.createElement("div");
// columnLabels.id = "column-number-labels";
// for (let i = 0; i <= 10; i++) {
// 	const label = document.createElement("div");
// 	label.className = "label column";
// 	label.id = "label-" + i;
// 	label.textContent = i.toString();
// 	columnLabels.appendChild(label);
// }
// grid.appendChild(columnLabels);

// // create the row letter labels
// const rowLetterLabels = document.createElement("div");
// rowLetterLabels.id = "row-letter-labels";
// for (let i = 0; i < 10; i++) {
// 	const label = document.createElement("div");
// 	label.className = "label row";
// 	label.id = String.fromCharCode(97 + i) + "0";
// 	label.textContent = String.fromCharCode(97 + i);
// 	rowLetterLabels.appendChild(label);
// }
// grid.appendChild(rowLetterLabels);

/* ************************************************************************** */
/*                               UNRELATED CODE                               */
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
