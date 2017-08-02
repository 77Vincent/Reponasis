/**
 * PROCESS SAVED RAW DATA JSON 
 * @author {77Vincent}
 * @license {MIT}
 */

"use strict";

const lib = require("./lib.js");
const fs = require("fs");

const savePath = "data/processedData.json";

// READ LOCAL RAW DATA FILE
fs.readFile("data/rawData.json", "utf8", function (err, data) {
  if (err) {
    return console.error(err);
  }

  try {
    const parsedData = JSON.parse(data);

    // CREATE NEW ARRAY
    let processedData = parsedData.map((item, index) => {
      return {
        id: item.id,
        index: index,
        name: item.full_name
      };
    });

    fs.writeFile(savePath, JSON.stringify(processedData), function (err) {
      if (err) {
        return console.error(err);
      }
      console.log(`Raw data was successfully processed and saved to ${savePath}!`);
    });


  } catch (e) {
    console.error(e.message);
  }
});