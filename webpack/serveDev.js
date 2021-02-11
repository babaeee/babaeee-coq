import { spawn } from "child_process";
import { buildFolder } from "../paths.js";

export const serveDev = (p = '32664') => {
  const server = spawn('http-server', [
    buildFolder,
    '--port',
    p,
  ], {
    stdio: 'inherit',
  });
};
