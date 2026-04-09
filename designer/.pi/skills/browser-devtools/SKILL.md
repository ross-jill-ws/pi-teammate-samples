---
name: browser-devtools
description: Minimal browser automation via CDP using Puppeteer. Start Chrome, navigate URLs, evaluate JavaScript in page context, and take screenshots. Use when working on web frontends, scraping, or any browser interaction task.
---

# Browser DevTools

Minimal CDP-based browser tools using Puppeteer. Core scripts are in `scripts/`. Reusable task-specific scripts are in `custom_scripts/` (see [Custom Scripts](#custom-scripts-reusable-task-automation)).

## Setup

```bash
cd <skill-dir> && bun install
```

## Start Chrome

```bash
bun scripts/start.ts                           # Fresh profile
bun scripts/start.ts --profile                  # Copy your Chrome profile (cookies, logins)
bun scripts/start.ts --profile --profile-directory=Default  # Specific profile
```

**⚠️ IMPORTANT: Do NOT resize the browser window or change the zoom level. Always operate and take screenshots at the original browser size.**

Starts Chrome on `:9222` with remote debugging. If Chrome is already reachable on the CDP port, the script skips launching and prints a message. Otherwise it kills any stale Chrome and starts a fresh instance with the default or user-given profile.

## Navigate

```bash
bun scripts/nav.ts https://example.com          # Navigate current tab
bun scripts/nav.ts https://example.com --new    # Open in new tab
```

## Evaluate JavaScript

```bash
bun scripts/eval.ts 'document.title'
bun scripts/eval.ts 'document.querySelectorAll("a").length'
bun scripts/eval.ts 'Array.from(document.querySelectorAll("a")).map(a => ({href: a.href, text: a.textContent.trim()}))'
```

Execute JavaScript in the active tab's page context (async supported).

## Drag and Drop

```bash
bun scripts/drag.ts <fromX> <fromY> <toX> <toY> [steps]
```

Performs a real mouse drag from one coordinate to another using Puppeteer's native mouse API (mousedown → mousemove in steps → mouseup). This works with UI frameworks like Angular Gridster2 that require actual mouse events — `dispatchEvent(new MouseEvent(...))` from `eval.ts` does NOT work for drag-and-drop in these frameworks.

**Steps:**
1. Use `eval.ts` to find element center coordinates:
   ```bash
   bun scripts/eval.ts '(() => {
     const el = document.querySelector("#my-element");
     const r = el.getBoundingClientRect();
     return {cx: Math.round(r.x + r.width/2), cy: Math.round(r.y + r.height/2)};
   })()'
   ```
2. Drag to the target position:
   ```bash
   bun scripts/drag.ts 860 459 1350 211 30
   ```
3. Take a screenshot to verify:
   ```bash
   bun scripts/screenshot.ts
   ```

The `steps` parameter (default: 20) controls how many intermediate mousemove events are fired. More steps = smoother/slower drag. 20-30 steps works well in practice.

## Screenshot

```bash
bun scripts/screenshot.ts
```

Takes a screenshot of the current viewport, outputs the temp file path.

## Custom Scripts (Reusable Task Automation)

The `custom_scripts/` directory stores Puppeteer scripts written on demand for repetitive browser tasks, so the same logic doesn't need to be rewritten each time.

**Workflow:**

1. **Before writing a new script**, check `custom_scripts/index.md` for an existing script that matches the task.
2. **If a matching script exists**, invoke it directly (e.g. `bun custom_scripts/login-flow/login.ts`).
3. **If no matching script exists**, write new Puppeteer script(s) on demand, organize them in a descriptively-named subfolder under `custom_scripts/`, and update `custom_scripts/index.md` with the new entry (folder name, when to use, and what each script does).
4. **If a matching script exists but needs changes** (e.g. the target UI changed), perform the task with your new on-demand scripts, then update the existing scripts in-place so they stay current for future use.

**Structure:**
```
custom_scripts/
├── index.md                    # Registry of all custom scripts with descriptions
├── login-flow/                 # Example: subfolder per task
│   ├── login.ts
│   └── logout.ts
└── dashboard-export/           # One task may involve multiple scripts
    ├── navigate-to-export.ts
    └── download-csv.ts
```

Each subfolder should have an informative name describing the task. A single task may involve multiple scripts — group them together in one subfolder.

## Environment

- `BROWSER_CDP_URL`: CDP endpoint (default: `http://localhost:9222`)
- `CHROME_PATH`: Path to Chrome binary (default: macOS Chrome location)
- `CHROME_PROFILE_SOURCE`: Path to Chrome profile to sync (default: `~/Library/Application Support/Google/Chrome/`)
