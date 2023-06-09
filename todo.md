/* ———————————————————————————————————————————————————————————————————————————————————— */
/*                                     ✨ Notes ✨                                     
/* ———————————————————————————————————————————————————————————————————————————————————— */
/*
    ▶  	For my own readability during development, for this project I'll be using
        block comments (/*) for regular comments, and line comments (//) for
        commented-out code


/* —————————————————————————————— 📝 Quick To-Do List 📝 ————————————————————————————— */
/*
	!TODO : 	REDO screen-to-gif DEMO
	!TODO : 	Add button/link to view grid on it's own page (free from scrollbar)
	!TODO : 	┍———————————————┑
					🌟 IDEA 🌟  
				┕――———————————――┙
				Use this tool to create a image-to-emoji converter, similar to
				http://www.image2emoji.com/ and https://emojimage.com/, except it
				would be a pixel-perfect representation instead of using edge
				detection like the other two, and it could handle images with
				transparency. I would have to simplify each image into colours that
				can be represented by an emoji, OR actually instead of literally
				altering the image's colour palette before I put it through Div-ify, I
				could simply create a function that reads each rgba value and selects
				an emoji by checking (switch-statement) what 🌟range🌟 of rgba values
				correspond to each emoji and mapping it to an array (eg. between
				rgba(255, 0, 0, 1) & rgb(255, 128, 0) would be a RED emoji).

	!TODO :     Dynamically adjust displayed div grid size based on image size as to
				not overflow the page for large images (or maybe that + add a
				true-to-size display option?)

	!TODO :     ❗❗❗ Besides generating HTML w/ inline styling, create two
				more options for copying the grid: 
				1. HTML + CSS 
				2. HTML + CSS + JS
				(instead of 1000 lines of HTML, it would be generated by the
				javascript code)

	!TODO :     ❗❗❗ Add a selector for div cell size (default=10?) 

	!TODO :     ❗❗❗ Add a "copy to clipboard" button for the result grid

	!TODO :     Turn colourCodeGrid into a toggle option

	!TODO :     ┍—————————————————————┑
				   🌟 PERFORMANCE 🌟  
				┕――—————————————————――┙
				- Prevent accessing dom unessecarily. If you need to loop, put all the
				elements it inside an array and loop through that instead. - Could
				save load time on large images by performing some tasks on a backend
				or in a web worker?:
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

	!TODO :     ┍————————————————————————————┑
					🌟POSSIBLE FEATURES🌟 
				┕――—————————————————————————―┙
				- Allow for animations (gif, webp, etc.) 🌟  FUTURE
				- (?) https://konvajs.org/docs/sandbox/GIF_On_Canvas.html 🌟
				- Indexing the image data and storing it in a database      

	!TODO :     Create a main controller function that calls the other functions 

/* ———————————————————————————————————— ✔️ Done ✔️ ———————————————————————————————————— */

/*
	!DONE :     Allow user to upload their own image, then return the resulting grid's
				html + css so the user can copy and paste it into their own project                 

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

	!DONE :     Test image opacity handling with an image with varying levels of
	opacity.
	*/
