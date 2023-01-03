"use strict";

const axios = require("axios");
const fsP = require("fs/promises");
const URL = require("url").URL;
const arg = process.argv[2];

/** Returns the appropriate cat function if the arg isn't "--out".
 *  Otherwise,
 *  Determines if original path is a file or url, calls the appropriate
 *  cat function on it, then calls the echo function to write the contents
 *  to the new path.
 */
async function handleArg() {
    if (arg !== "--out") {
        if (isURL(arg)) {
            return webCat(arg);
        } else {
            return cat(arg);
        }
    }

    const newPath = process.argv[3];
    const ogPath = process.argv[4];

    let contents;
    try {
        if (isURL(ogPath)) {
            contents = await webCat(ogPath);
        } else {
            contents = await cat(ogPath);
        }
        await echo(contents, newPath);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

/** Returns and console logs the contents of the file path. */
async function cat(path) {
    let contents;
    try {
        contents = await fsP.readFile(path, "utf8");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(contents);
    return contents;
}

/** Returns and console logs the contents of the url. */
async function webCat(url) {
    let resp;
    try {
        resp = await axios.get(url);
    } catch (err) {
        console.log(
            `Error fetching ${url}:
            Error: Request failed with status code ${err.response.status}`
        );
        process.exit(1);
    }
    console.log(resp.data.slice(0, 80), "...");
    return resp.data;
}

/** Writes contents to the path. */
async function echo(contents, path) {
    try {
        await fsP.writeFile(path, contents, "utf8");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

/** Returns true if input path is a url, false otherwise. */
function isURL(path) {
    try {
        new URL(path);
        return true;
    } catch (err) {
        return false;
    }
}

handleArg();
