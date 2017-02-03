let scraper = require("../src/scrapeSplitter.js");
let should = require("should");
const fs = require("fs");

describe("split working html", function () {
	let html = '';
	before(function (done) {
		fs.readFile('./test/testFixture.html', 'utf8', function(err, data) {
  			if (err) throw err;
  			html = data;
  			done();
		});
	});

	describe("to address", function (done) {
		let address = {};

		beforeEach(function (done) {
			address =  scraper.scrapeAddress(html);
			done();
		});

		it("Namn", function () { address.Namn.should.equal("AB Rörets Industrier") });
		it("Gatuadress", function () {address.Gatuadress.should.equal("Box 8016") });
		it("Postkod", function () {address.Postkod.should.equal("550 08") });
		it("Land", function () {address.Land.should.equal("Sverige") });
		
	});

	describe("to extra information", function (done) {
		let extraInfo = {};

		beforeEach(function (done) {
			extraInfo =  scraper.scrapeExtraInfo(html);
			done();
		});

		it("GLN", function () { extraInfo.GLN.should.equal("7300010001008") });	
	});

	describe("to basic information", function (done) {
		let basicInformation = {};

		beforeEach(function (done) {
			basicInformation = scraper.scrapeBasicInformation(html);			
			done();
		});

		it("Företagsnamn", function () { 
			basicInformation.Företagsnamn.should.equal("AB Rörets Industrier"); 
		});	

		it("HuvudGLN", function () { 
			basicInformation.HuvudGLN.should.equal("7315540000001");
		});	

		it("GS1företagsprefix", function () { 
			basicInformation.GS1företagsprefix.should.equal("731554"); 
		});	
	});
});

describe("handles errors", function () {
	it("for no hits", function (done) {
		let html = fs.readFileSync('./test/testFixture_noHits.html', 'utf8');
		scraper.scrapeBasicInformation(html).should.equal("Sökningen gav inga träffar");
		done();
	});

	it("for more than one hit", function (done) {
		let html = fs.readFileSync('./test/testFixture_moreThan1Hits.html', 'utf8');
		scraper.scrapeBasicInformation(html).should.equal("Sökningen gav flera träffar");
		done();
	});

	it("for faulty GTIN", function (done) {
		let html = fs.readFileSync('./test/testFixture_faultyNumber.html', 'utf8');
		scraper.scrapeBasicInformation(html).should.equal("Fel på GTIN");
		done();
	});
});