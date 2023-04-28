/* 
		/* ************************************************************************** /*
		/*                                ✨ Notes ✨                                /*
		/* ************************************************************************** /*

		    ---     For my own readability during development, for this project I'll be using
		            block comments (/*) for regular comments, and line comments (//) for
		            commented-out code


		/* ************************** 📝 Quick To-Do List 📝 *********************** /*

		!TODO : 	Turn colourCodeGrid into a toggle option
		!TODO :     Allow user to upload their own image, then return the resulting grid's
					html + css so the user can copy and paste it into their own project

		!TODO :     Create a main "controller" function that calls the other functions

		!TODO :     🌟 PERFORMANCE 🌟  - Prevent accessing dom unessecarily. If you need
		                                to loop, put all the elements it inside an array
		                                and loop through that instead. - Could save load
		                                time on large images by performing some tasks on a
		                                backend or in a web worker?:
		                                (https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
		                                - Identify the most time-consuming tasks and see
		                                if they can be moved to a web worker - See if
		                                there are data structures that can be used to
		                                improve performance - See if I can use any faster
		                                data types (eg. Uint32Array/Uint8Array) -
		                                https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
		                                - ❕❕❕ Chrome Canary Line-Level Profiler:
		                                https://developers.google.com/web/updates/2018/09/devtools#coverage
		                                https://stackoverflow.com/questions/111368/how-do-you-performance-test-javascript-code
		                                https://umaar.com/dev-tips/99-line-level-profiling/

		!TODO :     🌟 POSSIBLE 🌟  - Allow for animations (gif, webp, etc.)
		            🌟  FUTURE  🌟	  	- (?) https://konvajs.org/docs/sandbox/GIF_On_Canvas.html
					🌟 FEATURES 🌟  - Indexing the image data and storing it in a database     	
					
		!TODO :     🌟 USE CASE 🌟  - Animation on-click (Turn the laptop screen on and
		                            	off in img2 on-click) 

		                            - Link door to another page containing a different room
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

		!DONE :     ❔ Instead of separate variables for width and height, use an object or
		            array to store the values

		!DONE :     ❕ Maybe use async/promise/listener/something to call the draw image
		            function when image loads (image onload) so it still works the same
		            but can be removed from the extract hex function
		            (single-responsibility principle)

					image.addEventListener('load', function() {
							console.log('Image loaded successfully!');
							// Code to execute after image has loaded
					});

		!DONE :     Figure out how to handle images with transparency. See what hex is
		            extracted on a fully transparent pixel.See if I can get the "a" value
		            (opacity value) from rgbToHex(). 
					
		!DONE :     Test image opacity handling with an image with varying levels of opacity.

*/

/* ************************************************************************** */
/*                         🧱 Variables & Constants 🧱                       */
/* ************************************************************************** */

const cellWidth = 10; /* (px) - For 1 to 1 scale, set both to 1 */
const cellHeight = 10; /* (px) */
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
const gridWrapper = document.getElementById("grid-wrapper");
const resultWrapper = document.getElementById("result-wrapper");
/* ************************************************************************** */
/*                    👂 DOMContentLoaded Event Listener 👂                   */
/* ************************************************************************** */

