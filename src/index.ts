import { gptController } from "./pages/gpt/gpt.controller";
import { exec } from "child_process";

const start = async (modelName = "deepseek-coder") => {
  const stableDifussionPath =
    "/home/user/Documents/Pessoal/stable-diffusion-webui/webui.sh";
  //executeCommand(`${stableDifussionPath}`);
  const ollama = "ollama serve";
  //executeCommand(`${ollama}`);
  await gptController("gpt", false);
};

function executeCommand(command: string, callback?: () => void): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting model: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Error starting model: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      console.log(`successfully: ${stdout}`);
      resolve(callback && callback());
    });
  });
}

start();
