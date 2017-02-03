"use strict";

const FILENAME = './gtins.csv';
const fs = require('fs');
let co = require("co");
let request = require('request');
let scraper = require("./scrapeSplitter.js");
let fileHelper = require("./fileHelper.js");

let gtins = require('../config/config.json').gtins;
//gtins = ['7310155802002']; // ok
//var gtins = ['7332513106065']; // not found
//var gtins = ['7393155001149']; // fail

const url = 'http://gepir.gs1.se/web/sv/Home/SearchNumber?KeyCode=GTIN&Method=Search+Party+By+GTIN&LanguageCode=SV&Re=&_=-1&KeyValue=';
 
fileHelper.recreateFile();
fileHelper.createHeaderRow();

gtins.forEach((gtin, index) => {
	setTimeout(function () {
  		handleRequest(gtin, index);
	}, 1000 * index);		
});

function handleRequest(gtin, index) {
	let rowNo = index +1;
	let options = {
		url : url + gtin,
		proxy : 'http://proxy01.ica.se:8080'
	};

	request(options, function (error, response, body) {
		if (error && response.statusCode != 200) {
    		console.log("Error getting URL: " + options.url);
    		console.log("Repsonse code: " + response.statusCode);
    		return;
  		}	
		let basicInfo = scraper.scrapeBasicInformation(body);
		let row;

		if(typeof basicInfo === 'object') {			
			row = {
				RowNo : rowNo,
				GTIN : gtin, 
				Företagsnamn : basicInfo.Företagsnamn,
				GLN : basicInfo.HuvudGLN,
				GCP : basicInfo.GS1företagsprefix
			};
		}
		else{
			row = {
				RowNo : rowNo,
				GTIN : gtin, 
				Företagsnamn: basicInfo
			}
		}

		let rowWritten = fileHelper.appendRow(row);
		console.log(`Row: ${rowNo} - ${gtin}`);
	});
}