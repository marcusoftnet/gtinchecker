let cheerio = require('cheerio');

module.exports.scrapeAddress = function (html) {
	return htmlToObject(html, '#address_0');
};

module.exports.scrapeExtraInfo = function (html) {
	return htmlToObject(html, '#more-info-0');
}

module.exports.scrapeBasicInformation = function (html) {
	let $ = cheerio.load(html);

	if($('.alert').length > 0){ return "Error in GTIN"; }
	if(html.indexOf("inga träffar") > 0 ){ return "Not found"; }

	let tableRows =  $('.resultsTable').html().split('<tr>');

	let keys = getPropertiesFromHeaderRow($, tableRows);
	return getValuesFromFirstRow($, tableRows, keys);
};

function getValuesFromFirstRow($, tableRows, keys) {
	let objToReturn = {};
	let processed = false;
	let i = 0;

	tableRows.forEach(function (item) {
		let cleanedItem = item.trim()

		if(!processed && cleanedItem.startsWith("<td")) {
			let values = $(cleanedItem).text().trim().split('\r\n');
			
			values.forEach(function (value) {
				if(value.trim() != ""){
					objToReturn[keys[i]] = value.trim();
					i++;
				}
			});
			processed = true;
		}
	});

	return objToReturn;
}

function getPropertiesFromHeaderRow($, tableRows) {
	let keys = [];
	
	tableRows.forEach(function (item) {
		let cleanedItem = item.trim()

		if(cleanedItem.startsWith("<th")) {
			let propertyNames = $(cleanedItem).text().trim().split('\r\n');

			propertyNames.forEach(function (propertyName) {
				if(propertyName.trim() != ""){
					keys.push(makeValidPropertyName(propertyName));
				}
			});
		}
	});

	return keys;
}

function isEven(index){ return index % 2 ===0; }

function makeValidPropertyName(key){
	return key
		.trim()
		.replace("-", "")
		.replace(" ", "");
}

function htmlToObject(html, selector) {
	let $ = cheerio.load(html);
	let arr =  $(selector).text().split('\r\n');

	let objToReturn = {};
	let index = 1;
	let lastkey = "";

	arr.forEach(function function_name(item) {
		let cleanedItem = item.trim()
		if(cleanedItem != "") {
			index += 1
			if(isEven(index)) {
				objToReturn[cleanedItem] = "";
				lastkey = cleanedItem;				
			}
			else {
				objToReturn[lastkey] = cleanedItem;				
			}
		}
	});
	return objToReturn;
};