import fs from "fs";
import { join } from "path";
import { promisify } from "util";
import { buildFolder, rootFolder } from "../paths.js";
import { developmentCompiler } from "./compiler.js";
import { serveDev } from "./serveDev.js";

const rmdir = promisify(fs.rmdir);
const mkdir = promisify(fs.mkdir);
const symlink = promisify(fs.symlink);
const writeFile = promisify(fs.writeFile);

const dev = async () => {
  await rmdir(buildFolder, { recursive: true });
  await mkdir(buildFolder, { recursive: true });
  await writeFile(join(buildFolder, 'index.html'), `
  <html><head></head><body><script src="/dist/bundle.js"></script></body></html>
  `);
  const p = '32664';
  developmentCompiler.watch({
    ignores: /node_modules/,
  }, (err, stats) => {
    if (err) {
      console.log(err);
    }
    if (stats.hasErrors()) {
      console.log(stats.toString({ colors: true }));
    }
    console.log(`Serving at http://localhost:${p}/`);
  });
  symlink(join(rootFolder, 'node_modules'), join(buildFolder, 'node_modules'));
  serveDev(p);
};

dev();