window.addEventListener("DOMContentLoaded", async (event) => {
	console.log("DOM content loaded.");

	const emitter = new EventEmitter();

	var imageLoader = document.getElementById("imageLoader");

	// When the user uploads an image, a change is detected and the getImage function is called
	imageLoader.addEventListener("change", getImage);

	/*
		getImage() reads the image file, creates a new image object, and when the image has loaded it emits an event containing the image data
	*/
	function getImage(e) {
		e.preventDefault();
		var reader = new FileReader();
		reader.onload = function (event) {
			var img = new Image();
			img.onload = async function () {
				// drawImage(canvas, context, img);
				// if (img.height < 100 && img.width < 100) {
				// 	emitter.emit("imageLoaded", { data: img });
				// } else {
				// 	alert(
				// 		"Image is too large, must be less than 100x100px or computer go brrr"
				// 	);
				// }

				if (img.height < 100 && img.width < 100) {
					emitter.emit("imageLoaded", { data: img });
				} else {
					if (
						window.confirm(
							"Image is too large, must be less than 100x100px or computer go brrrr.\n\nIf you'd like to proceed anyway and potentially freeze your browser, click OK.\n\nTo upload a different image, click Cancel."
						)
					) {
						// window.open("exit.html", "Thanks for Visiting!");
						emitter.emit("imageLoaded", { data: img });
					}
				}

				// if (window.confirm("Are you sure you want computer to go brr?")) {
				// 	// window.open("exit.html", "Thanks for Visiting!");
				// 	emitter.emit("imageLoaded", { data: img });
				// }
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

		/* Create a grid of cells with the image's exact width and height (1 cell = 1 pixel) */
		createGrid(imageData.width, imageData.height);

		/* This if-statement should never fire and is old code from when I created the
		colourCodeGrid function to make it easier to identify individual cells, with the
		intention of making it easier to turn the div grid into a sort of pixel-art image
		map, which could animate and hyperlink certain cells that make sense for the image
		(eg. clicking any cell that makes up a pixel-art lamp could trigger an animation
		of other cells to represent the lamp turning on and off). Is it kind of silly and
		needlessly expensive to make an image map using <1000 tiny divs? Absolutely. But
		I'm going to do it anyway */
		if (!imageData) {
			colourCodeGrid(); //  TODO: In the future, make this toggle a class on and off instead. It's neater.
		} else {
			/* Removes grid cells text labels (again, I was using this to make it easier
			to identify individual cells) - Add this to colourcodegrid toggle */
			const allCells = document.querySelectorAll(`[class*="cell"]`);
			allCells.forEach((element) => {
				element.style.border = `none`;
				element.classList.remove("labelled");
			});

			applyExtractedColoursToGrid(imageData.channels);

			/* Get grid html as a string and add it to the text area so the user can copy it */
			let grid = document.getElementById("grid");
			console.log("grid innerhtml: ", grid.innerHTML);
			let gridHTML = grid.innerHTML;

			/* For formatting I'm just editing the grid html text string for now, I'll do
			this in a neater way later. !TODO */

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
			textArea.hidden = false;

			resultWrapper.style.visibility = "visible";
		}
	});

	/* ************************************************************************** */
	/*                 🧪  Testing Experimental Sitemap Stuff  🧪                */
	/* ************************************************************************** */

	// 	const theCell = document.getElementById("c8-r33");

	// 	theCell.addEventListener("mouseenter", (event) => {
	// 		/*TODO: To group multiple cells together and then do this hover stuff, I'll have to insert them as children into a new parent element */
	// 		/* IMAGE MAP REFERENCE: https://codepen.io/makenzieroberts/pen/YzJzEjo */
	// 		// Create a new element
	// 		const newElement = document.createElement("div");
	// 		newElement.classList.add("hovered");

	// 		// const hovered = document.getElementsByClassName("hovered");

	// 		// Q: How do i add class style to javascript?

	// 		// Copy the position and size of the original element
	// 		const rect = theCell.getBoundingClientRect();

	// 		console.log("rect: ", rect);
	// 		// Calculate the center of the original element
	// 		const centerX = rect.left + rect.width / 2;
	// 		const centerY = rect.top + rect.height / 2;

	// 		// Set the position of the new element to the center of the original element
	// 		newElement.style.left = centerX - 10 + "px"; // Subtract half the width of the new element
	// 		newElement.style.top = centerY - 10 + "px"; // Subtract half the height of the new element
	// 		// newElement.style.left = rect.left + "px";
	// 		// newElement.style.top = rect.top + "px";
	// 		newElement.style.width = "20px";
	// 		newElement.style.height = "20px";
	// 		newElement.style.backgroundColor = theCell.style.backgroundColor;
	// 		// newElement.style.width = rect.width + 'px';
	// 		// newElement.style.height = rect.height + 'px';

	// 		// Add the new element to the DOM
	// 		document.body.appendChild(newElement);

	// 		// // Add and remove a CSS class on hover and off hover
	// 		newElement.addEventListener("mouseleave", (event) => {
	// 			newElement.classList.remove("hovered");
	// 			newElement.classList.add("hidden");
	// 		});
	// 	});
	// });

	// const body = document.querySelector("body");
	// body.addEventListener("click", (event) => {
	// 	console.log("click");
	// 	console.log(event.clientX);
	// });
});

/* ************************************************************************** */
/*            	   ✏️ drawImage(): Draws input image on screen ✏️            */
/* ************************************************************************** */

function drawImage(canvas, context, image) {
	console.log(image.height + " " + image.width);

	canvas.width = image.width;
	canvas.height = image.height;

	context.drawImage(image, 0, 0, image.width, image.height);
}

/* ************************************************************************** */
/*    	    ⏳ loadImage(): Loads image for use in other functions ⏳         */
/*     (OLD) This function is no longer used now that images are uploaded     */
/* ************************************************************************** */

// function loadImage(imgSrc) {
// 	return new Promise((resolve) => {
// 		const image = new Image();
// 		image.onload = () => {
// 			resolve(image);
// 		};
// 		image.src = imgSrc;
// 		console.log("loadImage() finished.");
// 	});
// }

/* ************************************************************************** */
/*    						⛏️ extractImageData() ⛏️ 					     */
/* ************************************************************************** */
/*	Extracts RGBA values to array, returns object containing:
		width    --> image.width, 
		height   --> image.height, 
		channels --> array of objects containing rgba values

	channels format: [{ r: red, g: green, b: blue, a: alpha }, ...]			  */
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
	let channels = [];
	for (let i = 0; i < pixels.length; i += 4) {
		const red = pixels[i];
		const green = pixels[i + 1];
		const blue = pixels[i + 2];
		const alpha = pixels[i + 3];
		// console.log("red: ", red);
		// console.log("green: ", green);
		// console.log("blue: ", blue);
		// console.log("alpha: ", alpha);
		// const hexColor = rgbaToHex(red, green, blue, alpha);

		channels.push({ r: red, g: green, b: blue, a: alpha });
	}

	/* 
		I decided to use rbga values instead of hex, so I can use the alpha channel.
		However, I'm going to leave this here in case I want to use the hex values for
		something in the future 
	*/

	// function rgbaToHex(red, green, blue, alpha) {
	// 	const r = red.toString(16).padStart(2, "0");
	// 	const g = green.toString(16).padStart(2, "0");
	// 	const b = blue.toString(16).padStart(2, "0");
	// 	const a = alpha.toString(16).padStart(2, "0");
	// 	return "#" + r + g + b + a;
	// }

	/* TODO: When refactoring, find a better name for this object... putting the type in a variable name is kinda lame imo */
	let imageDataObj = {
		width: imageData.width,
		height: imageData.height,
		channels: channels,
	};

	return imageDataObj;
}

