const FILENAME = './output/gtins.xls';
const fs = require('fs');

function getFileContents() { return fs.readFileSync(FILENAME, 'utf-8') };
function recreateFile() { fs.openSync(FILENAME, 'w'); }
function createHeaderRow() { fs.appendFileSync(FILENAME, `Row;GTIN;Företagsnamn;GLN;GCP;\n`); }

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