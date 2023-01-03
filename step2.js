const axios = require("axios");
const fsP = require("fs/promises");
const URL = require("url").URL;
const path = process.argv[2];

async function cat(path) {
    try {
        const contents = await fsP.readFile(path, "utf8");
        console.log(contents);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

async function webCat(url) {
    try {
        const resp = await axios.get(url);
        console.log(resp.data.slice(0, 80), "...");
    } catch (err) {
        console.log(
            `Error: Request failed with status code ${err.response.status}`
        );
        process.exit(1);
    }
}


try {
    new URL(path);
    webCat(path);
} catch (err) {
    cat(path);
}
