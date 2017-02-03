const fileHelper = require('../src/fileHelper.js');

describe('file helper', function() {
	beforeEach(function (done) {
		fileHelper.recreateFile();
		done();
	});

	it('get the content as a string', function (done) {
		fileHelper.getFileContents().should.not.be.null;
		done();
	})
	it('recreates the output file', function (done) {
		fileHelper.recreateFile();
		fileHelper.getFileContents().length.should.equal(0);
		done();
	});
	it('writes a header row', function (done) {
		fileHelper.createHeaderRow();
		let content = fileHelper.getFileContents().split('\n');
		content.length.should.equal(2);
		content[0].split(';').length.should.be.above(2);
		done();
	});

	it('appends new rows with data', function (done) {
		// arrange 
		let row = {
			RowNo : 123456,
			GTIN : '5900783007874',
			Företagsnamn : 'Företagsnamn_Data',
			GLN : 'GLN_Data',
			GCP : 'GCP_Data'
		};

		// act
		let rowWritten = fileHelper.appendRow(row);

		// assert
		rowWritten.should.containEql('123456');
		rowWritten.should.containEql('5900783007874');
		rowWritten.should.containEql('Företagsnamn_Data');
		rowWritten.should.containEql('GLN_Data');
		rowWritten.should.containEql('GCP_Data');
		done();
	});
});