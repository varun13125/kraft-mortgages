// Entry point so `node --test tests/specialty/` works: Node 24 treats a directory argument as a
// module path and resolves it to this index.js, which loads every *.test.mjs file in this folder.
// (Running the files directly also works: node --test tests/specialty/*.test.mjs)
const { readdirSync } = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

(async () => {
  const files = readdirSync(__dirname)
    .filter((f) => f.endsWith(".test.mjs"))
    .sort();
  for (const file of files) {
    await import(pathToFileURL(path.join(__dirname, file)).href);
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
