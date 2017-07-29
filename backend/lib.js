/**
 * Lib storing global variables or functions 
 * @author {77Vincent}
 * @license {MIT}
 */

"use strict";

module.exports = {
  options: {
    protocal: "https:",
    hostname: "api.github.com",
    headers: {
      "user-agent": "Chrome/59.0.3071.115"
    }
  },
  path: {
    rawData: "data/rawData.json",
    processedData: "data/processedData.json"
  },
  successLog: (message) => {
    console.log("\x1b[32m", message);
  },
  errorLog: (message) => {
    console.log("\x1b[31m", message);
  }
};