/**
 * Lib storing global variables or functions 
 * @author {77Vincent}
 * @license {MIT}
 */

"use strict";

const auth = require("../auth.json");
const https = require("https");

const lib = {
  /**
   * USED AS REQUEST HEADER
   */
  options: {
    protocal: "https:",
    hostname: "api.github.com",
    headers: {
      "user-agent": "Chrome/59.0.3071.115",
      "authorization": `Basic ${new Buffer(`${auth.username}:${auth.password}`).toString("base64")}`
    }
  },
  /**
   * MAKE GET REQUEST 
   * @param {Function} CALLBACK FUNCTION
   * @return {void}
   */
  get(callback) {
    https.get(lib.options, function (res) {

      if (res.statusCode !== 200) {
        console.error(`${res.statusCode}: ${res.statusMessage}`);
        res.resume();
        return;
      }

      let rawData = [];

      res.on("data", (chunk) => {
        rawData.push(chunk);
      });

      res.on("end", () => {
        callback(res, rawData.join(""));
      });

      res.setEncoding("utf8");

    }).on("error", function (e) {
      console.error(e.message);
    });
  }
};

module.exports = lib;