import * as dotenv from "@std/dotenv";
import * as path from "@std/path";
import * as cli from "@std/cli";
import OpenAI from "openai";

const availableVoices = [
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "onyx",
  "nova",
  "sage",
  "shimmer",
  "verse",
] as const;

type Voice = (typeof availableVoices)[number];

function isValidVoice(value: string): value is Voice {
  return (availableVoices as readonly string[]).includes(value);
}

const availableModels = [
  "tts-1",
  "tts-1-hd",
  "gpt-4o-mini-tts",
] as const;

type Model = (typeof availableModels)[number];

function isValidModel(value: string): value is Model {
  return (availableModels as readonly string[]).includes(value);
}

const { input, out, voice, model } = cli.parseArgs(Deno.args, {
  string: ["input", "out", "voice", "model"],
  default: { voice: "onyx", model: "tts-1" },
});

if (!input || !out) {
  console.error(`Usage: tts --input input/file.txt --out out.mp3`);
  Deno.exit(1);
}

if (!isValidVoice(voice)) {
  console.error(
    `Invalid voice: "${voice}". Please choose from: ${
      availableVoices.join(", ")
    }`,
  );
  Deno.exit(1);
}

if (!isValidModel(model)) {
  console.error(
    `Invalid model: "${model}". Please choose from: ${
      availableModels.join(", ")
    }`,
  );
  Deno.exit(1);
}

const envPath = path.join(import.meta.dirname!, ".env");
const env = await dotenv.load({
  envPath,
});

const openai = new OpenAI({
  apiKey: env["OPENAI_API_KEY"],
});

const mp3 = await openai.audio.speech.create({
  model: model as Model,
  voice: voice as Voice,
  input: await Deno.readTextFile(input),
});

const buffer = await mp3.arrayBuffer();
const uint8Array = new Uint8Array(buffer);
await Deno.writeFile(out, uint8Array);
console.log(`Speech saved to ${out}`);
