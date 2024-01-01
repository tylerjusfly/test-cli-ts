#!/usr/bin/env node

import { parseArgumentsIntoOptions, promptForMissingOptions } from "./cli.js";
import { IcreateProject, createProject } from "./manipulate-template.js";
import figlet from "figlet";
import { Command } from "commander";

export async function cli(args: string[]) {
  console.log(figlet.textSync("Node Mongo Cli"));

  let options = parseArgumentsIntoOptions(args);

  options = await promptForMissingOptions(options);

  await createProject(options as IcreateProject);
  // console.log(options);
}



cli(process.argv);