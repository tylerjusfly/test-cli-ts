#!/usr/bin/env node

import { parseArgumentsIntoOptions, promptForMissingOptions } from "./cli.js";
import { IcreateProject, createProject } from "./manipulate-template.js";
import figlet from "figlet";
import { cliVersion } from "./version.js";

export async function cli(args: string[]) {
  console.log(figlet.textSync("Node Mongo Cli"));

  let options = parseArgumentsIntoOptions(args);

  try {
    if (options.version) {
      cliVersion();
    } else {
      // options = await promptForMissingOptions(options);
      // await createProject(options as IcreateProject);
      console.log(options);
    }
  } catch (error) {
    console.log("Error");
  }
}



cli(process.argv);