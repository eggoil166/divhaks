import "dotenv/config";
import readline from "readline";
import { askGemini } from "./opikapi";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Chat with Gemini! Type 'exit' to quit.");

const chat = () => {
  rl.question("> ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    try {
      await askGemini(input);
    } catch (error) {
      console.error("Error:", error);
    }

    chat();
  });
};

chat();