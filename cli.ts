import * as dotenv from "@std/dotenv";
import * as path from "@std/path";
import * as cli from "@std/cli";
import OpenAI from "openai";

const { input, out } = cli.parseArgs(Deno.args, {
  string: ["input", "out"],
});

if (!input || !out) {
  console.error(`Usage: tts --input input/file.txt --out out.mp3`);
  Deno.exit();
}

const envPath = path.join(import.meta.dirname!, ".env");
const env = await dotenv.load({
  envPath,
});

const openai = new OpenAI({
  apiKey: env["OPENAI_API_KEY"],
});

const mp3 = await openai.audio.speech.create({
  model: "tts-1",
  voice: "onyx",
  input: await Deno.readTextFile(input),
});

const buffer = await mp3.arrayBuffer();
const uint8Array = new Uint8Array(buffer);
await Deno.writeFile(out, uint8Array);
console.log(`Speech saved to ${out}`);
