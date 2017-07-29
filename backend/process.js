/**
 * PROCESS SAVED RAW DATA JSON 
 * @author {77Vincent}
 * @license {MIT}
 */

"use strict";

const lib = require("./lib.js");
const fs = require("fs");

// READ LOCAL RAW DATA FILE
fs.readFile("data/rawData.json", "utf8", function (err, data) {
  if (err) {
    return lib.errorLog(err);
  }

  try {
    const parsedData = JSON.parse(data);

    // CREATE NEW ARRAY
    let processedData = parsedData.map((item, index) => {
      return {
        id: item.id,
        index: index,
        name: item.name
      };
    });

    fs.writeFile(lib.path.processedData, JSON.stringify(processedData), function (err) {
      if (err) {
        return lib.errorLog(err);
      }
      lib.successLog(`Raw data was successfully processed and saved to ${lib.path.processedData}!`);
    });


  } catch (e) {
    lib.errorLog(e.message);
  }
});