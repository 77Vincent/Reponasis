/**
 * Get all github repositories 
 * @author {77Vincent}
 * @license {MIT}
 */

"use strict";

const lib = require("./lib.js");
const fs = require("fs");

let isContinue = true; // If the next iteration continues
let rawData = []; // Collect all chunks on response data
let processedData = []; // Collection of all processed raw data
let lastData; // Repos' data got the last time
let lastIndex; // Repos' index reached last time

/**
 * Create random integer among the given range inclusively
 * @param {Number} minimum 
 * @param {NUmber} maximum 
 */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Save the current data and exit the process
 * @param {void}
 * @return {void}
 */
const save = () => {
  let toSave = JSON.parse(lastData);
  toSave.push(...processedData);

  fs.writeFile("data/processedData.json", JSON.stringify(toSave), (err) => {
    if (err) {
      throw err;
    }

    console.log(`Data was successfully processed and saved to data/processedData.json!`);
    console.timeEnd("Time cost");

    // Save the last repos' index
    fs.writeFile("data/lastIndex.json", lastIndex, (err) => {
      if (err) {
        throw err;
      }
      process.exit();
    });
  });
};

/**
 * Specify git api 
 * @param {Number} sinceInt 
 * @return {String} specific api to use
 */
const api = (sinceInt) => {
  return `/users?per_page=100&since=${sinceInt}`;
};

/**
 * Receive and save data to file 
 * @param {Number} sinceIndex 
 * @return {Function} callback function of http response on data
 */
const createRawData = (sinceIndex) => {
  /**
   * Callback function
   * @param {Object} response
   * @param {String} data
   * @return {void}
   */
  return (res, data) => {

    if (!isContinue) return;

    let json = JSON.parse(data);
    rawData.push(...json);
    lastIndex = json[json.length - 1].id;

    // Successful log messages
    console.log(`${res.statusCode}: Data was successfully got from ${res.headers.server}!`);
    console.log(`From repository ${sinceIndex + 1} to ${lastIndex}`);
    console.log(`x-ratelimit-remaining: ${res.headers["x-ratelimit-remaining"]}/${res.headers["x-ratelimit-limit"]}`);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

    processedData = rawData.map((item, index) => {
      return {
        id: item.id,
        index: index,
        login: item.login 
      };
    });

    if (lastIndex > sinceIndex && res.headers["x-ratelimit-remaining"] > 1) {
      lastIndex += getRandomInt(0, 0);
      sinceIndex = lastIndex;

      lib.options.path = api(sinceIndex);
      lib.get(createRawData(sinceIndex));
    } else {

      // When hit the end, write file and save
      save();
    }
  };
};

// Start running and counting time
fs.readFile("data/processedData.json", "utf8", (err, data) => {
  console.time("Time cost");

  lastData = err ? "[]" : data;

  fs.readFile("data/lastIndex.json", "utf8", (err, data) => {

    let sinceIndex;

    if (err) {
      sinceIndex = 0;
    } else {
      sinceIndex = parseInt(data);
    }

    lib.options.path = api(sinceIndex);
    lib.get(createRawData(sinceIndex));
  });
});

// Hanlde interruption
process.on("SIGINT", () => {
  isContinue = false;
  save();
});