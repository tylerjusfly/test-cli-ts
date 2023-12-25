#!/usr/bin/env node

import { parseArgumentsIntoOptions, promptForMissingOptions } from "./cli";
import { IcreateProject, createProject } from "./manipulate-template";

export async function cli(args: string[]) {
  let options = parseArgumentsIntoOptions(args);

  options = await promptForMissingOptions(options);

  await createProject(options as IcreateProject);
  //   console.log(options);
}

cli(process.argv);