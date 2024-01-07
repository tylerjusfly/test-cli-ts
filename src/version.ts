import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const package_json = require("../package.json");

export const cliVersion = () => {
  console.log(`node-mongo-cli v${package_json.version}`);
};
