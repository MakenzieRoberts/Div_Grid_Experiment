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
	}
	grid.appendChild(row);
	row.style.gridTemplateColumns = `repeat(${numColumns}, auto)`;
}

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
