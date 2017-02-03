const FILENAME = './output/gtins.csv';
const fs = require('fs');

function getFileContents() { return fs.readFileSync(FILENAME, 'utf8') };
function recreateFile() { fs.openSync(FILENAME, 'w'); }
function createHeaderRow() { fs.appendFileSync(FILENAME, `Row;Företagsnamn;GLN;GCP;\n`); }

function appendRow(row) {
	let rowToWrite = `${row.RowNo};${row.GTIN};${row.Företagsnamn};${row.GLN};${row.GCP}\n`;
	fs.appendFileSync(FILENAME, rowToWrite);

	return rowToWrite;
}

module.exports = {
	getFileContents,
	recreateFile,
	createHeaderRow,
	appendRow
}