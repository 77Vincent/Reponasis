/**
 * Get all github repositories 
 * @author {77Vincent}
 * @license {MIT}
 */

"use strict";

const lib = require("./lib.js");
const lastIndex = require("../data/lastIndex.json");
const fs = require("fs");

let since = lastIndex ? lastIndex : 0;
let last = null;
let isContinue = true;
let final = [];

// Set path of request header 
lib.options.path = `/repositories?since=${since}`;

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
  fs.writeFile("data/rawData.json", JSON.stringify(final), (err) => {
    if (err) { return console.error(err); }

    console.log(`Data was successfully saved to ${"data/rawData.json"}!`);
    console.timeEnd("Time cost");

    // Save the last repos' index
    fs.writeFile("data/lastIndex.json", last, (err) => {
      if (err) { return console.error(err); }
      process.exit();
    });
  });
};

/**
 * Receive and save data to file 
 * @param {Object} response
 * @param {String} data got by response
 */
const createRawData = (res, data) => {
  console.log(`${res.statusCode}: Data was successfully got from ${res.headers.server}!`);
  console.log(`x-ratelimit-remaining: ${res.headers["x-ratelimit-remaining"]}/${res.headers["x-ratelimit-limit"]}`);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

  let json = JSON.parse(data);
  final.push(...json);
  last = json[json.length - 1].id;

  if (last > since && res.headers["x-ratelimit-remaining"] > 1 && isContinue) {
    // last += getRandomInt(1000, 2000);
    since = last;

    lib.options.path = `/repositories?since=${since}`;
    lib.get(createRawData);
  } else {

    // When hit the end, write file and save
    save();
  }
};

// Start running and counting time
console.time("Time cost");
lib.get(createRawData);

process.on("SIGINT", function () {
  isContinue = false;
  save();
});