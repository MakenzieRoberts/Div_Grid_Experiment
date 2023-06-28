const cellWidth = 10; /* (px) - For 1 to 1 scale, set both to 1 */
const cellHeight = 10; /* (px) */
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
const gridWrapper = document.getElementById("grid-wrapper");
const resultHeaders = document.getElementsByClassName("collapsible");
const cellSizeInput = document.getElementById("cell-size-input");

/* ——————————————————————— 👂 DOMContentLoaded Event Listener 👂 —————————————————————— */

/* !TODO:  create a submit button instead of processing image on-upload. Add a
listener so every time that submit button is clicked, the grid is remade. Perhaps
the functions that handle the grid creation should be put into their own function
that the event listener can call over and over. This is a way around the fact that
duplicate uploads dont trigger a grid re-make, which is an issue for a user who
just wants to preview different cell sizes for the same image. */
window.addEventListener("DOMContentLoaded", async (event) => {
	console.log("DOM content loaded.");

	const emitter = new EventEmitter();

	var imageLoader = document.getElementById("imageLoader");

	/* When the user uploads an image, a change is detected and the getImage function is
	called */
	imageLoader.addEventListener("change", getImage);

	/*
		getImage() reads the image file, creates a new image object, and when the image
		has loaded it emits an event containing the image data
	*/
	function getImage(e) {
		e.preventDefault();
		var reader = new FileReader();
		reader.onload = function (event) {
			var img = new Image();
			img.onload = async function () {
				if (img.height < 100 && img.width < 100) {
					emitter.emit("imageLoaded", { data: img });
				} else {
					if (
						window.confirm(
							`⚠️ WARNING ⚠️ You've uploaded a large image. If you try to DIV-IFY an image over 100 x 100px, computer may go brrrr. \n\nIf you'd like to proceed anyway (and potentially freeze your browser), click OK.\n\nTo upload a different image, click Cancel. `
						)
					) {
						// window.open("exit.html", "Thanks for Visiting!");
						emitter.emit("imageLoaded", { data: img });
					}
				}
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(e.target.files[0]);
	}

	emitter.on("imageLoaded", async (payload) => {
		console.log("Received event:", payload.data);

		/* Draw image to the canvas, both to display it as a preview to the user and allow
		extraction of image data from the canvas */
		drawImage(canvas, context, payload.data);

		/* Wait for extraction of image data from the canvas and store data */
		let imageData = await extractImageData(canvas, context);
		console.log("imageData: ", imageData);

		/* Remove any previous grid if it exists */
		if (document.contains(document.getElementById("grid"))) {
			document.getElementById("grid").remove();
		}

		/* Create a grid of cells with the image's exact width and height (1 cell = 1
		pixel) */
		createGrid(imageData.width, imageData.height);

		removeGridCellLabels();

		applyExtractedColoursToGrid(imageData.channels);

		addCopyableHtmlToTextarea();
		addCopyableCssToTextarea();
		unhideResultHeadersAndTextarea();

		const container = document.querySelector("#grid");
		const centerEl = document.querySelector(".row");

		container.scrollLeft = centerEl.offsetWidth / 2 - container.offsetWidth / 2;
	});
});

/* —————————————————————————————— removeGridCellLabels() —————————————————————————————— */

function removeGridCellLabels() {
	/* Removes grid cells text labels */
	const allCells = document.querySelectorAll(`[class*="cell"]`);
	allCells.forEach((element) => {
		element.style.border = `none`;
		element.classList.remove("labelled");
	});
}

/* ———————————————————————————— addCopyableHtmlToTextarea() ——————————————————————————— */

/* Old function that created HTML with inline styling so the user can copy it into
their project. There are so many divs and so much HTML though that adding the
inline styling literally makes vscode nearly crash on format because it's so much
text. So in the new function below I'm removing all the inline styling from the
html so it and the CSS can be completely separate. */
function OldAddCopyableHtmlToTextareaWithInlineStyling() {
	/* Get grid html as a string and add it to the text area so the user can copy it */
	let grid = document.getElementById("grid");

	let gridHTML = grid.innerHTML;

	/* For formatting I'm just editing the grid html text string for now, I'll do this in
	a neater way later. !TODO */

	/* Formatting HTML text (line breaks, indents) (more readable and makes user's
	copy/paste easier and neater) */
	gridHTML = gridHTML.replace(/(\);\">)/g, `);">\n`);
	gridHTML = gridHTML.replace(/<\/div>/g, `<\/div>\n`);
	gridHTML = gridHTML.replace(/<div class="cell/g, `\t<div class="cell`);
	/* Adding all necessary inline styling */
	gridHTML = gridHTML.replace(
		/class="row" style="/g,
		`class="row" style="display: grid; height: fit-content; width: fit-content; `
	);
	let textArea = document.getElementById("html-textarea");

	textArea.value = gridHTML;
}

/* New version of the function that has inline styling removed. Inline styling for
so many divs is a complete mess, so I'm separating it into HTML and CSS for the
user to copy. */
function addCopyableHtmlToTextarea() {
	/* Get grid html as a string and add it to the text area so the user can copy it */
	let grid = document.getElementById("grid");
	let gridClone = grid.cloneNode(true);

	/* I'm grabbing the HTML from a clone of the actual grid HTML nodes used to
	display the grid to the user. Removing all inline styling that was there to
	properly display the grid. 

	As I'm starting to separate the HTML from the CSS, I'm starting to realize
	that I should probably go back to the grid generation function(s) and remove
	all inline styling from my own grid display as well and just put it in my CSS,
	maybe with the use of dynamically generating class names for each colour and
	adding each colour class to their respective cell HTML. 

	I should have done that in the beginning, and it was definitely a bad
	design decision on my part, but at first this project was just a proof of
	concept so I didn't worry about it. !REMEMBER - From now on, even for small experimental
	projects, I'll make an effort to design my code in a way that is scalable and
	efficient. */

	console.log(gridClone.children);

	for (node of gridClone.children) {
		console.log(node);
		node.removeAttribute("style");
		if (node.hasChildNodes()) {
			for (child of node.children) {
				child.removeAttribute("style");
			}
		}
	}

	let gridHTML = gridClone.innerHTML;

	/* Formatting HTML text (line breaks, indents) (more readable and makes user's
	copy/paste easier and neater) */

	/* Adds new line after parent row elements */
	gridHTML = gridHTML.replace(/"row">/g, `"row">\n`);
	/* Adds new line after div end tags */
	gridHTML = gridHTML.replace(/<\/div>/g, `<\/div>\n`);
	/* Indents cell class divs (children of row class divs)  */
	gridHTML = gridHTML.replace(/<div class="cell/g, `    <div class="cell`);

	let textArea = document.getElementById("html-textarea");

	textArea.value = gridHTML;
}

function addCopyableCssToTextarea() {
	/* My goal is to list the CSS in an efficient way, so if more than one cell has the same colour I want them listed with commas like: 
		#c1-r1, #c2-r2{
			background-colour: rgb(0,0,0,0);
		}  
	*/
	/* Get grid html as a string and add it to the text area so the user can copy it */
	let gridNodeList = document.getElementById("grid");

	let gridHTML = gridNodeList.innerHTML;
	// console.log("gridHTML: ", gridHTML);

	// console.log("grid: ", gridNodeList);
	// console.log("grid.children: ", gridNodeList.children);
	// console.log("grid.children[0]: ", gridNodeList.children[0]);
	// console.log("grid.children[0].id: ", gridNodeList.children[0].id);
	// console.log(
	// 	"grid.children[0].className: ",
	// 	gridNodeList.children[0].className
	// );
	// console.log(
	// 	"grid.children[0].style: ",
	// 	gridNodeList.children[0].style.cssText
	// );

	// console.log("gridnodelist childnodes: ", gridNodeList.childNodes);
	let gridWrapperNodes = document.getElementById("grid-wrapper").childNodes;
	// console.log("gridWrapperNodes: ", gridWrapperNodes);
	/* ———————————————————————————————————————————————————————————————————————————— */
	let rowNode = document.querySelector(".row");
	// console.log("rowNode: ", rowNode.style.cssText);

	/* General row styling */
	let rowStyle = rowNode.style.cssText;
	let rowClassCssString = `.row{display: grid; height: fit-content; width: fit-content; ${rowStyle}}`;

	/* General cell styling */
	let cellClassCssString = `.cell{height: ${cellHeight}px; width: ${cellWidth}px; border: none;}`;

	/* Specific individual cell styling (actual cell colours making up the image)*/

	let cellNodes = document.querySelectorAll(".cell");
	// console.log("cellNodes: ", cellNodes);
	// console.log("cellNodes length: ", cellNodes.length);

	let cellIdBackgroundColours = {};
	for (let i = 0; i < cellNodes.length; i++) {
		// console.log("cellNodes[i]: ", cellNodes[i]);
		// console.log("cellNodes[i].id: ", cellNodes[i].id);
		// console.log("cellNodes[i].style: ", cellNodes[i].style.cssText);
		// console.log("cellNodes[i].style: ", cellNodes[i].style.backgroundColor);
		let cellId = cellNodes[i].id;

		cellIdBackgroundColours["#" + cellId] = cellNodes[i].style.backgroundColor;
	}

	// console.log("cellIdBackgroundColours: ", cellIdBackgroundColours);

	// Create a new object to store the duplicate values
	const duplicateValues = {};

	// Iterate over the original object
	for (const key in cellIdBackgroundColours) {
		const value = cellIdBackgroundColours[key];

		// Check if the value already exists in the duplicateValues object
		if (duplicateValues[value]) {
			duplicateValues[value].push(key); // Add the key to the array
		} else {
			duplicateValues[value] = [key]; // Create a new array with the key
		}
	}

	// console.log(duplicateValues);

	let cellIdsBackgroundColourCssStrings = [];
	// Iterate over the duplicateValues object
	for (const key in duplicateValues) {
		const value = duplicateValues[key];
		let cssString = `${value}{background-color: ${key};}\n\n`;
		// console.log("cssString: ", cssString);
		/* !TODO: Now I just need to store this and format the whole CSS string to place into the textarea */
		cellIdsBackgroundColourCssStrings.push(cssString);
	}

	let completeCssString = `${rowClassCssString}\n\n${cellClassCssString}\n\n${cellIdsBackgroundColourCssStrings.join(
		""
	)}`;

	// console.log("completeCssString: ", completeCssString);

	/* !TODO: Maybe instead of having hundreds of css selectors due to the cell
	ids, I could add a class to each cell that represents the rgba values, eg.
	class="rgba-56-27-9" or something that can easily convert to a usable rgba
	value format. */

	/* !TODO: I'm noticing the CSS strings that are fully opaque leave out the
	alpha value instead of setting it to 1. So some cell ids only have 3 values
	(aka rgb not rgba). Just noting this in case an issue comes up later, but for
	now it seems to be working fine. */

	/* ———————————————————————————————————————————————————————————————————————————— */
	// for (let i = 0; i < gridWrapperNodes.length; i++) {
	// 	console.log("TEST", i);
	// 	console.log("gridNodeList[i]: ", gridWrapperNodes[i]);
	// 	console.log("gridNodeList[i].id: ", gridWrapperNodes[i].id);
	// 	console.log("gridNodeList[i].className: ", gridWrapperNodes[i].className);
	// 	console.log("gridNodeList[i].style: ", gridWrapperNodes[i].style.cssText);
	// }
	/* For formatting I'm just editing the grid html text string for now, I'll do this in
	a neater way later. !TODO */

	// /* Formatting HTML text (line breaks, indents) (more readable and makes user's
	// copy/paste easier and neater) */
	// gridHTML = gridHTML.replace(/(\);\">)/g, `);">\n`);
	// gridHTML = gridHTML.replace(/<\/div>/g, `<\/div>\n`);
	// gridHTML = gridHTML.replace(/<div class="cell/g, `\t<div class="cell`);

	// /* Adding all necessary inline styling */
	// gridHTML = gridHTML.replace(
	// 	/class="row" style="/g,
	// 	`class="row" style="display: grid; height: fit-content; width: fit-content; `
	// );

	let textArea = document.getElementById("css-textarea");

	textArea.value = completeCssString;
}
/* ————————————————————————— unhideResultHeadersAndTextarea() ————————————————————————— */

function unhideResultHeadersAndTextarea() {
	for (let resultHeader of resultHeaders) {
		// console.log(resultHeader);
		resultHeader.hidden = false;
		resultHeader.classList.remove("collapsed");
	}
}

/* ————————————————————— ✏️ drawImage(): Draws image to canvas ✏️ ————————————————————— */

function drawImage(canvas, context, image) {
	console.log(image.height + " " + image.width);

	canvas.width = image.width;
	canvas.height = image.height;

	context.drawImage(image, 0, 0, image.width, image.height);
}

/* ————————————————————————————— ⛏️ extractImageData() ⛏️ ————————————————————————————— */
/*				Extracts RGBA values to array, returns object containing: 
					width    --> image.width,
					height   --> image.height, 
					channels --> array of objects containing rgba values

			channels format: [{ r: red, g: green, b: blue, a: alpha }, ...]         
/* ———————————————————————————————————————————————————————————————————————————————————— */

async function extractImageData(canvas, context) {
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

	// Using Uint32Array to improve performance
	const pixels = new Uint32Array(imageData.data);

	/*
		Extraction goes to left to right for each row of pixels, starting at the top left
		and moving down each row. That way it will correspond with the grid construction
		perfectly.
	*/
	let channels = [];
	for (let i = 0; i < pixels.length; i += 4) {
		const red = pixels[i];
		const green = pixels[i + 1];
		const blue = pixels[i + 2];
		const alpha = pixels[i + 3];

		channels.push({ r: red, g: green, b: blue, a: alpha });
	}

	let imageDataObj = {
		width: imageData.width,
		height: imageData.height,
		channels: channels,
	};

	return imageDataObj;
}

/* —————————————— 🏗️ createGrid(): Create grid & add class/id labels 🏗️ ————————————— */

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
	gridWrapper.appendChild(grid);
	const allCells = document.querySelectorAll(`[class*="cell"]`);
	allCells.forEach((element) => {
		element.style.width = `${cellSizeInput.value}px`;
		element.style.height = `${cellSizeInput.value}px`;
	});
}

/* ———————— 🌈 colourCodeGrid(): Add rainbow colour pattern to grid columns 🌈 ———————— */

/* Colouring divs with rainbow pattern for easier identification */
function colourCodeGrid(width) {
	const numColumns = width;
	/* 	
		📖 Query Selector All Reference:
		https://bobbyhadz.com/blog/javascript-get-element-by-id-contains
    */
	const allCells = document.querySelectorAll(`[class*=cell]`);

	let count = 1;
	while (count < numColumns + 1) {
		const selectedCells = [...allCells].filter((cell) => {
			return cell.classList.contains(`c${count}`);
		});

		for (let i = 0; i < selectedCells.length; i++) {
			let colourNum = count;

			if (colourNum > 10) {
				colourNum = (colourNum % 10) + 1;
			}

			switch (colourNum) {
				case 1:
					selectedCells[i].style.border = `1px solid blue`;
					break;
				case 2:
					selectedCells[i].style.border = `1px solid aqua`;
					break;
				case 3:
					selectedCells[i].style.border = `1px solid green`;
					break;
				case 4:
					selectedCells[i].style.border = `1px solid lime`;
					break;
				case 5:
					selectedCells[i].style.border = `1px solid yellow`;
					break;
				case 6:
					selectedCells[i].style.border = `1px solid orange`;
					break;
				case 7:
					selectedCells[i].style.border = `1px solid red`;
					break;
				case 8:
					selectedCells[i].style.border = `1px solid pink`;
					break;
				case 9:
					selectedCells[i].style.border = `1px solid magenta`;
					break;
				case 10:
					selectedCells[i].style.border = `1px solid purple`;
					break;
				default: {
					console.log("default switch break executing");
					break;
				}
			}
			colourNum++;
		}
		count++;
	}
}

/* ————————— 🎨 applyExtractedColoursToGrid(): Add hex values to grid cells 🎨 ———————— */

function applyExtractedColoursToGrid(rgbData) {
	const allCells = document.querySelectorAll(`[class*="cell"]`);
	for (let i = 0; i < rgbData.length; i++) {
		/* !TODO: Could a queue be useful here? */
		const { r, g, b, a } = rgbData[i];

		const alphaRange = a / 255; // Convert alpha value to range of 0-1

		// console.log(a);
		allCells[i].style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alphaRange})`;
	}
}
