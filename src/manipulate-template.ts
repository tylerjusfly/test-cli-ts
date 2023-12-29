import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import { execa } from "execa";
import { mkdirp } from "mkdirp";
import Listr from "listr";
import { projectInstall } from "pkg-install";

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
  folderName: string;
}

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options: IcopyTemplateFiles) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

async function initGit(options: { targetDirectory: string }) {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });

  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize Git"));
  }
  return;
}

export async function createProject(options: IcreateProject) {
  // create in thier specified dircetory or create project in the current working directory

  const currentWorkDir = options.targetDirectory || process.cwd();

  const made = mkdirp.sync(`${currentWorkDir}/${options.folderName}`);

  if (made === undefined) {
    console.error(`%s Error creating project name`, chalk.red.bold("FOLDER ERROR"));
    process.exit(1);
  }

  console.log(`created project folder, starting with ${made}`);

  options = {
    ...options,
    targetDirectory: made,
  };

  //   const currentFileUrl = new URL("file://" + path.resolve(__filename));
  const currentFileUrl = new URL(import.meta.url);

  const newUrl = currentFileUrl.pathname.substring(currentFileUrl.pathname.indexOf("/") + 1);

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

  const tasks = new Listr([
    {
      title: "Copy project files",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "Initialize git",
      task: () => initGit({ targetDirectory: options.targetDirectory }),
      enabled: () => options.git,
    },
    {
      title: "Install dependencies",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () => (!options.runInstall ? "Pass --install to automatically install dependencies" : undefined),
    },
  ]);

  await tasks.run();

  console.log("%s Project ready", chalk.green.bold("DONE"));

  return true;
}
