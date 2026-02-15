const fs = require("fs/promises");
const path = require("path");
const terser = require("terser");

const INPUT_FILE = "linux-do-newyear.user.js";
const OUTPUT_FILE = "linux-do-newyear.min.user.js";
const TERSER_OPTIONS = {
  ecma: 2020,
  compress: {
    ecma: 2020,
    passes: 2,
    toplevel: true,
  },
  mangle: {
    toplevel: true,
  },
  format: {
    comments: false,
    ascii_only: true,
  },
};

async function build() {
  const inputPath = path.resolve(__dirname, INPUT_FILE);
  const outputPath = path.resolve(__dirname, OUTPUT_FILE);
  const source = await fs.readFile(inputPath, "utf8");

  const headerMatch = source.match(
    /\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/
  );

  if (!headerMatch) {
    throw new Error("Userscript metadata block not found.");
  }

  const header = headerMatch[0].trim();
  const body = source.replace(headerMatch[0], "").trim();
  const result = await terser.minify(body, TERSER_OPTIONS);

  if (!result.code) {
    throw new Error("Terser returned empty output.");
  }

  const output = `${header}\n\n${result.code}\n`;
  await fs.writeFile(outputPath, output, "utf8");
}

build().catch((error) => {
  console.error("Build failed:", error.message);
  process.exit(1);
});
