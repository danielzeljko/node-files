const fsP = require("fs/promises");
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

cat(path);
