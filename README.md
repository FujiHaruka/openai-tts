# OpenAI TTL API CLI

Installation:

```bash
deno install --global --name tts --allow-all --no-check --config deno.json --env-file -f ./cli.ts
```

Usage:

```bash
tts --input input/file.txt --out out.mp4
```

Additional Options:

```bash
tts --input input/file.txt --out out.mp4 --voice alloy --model tts-1-hd
```

see also, https://platform.openai.com/docs/api-reference/audio/createSpeech
