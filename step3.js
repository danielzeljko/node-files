const axios = require("axios");
const fsP = require("fs/promises");
const URL = require("url").URL;
const arg = process.argv[2];

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

async function echo(contents, path) {
    try {
        await fsP.writeFile(path, contents, "utf8");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

// TODO: fix the try block
async function webCat(url) {
    try {
        const resp = await axios.get(url);
        console.log(resp.data.slice(0, 80), "...");
    } catch (err) {
        console.log(
            `Error fetching ${url}:
            Error: Request failed with status code ${err.response.status}`
        );
        process.exit(1);
    }
}

if (arg === "--out") {
    exportFile();
} else {
    try {
        new URL(arg);
        webCat(arg);
    } catch (err) {
        cat(arg);
    }
}

async function exportFile() {
    const newPath = process.argv[3];
    const ogPath = process.argv[4];

    let ogContents;
    try {
        ogContents = await cat(ogPath);
        await echo(ogContents, newPath);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
