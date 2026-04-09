#!/usr/bin/env bun

/**
 * Drag from one point to another using Puppeteer's native mouse API.
 * Uses real mouse events (down → move in steps → up) which works with
 * frameworks like angular-gridster2 that listen for actual mouse interactions.
 *
 * Usage: drag.ts <fromX> <fromY> <toX> <toY> [steps]
 *
 * Tip: Use eval.ts to find element coordinates first, e.g.:
 *   eval.ts '(() => { const el = document.querySelector(".my-element"); const r = el.getBoundingClientRect(); return {cx: Math.round(r.x + r.width/2), cy: Math.round(r.y + r.height/2)} })()'
 */

import puppeteer from "puppeteer-core";

const cdpUrl = process.env.BROWSER_CDP_URL ?? "http://localhost:9222";
const args = process.argv.slice(2);

if (args.length < 4) {
	console.log("Usage: drag.ts <fromX> <fromY> <toX> <toY> [steps]");
	console.log("  steps: number of intermediate mouse move events (default: 20)");
	process.exit(1);
}

const [fromX, fromY, toX, toY] = args.slice(0, 4).map(Number);
const steps = Number(args[4] ?? 20);

const browser = await puppeteer.connect({ browserURL: cdpUrl, defaultViewport: null });
const pages = await browser.pages();
const page = pages.at(-1)!;

// Move to source position
await page.mouse.move(fromX, fromY);
await new Promise((r) => setTimeout(r, 200));

// Press and hold
await page.mouse.down();
await new Promise((r) => setTimeout(r, 300));

// Move in steps to simulate real drag
for (let i = 1; i <= steps; i++) {
	const x = fromX + (toX - fromX) * (i / steps);
	const y = fromY + (toY - fromY) * (i / steps);
	await page.mouse.move(x, y);
	await new Promise((r) => setTimeout(r, 30));
}

await new Promise((r) => setTimeout(r, 200));

// Release
await page.mouse.up();
await new Promise((r) => setTimeout(r, 500));

console.log(`Dragged from (${fromX}, ${fromY}) to (${toX}, ${toY}) in ${steps} steps`);

await browser.disconnect();
