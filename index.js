const cellWidth = 10; /* (px) - For 1 to 1 scale, set both to 1 */
const cellHeight = 10; /* (px) */
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
const gridWrapper = document.getElementById("grid-wrapper");
const resultHeaders = document.getElementsByClassName("collapsible");

/* ——————————————————————— 👂 DOMContentLoaded Event Listener 👂 —————————————————————— */

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

		unhideResultHeadersAndTextarea();
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

function addCopyableHtmlToTextarea() {
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
	let textArea = document.getElementById("textarea");

	textArea.value = gridHTML;
}

/* ————————————————————————— unhideResultHeadersAndTextarea() ————————————————————————— */

function unhideResultHeadersAndTextarea() {
	for (let resultHeader of resultHeaders) {
		console.log(resultHeader);
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
		element.style.width = `${cellWidth}px`;
		element.style.height = `${cellHeight}px`;
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
