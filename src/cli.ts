import arg from "arg";
import prompts from "prompts";

interface PropsOption {
  skipPrompts: boolean;
  template: string | undefined;
  git: boolean;
  runInstall: boolean;
}

const defaultTemplate = "JavaScript";

export function parseArgumentsIntoOptions(rawArgs: string[]) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false,
  };
}

export async function promptForMissingOptions(options: PropsOption) {
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  // ask user questions
  const questions: prompts.PromptObject<string> | prompts.PromptObject<string>[] = [];

  if (!options.template) {
    questions.push({
      type: "select",
      name: "template",
      message: "Please choose which template to use",
      choices: [
        { title: "JavaScript", value: "JavaScript" },
        { title: "TypeScript", value: "TypeScript" },
      ],
      initial: 0,
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repo",
      initial: false,
    });
  }

  const answers = await prompts(questions);

  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
  };
}
