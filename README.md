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
Act as an experienced indie game designer and gameplay programmer. Help me design a simple but stylish 3D aerial combat shooter built with Three.js for the web.

I want an original game inspired by the fast, cinematic feeling of arcade jet combat games, but much smaller in scope, easier to build, and realistic for a solo developer or very small team.

Design the game with these constraints:
- Built in Three.js
- Browser-playable
- Simple controls
- Short campaign with 5 missions total
- At least 1 memorable boss fight
- Low-to-medium technical complexity
- Focus on fun, clarity, and spectacle over realism
- Keep systems lightweight and feasible

Please structure the response like this:

1. Game Concept
- Game title ideas
- One-paragraph high concept
- Core fantasy
- What makes it fun and unique

2. Core Gameplay
- Basic gameplay loop
- Player controls
- Flight style
- How movement should feel
- How arcade-like vs realistic it should be

3. Combat Design
- Main gun
- Missiles
- Lock-on system
- Boost / dodge / evasive move
- Health / damage system
- Enemy types
- How explosions, hits, and feedback should feel
- Keep combat simple enough for Three.js

4. Mission Structure
Create 5 missions with:
- Mission name
- Setting
- Main objective
- Enemy types used
- Scripted moments
- End condition
Make the final mission a boss fight.

5. Boss Fight
Design 1 big boss encounter:
- Boss concept
- Attack patterns
- Weak points
- Phases
- Arena idea
- Why it feels exciting but still feasible to build

6. Scope and Technical Simplicity
- Recommend the simplest systems to implement in Three.js
- Suggest what to fake instead of simulate
- Keep AI and physics lightweight
- Suggest easy camera, HUD, and effects ideas
- Mention how to make it look impressive without being technically heavy

7. Progression
- Simple unlock or upgrade system
- Reward structure across 5 missions
- Optional replay value ideas

8. Visual and Audio Style
- Art direction that works well in low scope
- Sky, clouds, terrain, enemy design
- HUD style
- Music and sound direction

9. Build Plan
Give me a practical prototype plan:
- What to build first
- What to cut if scope gets too big
- Minimum viable version
- Polished version

Important:
- Keep the game original
- Do not make it too realistic or simulation-heavy
- Avoid overly complex physics
- Prefer clever illusions over difficult systems
- Assume limited art assets and limited dev time
- Be specific and practical
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
