const cellWidth = 10; /* (px) - For 1 to 1 scale, set both to 1 */
const cellHeight = 10; /* (px) */
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
const gridWrapper = document.getElementById("grid-wrapper");
const resultHeaders = document.getElementsByClassName("collapsible");
const cellSizeInput = document.getElementById("cell-size-input");
const submitButton = document.getElementById("submit-button");
const loader = document.querySelector("#loader");
const loaderContainer = document.getElementById("loader-container");
const form = document.getElementById("image-and-cell-size-form");
const noImageUploadedErrorMsg = document.getElementById(
	"no-image-error-message"
);
const imageLoader = document.getElementById("image-loader");
const demoImages = document.getElementsByClassName("demo-image");
const stepOneCircle = document.getElementById("step-one-circle");
const orCircle = document.getElementById("or-circle");
const mainContainer = document.getElementById("main-container");
const sectionOne = document.getElementById("section-1");
const sectionTwo = document.getElementById("section-2");
const sectionThree = document.getElementById("section-3");
/* ——————————————————————————————————— !TODO —————————————————————————————————— */
/* !TODO: Add an extra container filled with a few pixel art images the user
	can click on to upload so people who are just curious/employers who want a
	quick demo can easily check out the app without having to find and upload
	their own image. */
/* ———————————————————————————————————————————————————————————————————————————— */
/* !TODO:  create a submit button instead of processing image on-upload. Add a
	listener so every time that submit button is clicked, the grid is remade.
	Perhaps the functions that handle the grid creation should be put into their
	own function that the event listener can call over and over. This is a way
	around the fact that duplicate uploads dont trigger a grid re-make, which is
	an issue for a user who just wants to preview different cell sizes for the
	same image. */
/* ———————————————————————————————————————————————————————————————————————————— */

/* ——————————————————————— 👂 DOMContentLoaded Event Listener 👂 —————————————————————— */
// window.addEventListener("DOMContentLoaded", async (event) => {
// loader.style.display = "none";
console.log("DOM content loaded.");

/* ————————————————————————————— Demo Image Stuff ————————————————————————————— */
const demoImageEmitter = new EventEmitter();
console.log("demoImages: ", demoImages);
for (let demoImage of demoImages) {
	demoImage.addEventListener("click", handleDemoImageClick);
}

function handleDemoImageClick(e) {
	e.preventDefault();
	demoImageSelectedVisualFeedback(e);
	// Reset the imageLoader's value
	imageLoader.value = null;

	if (e.target.classList.contains("selected")) {
		sendDemoImageToimageLoader(e);
	}

	function demoImageSelectedVisualFeedback(e) {
		e.preventDefault();
		// stepOneCircle.classList.toggle("greyed-out");
		if (e.target.classList.contains("selected")) {
			orCircle.classList.toggle("greyed-out");
			stepOneCircle.classList.toggle("greyed-out");
			e.target.classList.remove("selected");
			imageEmitter.emit("imageLoaded", { data: null });
			return;
		}
		if (!e.target.classList.contains("selected")) {
			for (let demoImage of demoImages) {
				demoImage.classList.remove("selected");
			}
			e.target.classList.add("selected");
			orCircle.classList.remove("greyed-out");
			stepOneCircle.classList.add("greyed-out");
		}
	}

	function sendDemoImageToimageLoader(e) {
		e.preventDefault();
		console.log("🔴🔴🔴 demo image clicked 🔴🔴🔴");
		console.log("e.target.src: ", e.target.src);
		let demoImg = new Image();
		demoImg.src = e.target.src;
		console.log("e: ", e.target.classList);
		// if (e.target.classList.contains("selected")) {
		imageEmitter.emit("imageLoaded", { data: demoImg });
		// }
	}
}