/* ************************************************************************** */
/*            🏗️ createGrid(): Create grid & add class/id labels 🏗️          */
/* ************************************************************************** */

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

/* ************************************************************************** */
/* 🌈🌈🌈 colourCodeGrid(): Add rainbow colour pattern to grid columns 🌈🌈🌈
/* ************************************************************************** */

/* 	
	!REFERENCE (querySelector):
	https://bobbyhadz.com/blog/javascript-get-element-by-id-contains
*/

/* Colouring divs with rainbow pattern for easier identification */
function colourCodeGrid(width) {
	const numColumns = width;
	/*
		(Unimportant Curiosity)

		(?) I could remove with dom access here and put cells as a constant, but it only
		works for this function and not others (Which I know has something to do with
		scope/the order of the functions but I'm not sure what exactly. Maybe I have a
		fundamental misunderstanding of how DOM access scope is operating. I assume the constants
		access the DOM at the time of creation, and at the time of creation, cells doesn't
		exist yet. - so the nodeList should be of no value to this function - only the
		nodelist from after cells is created is of value to this function.... Right?)

		After checking console.log(allCells.length);, it seems like even if I delete the
		dom query for allcells in this function, this function is accessing it from a
		broader scope - And it's only been accessed by other functions and inside the
		domcontentloaded event listener, my guess is that it's being accessed from the
		domcontentloaded event listener. If that's correct, it would mean that perhaps I
		could use it to my advantage to query the dom for allcells right after they're
		created, and then use that nodelist for all the other functions that use it
		including this one. I could read about it, or I could play around with declaring
		the scope as 'let' in the functions/dom to see which one breaks this function
		(when it's without it's own dom query (below)).

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

			// console.log("--------------🔽--------------");
			// console.inspect({ colourNum });
			// console.inspect({ count });
			// console.log("--------------🔼--------------");

			/* TODO: Why does this work up to 20???? */
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
					// colourNum = 1;
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
/* ************************************************************************** */
/*      🎨 applyExtractedColoursToGrid(): Add hex values to grid cells 🎨    */
/* ************************************************************************** */

/*
	▶	Use Object.values instead of for...in loop: In the applyExtractedColoursToGrid
	function, the code is looping over the imageData.channels object using a for...in
	loop. It's generally faster to use the Object.values method to extract an array of
	values from the object and then loop over that array.
*/
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

/* ************************************************************************** */
/*           🤖 ChatGpt Performance Suggestions (March 29, 2023) 🤖          */
/* ************************************************************************** */
/*
    Here are some suggestions that may help improve performance in the code:

	▶   Cache DOM elements: In the window.addEventListener("DOMContentLoaded") function,
	    the code is repeatedly accessing the DOM using document.getElementById and
	    document.querySelectorAll. To avoid doing this repeatedly, you can store these
	    elements in variables outside of the function so that they can be accessed when
	    needed without having to search the DOM again.

	▶   Use CSS classes instead of inline styles: In the if (!imageData) block, the code
	    is setting the style of all cells using element.style.border and
	    element.classList.remove. It's generally better to use CSS classes instead of
	    inline styles as it's easier to manage and manipulate styles. You can define a
	    class for the cell border and a class for the "labelled" state, and then add or
	    remove these classes from the elements as needed.

	▶   Use requestAnimationFrame: The extractImageData function is looping over all the
	    pixels in the image to extract the RGBA values. This can be a time-consuming
	    operation, especially for large images. To avoid blocking the main thread, you can
	    break up the extraction into smaller chunks and use requestAnimationFrame to
	    perform the work in the background. This will allow the UI to remain responsive
	    while the extraction is taking place.

	▶   Use a worker thread: A more advanced technique for offloading expensive tasks like
	    image processing is to use a worker thread. Worker threads run in the background
	    and can perform operations in parallel to the main thread, which can improve
	    performance and responsiveness. You can create a new worker thread using the
	    Worker constructor and pass the image data to it for processing. Once the
	    processing is complete, the worker thread can send the results back to the main
	    thread using the postMessage method.

	▶   Use a smaller canvas: The canvas is being set to the exact size of the image,
	    which can be very large for high-resolution images. You can improve performance by
	    using a smaller canvas and scaling the image down to fit. This will reduce the
	    number of pixels that need to be processed and displayed on the screen.

	▶   Use Object.values instead of for...in loop: In the applyExtractedColoursToGrid
	    function, the code is looping over the imageData.channels object using a for...in
	    loop. It's generally faster to use the Object.values method to extract an array of
	    values from the object and then loop over that array.

	▶   Use Array.from instead of querySelectorAll: In the colourCodeGrid function, the
	    code is using querySelectorAll to select all the grid cells and then looping over
	    them using forEach. It's generally faster to use the Array.from method to convert
	    the NodeList returned by querySelectorAll into an array and then loop over that
	    array.

	▶   Use textContent instead of innerText: In the colourCodeGrid function, the code is
	    setting the text of the cell labels using the innerText property. It's generally
	    faster to use the textContent property instead as it doesn't parse HTML and is
	    therefore less expensive.

	▶   Minimize unnecessary logging: The code contains several console.log statements
	    that may be slowing down performance. You can remove these statements or comment
	    them out when not needed.

	▶   Remove unnecessary comments: The code contains many comments that may not be
	    needed for the code to function properly. Removing these comments can improve
	    performance by reducing the amount of code that needs to be parsed and executed.


/* ************************************************************************** */
/*                        🤖 ChatGpt Possible Use-Cases 🤖                   */
/* ************************************************************************** */
/*
	Image editor:   
	    One potential use case for your program could be an image editor where the user
	    can upload an image and then edit it by clicking on specific divs to change their
	    color. For example, a user could upload a photo of a person and then click on the
	    divs representing the person's eyes to change their color. 

 	Color palette generator:    
	    Your program could also be used to generate color palettes from images. By
	    analysing the pixel colors of an image and extracting the most frequently
	    occurring colors, your program could create a palette that could be used in other
	    design projects. 

 	Interactive data visualization:     
	    Another use case could be an interactive data visualization where the pixel colors
	    are mapped to different data points. For example, you could create a heat map
	    where the pixel colors represent different temperature ranges, or a map where the
	    pixel colors represent different regions or countries. 

 	Game design:    
	    Your program could also be used in game design, where the pixel colors represent
	    different objects or characters in the game. For example, you could use your
	    program to create a game where the player has to click on specific divs
	    representing objects to complete a task. 

 	Artistic creations:     
	    Finally, your program could be used to create artistic creations by generating
	    patterns or designs based on the colors of an image. For example, you could use
	    your program to create a series of abstract art pieces based on different
	    photographs.

	************************** Brainstorming Use-Cases **************************
	
	    ▶  Combining a colour palette generator with a game. Maybe the game could be to
	    guess in order the most common colours in an image.

	        Copilot Nonsense:
				▶  	A game where you have to click on the divs in the order of the
	        		colours in the image. 
				▶  	A game where you have to click on the divs in the
	        		order of the colours in the image, but the colours are scrambled. 
				▶  	A game where you have to click on the divs in the order of the colours
					in the image, but the colours are scrambled and the grid is scrambled.

		▶ Slide puzzle generator? Meh, not really that interesting.

	    ▶ The art idea is cool, maybe i could use edge/shape detection to detect shapes,
	    and then use its colours to like make abstract art vaguely inspired by the image

	    ▶ Use the divs to make a pixel art version of the image in svg format, because of
	    how I want to make svg pixel art but I can never get any of my svg programs to
	    snap to a grid in  the way I'd like so the workflow is all bleh. This could
	    automate that process and let me keep using ms paint... :) 
		https://github.com/felixfbecker/dom-to-svg


*/
