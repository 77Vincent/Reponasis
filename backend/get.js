/**
 * GET ALL GITHUB PUBLIC REPOSITORIES
 * @author {77Vincent}
 * @license {MIT}
 */

"use strict";

const lib = require("./lib.js");
const https = require("https");
const fs = require("fs");

let since = 0;
let last = null;

// SET GET PARAM "PATH" TO ALL PUBLIC REPOSITORIES
lib.options.path = `/repositories?since=${since}&`;

/**
 * GET ALL GITHUB PUBLIC REPOSITORIES 
 * @param {void}
 * @return {void}
 */
const fetch = () => {
  https.get(lib.options, function (res) {

    if (res.statusCode !== 200) {
      lib.errorLog(`${res.statusCode}: ${res.statusMessage}`);
      res.resume();
      return;
    }

    let rawData = [];

    res.on("data", (chunk) => {
      rawData.push(chunk);
    });

    res.on("end", () => {
      lib.successLog(`${res.statusCode}: Data was successfully got from ${res.headers.server}!`);
      lib.successLog(`x-ratelimit-limit: ${res.headers["x-ratelimit-limit"]}`);
      lib.successLog(`x-ratelimit-remaining: ${res.headers["x-ratelimit-remaining"]}\n`);

      // CREATE LOCAL RAW DATA FILE 
      fs.writeFile(lib.path.rawData, rawData.join(""), function (err) {
        if (err) {
          return lib.errorLog(err);
        }
        lib.successLog(`Data was successfully saved to ${lib.path.rawData}!`);
      });
    });

    res.setEncoding("utf8");

  }).on("error", function (e) {
    lib.errorLog(e.message);
  });
};

fetch();