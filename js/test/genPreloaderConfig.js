// USAGE:
// 1. node genPreloaderConfig.js
// 2. edit json file to meet AFTCPreloader requirements

const fs = require("fs");
const aftc = require("aftc-node-tools");
const log = aftc.log;

console.clear();
log("Generating: preloader.json".green);

// getFilesSync(dir, ext = "*", includeHidden = false, recurse = false) {
let files = aftc.getFilesSync("./assets", "*", true, false, true);

let data = JSON.stringify(files);

aftc.writeFileSync("./preloader.json",data,()=>{
    log("File created!".green);
})