import inquirer from 'inquirer';
import { config as loadEnv } from 'dotenv';

import { GAMES } from './games';
import handler from './handler.js';

const run = async () => {
  const { gameName } = await inquirer.prompt([
    {
      name: 'gameName',
      type: 'list',
      message: 'Choose a game:',
      choices: Object.keys(GAMES),
    },
  ]);

  handler({ gameName });
};

loadEnv();
run();
