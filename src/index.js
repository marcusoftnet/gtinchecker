"use strict";

const FILENAME = './gtins.csv';
const fs = require('fs');
let co = require("co");
let request = require("co-request");
let scraper = require("./scrapeSplitter.js");

let gtins = require('../config/config.json').gtins;
gtins = ['7315547598006']; // ok
//var gtins = ['7332513106065']; // not found
//var gtins = ['7393155001149']; // fail

let url = 'http://gepir.gs1.se/web/sv/Home/SearchNumber?KeyCode=GTIN&KeyValue=7310155802002&Method=Search+Party+By+GTIN&LanguageCode=SV&Re=&_=-1';

let options = {
	url : url,
	proxy : 'http://proxy01.ica.se:8080'
};
 
co(function *() {
	let fd = fs.openSync(FILENAME, 'w');
	fs.appendFileSync(FILENAME, `Row;GTIN;Name;Last updated;GTIN Label;\n`);

	yield writeHeader();

	gtins.forEach(function (gtin) {
	 	let result = yield request(options); 
		let address = scraper.scrapeAddress(result.body);
		let extraInfo = scraper.scrapeExtraInfo(result.body);
		let basicInfo = scraper.scrapeBasicInformation(result.body);
	    console.log(extraInfo);
	    console.log(basicInfo);
	    console.log(address);

    	yield writeRow(basicInfo, extraInfo, address);
	});
}).catch(function (err) {
    console.err(err);
});


/*
for (var i = 0; i < gtins.length; i++) {
	let current = gtins[i];
	getGTINInfo(current, i+1)
		.then(function (data) {
			
			var row = `${data[0]};${current};${data[1]};${data[2]};${data[3]};\n`;
			fs.appendFile(FILENAME, row, function (err) {
				console.log(`Row ${data[0]} written for GTIN: ${current};`)
			});
		});
};*/