function deselectAllDemoImages() {
	for (let demoImage of demoImages) {
		demoImage.classList.remove("selected");
		orCircle.classList.add("greyed-out");
		stepOneCircle.classList.remove("greyed-out");
	}
}
/* ———————————————————————————————————————————————————————————————————————————— */
const imageEmitter = new EventEmitter();

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
			if (img.height < 200 && img.width < 200) {
				imageEmitter.emit("imageLoaded", { data: img });
			} else {
				if (
					//!TODO: I think I read somewhere that window.confirm shouldn't be used in actual production - look into that
					window.confirm(
						`⚠️ WARNING ⚠️ \n\nYou've uploaded a large image. The larger an image is, the longer it will take to load. \n\nIf you'd like to proceed, click OK.\n\nTo upload a different image, click Cancel and try again. `
					)
				) {
					imageEmitter.emit("imageLoaded", { data: img });
				}
			}
		};
		img.src = event.target.result;
		deselectAllDemoImages();
	};
	reader.readAsDataURL(e.target.files[0]);
}

const allowSubmitEmitter = new EventEmitter();

let canSubmit = false;
imageEmitter.on("imageLoaded", async (payload) => {
	if (payload.data === null) {
		console.log("👻 received null payload");
		canSubmit = false;
	} else {
		canSubmit = true;
		allowSubmitEmitter.emit("imageLoaded", payload);
	}
});

let imgData = null;
allowSubmitEmitter.on("imageLoaded", async (payload) => {
	imgData = payload;
	console.log("imgData: ", imgData);
	console.log("allowSubmitEmitter.on");
});

