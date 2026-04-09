# pi-teammate 3-agent demo

This repository demonstrates how **3 pi agents collaborate in separate terminal sessions** to complete a shared task over a common team channel.

## Team setup

The demo uses 3 agents:

- **Rachel** (`./designer`) — designer
- **Drew** (`./developer`) — developer
- **Joseph** (`./tester`) — tester

Each agent runs in its **own terminal pane or window** and joins the same team channel.

### Responsibilities

- **Rachel** designs the experience, gives creative direction, and verifies results in the browser.
- **Drew** implements the game and code changes.
- **Joseph** reviews, tests, and validates the work.

Rachel has the **`browser-devtools`** skill enabled, which allows opening Chrome and verifying the result visually.

> Note: the bundled browser skill is configured for **macOS Chrome** by default. If you are on another OS, update the Chrome path in:
>
> `designer/.pi/skills/browser-devtools/SKILL.md`

The other 2 agents do not need extra skills beyond their LLM.

## Prerequisites

1. Install `pi`
2. Install the `pi-teammate` extension:

```bash
pi install npm:pi-teammate
```

GitHub: https://github.com/ross-jill-ws/pi-teammate

## Optional: voice support

If you have an ElevenLabs API key, set it before starting the agents:

```bash
export ELEVENLABS_API_KEY=sk_xxx
```

## Run the 3-agent demo

Open **3 terminal sessions**.

### 1) Start Rachel in `./designer`

```bash
cd ./designer
pi --team-channel fighter --team-new
```

### 2) Start Drew in `./developer`

```bash
cd ./developer
pi --team-channel fighter
```

### 3) Start Joseph in `./tester`

```bash
cd ./tester
pi --team-channel fighter
```

## Demo workflow

After all 3 agents are running, send the following prompt in **Rachel's** window:

```text
Design a simple browser-playable 3D airplane combat game using Three.js with a short 5-mission campaign and one boss fight.
```

## What happens during the demo

Because all 3 agents are connected to the same `fighter` team channel, they can coordinate as a team:

- Rachel leads on concept, UX, and visual review
- Drew handles implementation details
- Joseph validates quality and testing

This demonstrates how specialized agents can divide work while staying synchronized through `pi-teammate`.

## Monitor the collaboration in a web UI

To watch how the 3 agents communicate, start the team UI:

```bash
npx pi-teammate-ui
```

Then open:

```text
http://localhost:3456
```

## Summary

This sample shows a simple but effective multi-agent workflow:

- **1 designer** with browser verification
- **1 developer** for implementation
- **1 tester** for QA
- all collaborating through a shared `pi-teammate` channel
