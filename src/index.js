"use strict";

const FILENAME = './gtins.csv';
const fs = require('fs');
let co = require("co");
let request = require('request');
let scraper = require("./scrapeSplitter.js");
let fileHelper = require("./fileHelper.js");

let gtins = require('../config/config.json').gtins;
/*gtins = ['7310155802002']; // ok
gtins = ["0000073100126",
"0000073100126",
"0000073102144",
"0000073105824",
"0000073107026",
"0000073109228",
"0000073114178",
"0000073116998",
"0000073117001",
"0000073117018",
"0000073117216",
"0000073117223"];*/
//var gtins = ['7332513106065']; // not found
//var gtins = ['7393155001149']; // fail

const url = 'http://gepir.gs1.se/web/sv/Home/SearchNumber?KeyCode=GTIN&Method=Search+Party+By+GTIN&LanguageCode=SV&Re=&_=-1&KeyValue=';

let options = {
	url : url,
	proxy : 'http://proxy01.ica.se:8080'
};
 
fileHelper.recreateFile();
fileHelper.createHeaderRow();

let rowNo;
for (var i = 0; i < gtins.length; i++) {
	options.url = options.url + gtins[i];
	rowNo = i+1;

	request(options, function (error, response, body) {
		console.log("Processing: " + gtins[i]);
		if (!error && response.statusCode == 200) {
    		console.log(body) // Show the HTML for the Google homepage. 
  		}
	
		let basicInfo = scraper.scrapeBasicInformation(body);
		let row;

		if(typeof basicInfo === 'object') {
			row = {
				RowNo : rowNo,
				GTIN : gtins[i], 
				Företagsnamn : basicInfo.Företagsnamn,
				GLN : basicInfo.HuvudGLN,
				GCP : basicInfo.GS1företagsprefix
			};
		}
		else{
			row = {
				RowNo : rowNo,
				GTIN : gtins[i], 
				Företagsnamn: basicInfo
			}
		}

		let rowWritten = fileHelper.appendRow(row);
		console.log("Wrote row: " + rowNo);
	})	
}