import fs from "fs";
import { join } from "path";
import { promisify } from "util";
import { buildFolder, rootFolder } from "../paths.js";
import { developmentCompiler } from "./compiler.js";
import { html } from "./html.js";
import { serveDev } from "./serveDev.js";

const rm = promisify(fs.rm);
const mkdir = promisify(fs.mkdir);
const symlink = promisify(fs.symlink);
const writeFile = promisify(fs.writeFile);

const dev = async () => {
  await rm(buildFolder, { recursive: true, force: true });
  await mkdir(buildFolder, { recursive: true });
  const p = '32664';
  developmentCompiler.watch({
    ignores: /node_modules/,
  }, (err, stats) => {
    if (err) {
      console.log(err);
    }
    //if (stats.hasErrors()) {
      console.log(stats.toString({ colors: true }));
    //}
    console.log(`Serving at http://localhost:${p}/`);
  });
  symlink(join(rootFolder, 'node_modules'), join(buildFolder, 'node_modules'));
  serveDev(p);
};

dev();
