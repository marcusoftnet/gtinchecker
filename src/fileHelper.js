const FILENAME = './gtins.csv';
const fs = require('fs');
let thunkify = require('thunkify');
let read = thunkify(fs.readFile);

function getFileContents() { return fs.readFileSync(FILENAME, 'utf8') };
function recreateFile() { fs.openSync(FILENAME, 'w'); }
function createHeaderRow() { fs.appendFileSync(FILENAME, `Row;Företagsnamn;GLN;GCP;\n`); }

function appendRow(row) {
	let rowToWrite = `${row.No};${row.Företagsnamn};${row.GLN};${row.GCP}\n`;
	fs.appendFileSync(FILENAME, rowToWrite);
}

module.exports = {
	getFileContents,
	recreateFile,
	createHeaderRow,
	appendRow
}