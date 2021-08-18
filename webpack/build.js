import fs from "fs";
import { join } from "path";
import { promisify } from "util";
import { buildFolder, rootFolder } from "../paths.js";
import { productionCompiler } from "./compiler.js";
import fsExtra from "fs-extra";
import { html } from "./html.js";

const { copy } = fsExtra;
const rm = promisify(fs.rm);
const mkdir = promisify(fs.mkdir);
const symlink = promisify(fs.symlink);
const writeFile = promisify(fs.writeFile);

const build = async () => {
  await rm(buildFolder, { recursive: true });
  await mkdir(buildFolder, { recursive: true });
  console.log('Build html...');
  await writeFile(join(buildFolder, "CNAME"), 'proof.babaeee.ir');
  await writeFile(join(buildFolder, ".nojekyll"), '');
  const p = "32664";
  console.log('Webpack js and css...');
  const success = await new Promise((res) =>
    productionCompiler.run((err, stats) => {
      if (err) {
        console.log(err);
        res(false);
        return;
      }
      if (stats.hasErrors()) {
        console.log(stats.toString({ colors: true }));
        res(false);
        return;
      }
      res(true);
    })
  );
  if (!success) {
    console.log('Failed.');
    process.exit(1);
  }
  console.log('Copying jscoq dependencies...');
  const jscoqLibs = ['jscoq', 'jquery', 'codemirror', 'jszip', 'localforage'];
  await Promise.all(jscoqLibs.map((l)=>copy(
    join(rootFolder, "node_modules", l),
    join(buildFolder, "node_modules", l),
  )));
  console.log("Done.");
};

build();
