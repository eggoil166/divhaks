import "dotenv/config";
import readline from "readline";
import { askGemini } from "./opikapi";

// Create readline interface for terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Chat with Gemini! Type 'exit' to quit.");

function promptUser() {
  rl.question("> ", async (input) => {
    if (input.trim().toLowerCase() === "exit") {
      rl.close();
      return;
    }

    try {
      const reply = await askGemini(input);
      console.log("Gemini:", reply);
    } catch (err) {
      console.error("Error:", err);
    }

    promptUser();
  });
}

promptUser();
