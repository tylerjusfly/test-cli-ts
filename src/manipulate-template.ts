import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";

interface IcopyTemplateFiles {
  templateDirectory: string;
  targetDirectory: string;
  //   template?: string;
}

export interface IcreateProject {
  skipPrompts: boolean;
  git: boolean;
  runInstall: boolean;
  template: string;
  templateDirectory: string;
  targetDirectory: string;
}

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options: IcopyTemplateFiles) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

export async function createProject(options: IcreateProject) {
  // create in thier specified dircetory or create project in the current working directory
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const currentFileUrl = new URL("file://" + path.resolve(__filename));

  const newUrl = currentFileUrl.pathname.substring(currentFileUrl.pathname.indexOf("/") + 1);

  //   const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(newUrl, "../../templates", options.template.toLowerCase());

  options.templateDirectory = templateDir;

  //   console.log("Current Directory:", templateDir);

  //   check if path exists
  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (error) {
    console.error(`%s Invalid template name`, chalk.red.bold("ERROR"));

    process.exit(1);
  }

  console.log("Copying project files...");

  await copyTemplateFiles(options);

  console.log("%s Project ready", chalk.green.bold("DONE"));

  return true;
}
