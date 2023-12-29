#!/usr/bin/env node

import { parseArgumentsIntoOptions, promptForMissingOptions } from "./cli.js";
import { IcreateProject, createProject } from "./manipulate-template.js";


export async function cli(args: string[]) {
  let options = parseArgumentsIntoOptions(args);

  options = await promptForMissingOptions(options);

  await createProject(options as IcreateProject);
  // console.log(options);
}

cli(process.argv);