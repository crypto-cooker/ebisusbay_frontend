const { exec } = require('child_process');
const path = require('path');

// Get the directory of the current script
const SCRIPT_DIR = path.resolve(__dirname);

// Define the relative paths
const PANCAKE_FRONTEND_PATH = path.join(SCRIPT_DIR, '../pancake-frontend');
const EB_DEX_PATH = SCRIPT_DIR;

// Function to execute shell commands
function execCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

async function syncUpdates() {
  try {
    console.log('Checking if upstream remote exists...');
    try {
      await execCommand('git remote get-url upstream', PANCAKE_FRONTEND_PATH);
      console.log('Upstream remote already exists.');
    } catch (error) {
      console.log('Adding upstream remote...');
      await execCommand('git remote add upstream https://github.com/pancakeswap/pancake-frontend.git', PANCAKE_FRONTEND_PATH);
    }

    console.log('Fetching and merging updates from upstream...');
    await execCommand('git fetch upstream', PANCAKE_FRONTEND_PATH);
    await execCommand('git merge upstream/develop', PANCAKE_FRONTEND_PATH);

    console.log('Reinstalling dependencies in EB Dex...');
    await execCommand('pnpm install', EB_DEX_PATH);

    // console.log('Running code generation...');
    // await execCommand('pnpm run codegen', EB_DEX_PATH);

    console.log('Sync completed.');
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  }
}

syncUpdates();