/* ———————————————————————————————————————————————————————————————————————————— */
// submitButton.onclick = async (e) => {
// 	e.preventDefault();
// 	console.log("Submit button clicked.");
// 	await showLoadingAnimation();
// };
form.onsubmit = async (e) => {
	console.log("Form submitted. canSubmit = ", canSubmit);
	e.preventDefault();
	/* This implementation deviates from a straightforward approach to
		prioritize maximum user-friendliness when dealing with large image inputs.

		An issue arises when attempting to enable the loading animation within
		this onsubmit function. Despite various attempts to incorporate
		asynchronous operations and promises, the DOM fails to update in time
		before invoking the main controller function, resulting in the page
		freezing. Consequently, although the loading animation is technically set
		to display:block, it remains invisible to the user due to the freeze. 

		To address this, the activation of the loading animation is encapsulated
		within a promise along with a timeout, allowing the DOM sufficient time to
		update before the execution of main().
		
		I'll put a !TODO!LEARN here, because I'd like to investigate the
		root cause behind the delayed DOM updates, despite using asynchronous
		techniques and explore alternative approaches */

	console.log("Form submitted.");

	if (canSubmit === true) {
		await new Promise((resolve, reject) => {
			console.log("Promise executed.");
			loaderContainer.style.display = "block";
			loader.style.display = "block";
			loaderContainer.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			noImageUploadedErrorMsg.style.visibility = "hidden";
			hideResultSections();
			setTimeout(() => {
				resolve();
			}, 100);
		});

		await main();
	}
	if (canSubmit === false) {
		hideResultSections();
		console.log("No image uploaded - Cannot submit.");
		noImageUploadedErrorMsg.style.visibility = "visible";
		errorMsgShakeAnim();
		if (sectionTwo.hidden === true) {
			noImageUploadedErrorMsg.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
		if (sectionTwo.hidden === false) {
			sectionOne.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}
	}

	loader.style.display = "none";
	loaderContainer.style.display = "none";
};

function errorMsgShakeAnim() {
	noImageUploadedErrorMsg.classList.add("shake");
	setTimeout(function () {
		noImageUploadedErrorMsg.classList.remove("shake");
		// Timeout matches animation duration
	}, 500);
}
/* ———————————————————————————————————————————————————————————————————————————— */

async function showLoadingAnimation() {
	loader.style.display = "block";
	console.log("loader.style.display: ", loader.style.display);
	return true;
}
async function main() {
	// console.log("Received event:", imgData.data);

	// loader.style.display = "block";
	console.log("loader.style.display: ", loader.style.display);

	/* Draw image to the canvas, both to display it as a preview to the user and allow
		extraction of image data from the canvas */
	drawImage(canvas, context, imgData.data);

	/* Wait for extraction of image data from the canvas and store data */
	let imageData = await extractImageData(canvas, context);
	// console.log("imageData: ", imageData);

	/* Remove any previous grid if it exists */
	if (document.contains(document.getElementById("grid"))) {
		document.getElementById("grid").remove();
	}
	console.log("loader.style.display: ", loader.style.display);
	/* Create a grid of cells with the image's exact width and height (1 cell = 1
		pixel) */
	createGrid(imageData.width, imageData.height);

	removeGridCellLabels();

	applyExtractedColoursToGrid(imageData.channels);
	addCopyableHtmlToTextarea();
	addCopyableCssToTextarea();
	unhideResultSections();

	const container = document.querySelector("#grid");
	const centerEl = document.querySelector(".row");

	container.scrollLeft = centerEl.offsetWidth / 2 - container.offsetWidth / 2;
}
// });

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
	let gridClone = grid.cloneNode(true);

	for (node of gridClone.children) {
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

	 !TODO: Maybe instead of having hundreds of css selectors due to the cell ids,
	        I could add a class to each cell that represents the rgba values, eg.
	        class="rgba-56-27-9" or something that can easily convert to a usable
	        rgba value format. 

	 !TODO: I'm noticing the CSS strings that are fully opaque leave out the alpha
	        value instead of setting it to 1. So some cell ids only have 3 values
	        (aka rgb not rgba). Just noting this in case an issue comes up later,
	        but for now it seems to be working fine. 
	*/

	/* Get grid html as a string and add it to the text area so the user can copy it */
	let gridNodeList = document.getElementById("grid");

	let gridHTML = gridNodeList.innerHTML;

	let gridWrapperNodes = document.getElementById("grid-wrapper").childNodes;

	let rowNode = document.querySelector(".row");

	/* General row styling */
	let rowStyle = rowNode.style.cssText;
	let rowClassCssString = `.row{display: grid; height: fit-content; width: fit-content; ${rowStyle}}`;

	/* General cell styling */
	let cellClassCssString = `.cell{height: ${cellHeight}px; width: ${cellWidth}px; border: none;}`;

	let cellNodes = document.querySelectorAll(".cell");
	let cellIdBackgroundColours = {};
	/* Specific individual cell styling (actual cell colours making up the image)*/
	for (let i = 0; i < cellNodes.length; i++) {
		let cellId = cellNodes[i].id;

		cellIdBackgroundColours["#" + cellId] = cellNodes[i].style.backgroundColor;
	}

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

	let cellIdsBackgroundColourCssStrings = [];
	// Iterate over the duplicateValues object
	for (const key in duplicateValues) {
		const value = duplicateValues[key];
		let cssString = `${value}{background-color: ${key};}\n\n`;
		/* !TODO: Now I just need to store this and format the whole CSS string to place into the textarea */
		cellIdsBackgroundColourCssStrings.push(cssString);
	}

	let completeCssString = `${rowClassCssString}\n\n${cellClassCssString}\n\n${cellIdsBackgroundColourCssStrings.join(
		""
	)}`;

	let textArea = document.getElementById("css-textarea");

	textArea.value = completeCssString;
}
/* ————————————————————————— unhideResultSections() ————————————————————————— */

function unhideResultSections() {
	sectionTwo.hidden = false;
	sectionThree.hidden = false;
}

function hideResultSections() {
	sectionTwo.hidden = true;
	sectionThree.hidden = true;
}
/* ————————————————————— ✏️ drawImage(): Draws image to canvas ✏️ ————————————————————— */

function drawImage(canvas, context, image) {
	console.log("drawImage() called");
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
	console.log("extractImageData() called");
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
	console.log("createGrid() called");
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

/* ————————— 🎨 applyExtractedColoursToGrid(): Add hex values to grid cells 🎨 ———————— */

function applyExtractedColoursToGrid(rgbData) {
	console.log("applyExtractedColoursToGrid() called");
	const allCells = document.querySelectorAll(`[class*="cell"]`);
	for (let i = 0; i < rgbData.length; i++) {
		/* !TODO: Could a queue be useful here? */
		const { r, g, b, a } = rgbData[i];

		const alphaRange = a / 255; // Convert alpha value to range of 0-1

		// console.log(a);
		allCells[i].style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alphaRange})`;
	}
}
