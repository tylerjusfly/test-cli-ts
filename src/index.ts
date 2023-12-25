#!/usr/bin/env node

import { parseArgumentsIntoOptions, promptForMissingOptions } from "./cli";

export async function cli(args: string[]) {
  let options = parseArgumentsIntoOptions(args);

  options = await promptForMissingOptions(options);

  console.log(options);
}

cli(process.argv);