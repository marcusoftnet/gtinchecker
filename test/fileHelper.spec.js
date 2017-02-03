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
			No : 123456,
			Företagsnamn : 'Företagsnamn_Data',
			GLN : 'GLN_Data',
			GCP : 'GCP_Data'
		};

		// act
		fileHelper.appendRow(row)

		// assert
		let content = fileHelper.getFileContents();
		content.should.containEql('123456');
		content.should.containEql('Företagsnamn_Data');
		content.should.containEql('GLN_Data');
		content.should.containEql('GCP_Data');
		done();
	});
});