/**
 * Get github repos statistics
 * @author {77Vincent}
 * @license {MIT}
 */

"use strict";

const https = require("https");
const api = "https://api.github.com";
const users = [
  "facebook",
  "vuejs",
];

https.get(api, function(res) {
  console.log(res.statusCode)
}).on("error", function() {});
// let promise = new Promise()