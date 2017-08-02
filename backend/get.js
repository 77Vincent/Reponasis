/**
 * Get all github repositories 
 * @author {77Vincent}
 * @license {MIT}
 */

"use strict";

const lib = require("./lib.js");
const last = require("../data/lastIndex.json");
const fs = require("fs");


let sinceIndex = last ? last : 0;
let lastIndex = null;
let isContinue = true;
let final = [];
let lastData = null;


// Set path of request header 
lib.options.path = `/repositories?since=${sinceIndex}`;

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
    if (err) { throw err; }

    console.log(`Data was successfully saved to ${"data/rawData.json"}!`);
    console.timeEnd("Time cost");

    // Save the last repos' index
    fs.writeFile("data/lastIndex.json", lastIndex, (err) => {
      if (err) { throw err; }
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
  lastIndex = json[json.length - 1].id;

  if (lastIndex > sinceIndex && res.headers["x-ratelimit-remaining"] > 1 && isContinue) {
    lastIndex += getRandomInt(0, 0);
    sinceIndex = lastIndex;

    lib.options.path = `/repositories?since=${sinceIndex}`;
    lib.get(createRawData);
  } else {

    // When hit the end, write file and save
    save();
  }
};

// Start running and counting time
fs.readFile("data/rawData.json", "utf8", (err, data) => {
  console.time("Time cost");

  lastData = data;
  lib.get(createRawData);
});

process.on("SIGINT", function () {
  isContinue = false;
  save();
});