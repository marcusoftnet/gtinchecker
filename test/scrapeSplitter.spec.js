let scraper = require("../scrapeSplitter.js");
let should = require("should");

describe("split html", function () {
	let html = '';
	before(function (done) {
		let fs = require("fs");
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