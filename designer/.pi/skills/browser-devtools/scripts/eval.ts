#!/usr/bin/env bun

import { connect } from "./connect.ts";

const code = process.argv.slice(2).join(" ");

if (!code) {
	console.log("Usage: eval.ts 'code'");
	console.log("\nExamples:");
	console.log('  eval.ts "document.title"');
	console.log('  eval.ts "document.querySelectorAll(\'a\').length"');
	process.exit(1);
}

const browser = await connect();
const page = await browser.getActivePage();

if (!page) {
	console.error("✗ No active tab found");
	process.exit(1);
}

const result = await page.evaluate((c: string) => {
	const AsyncFunction = (async () => {}).constructor as new (...args: string[]) => Function;
	return new AsyncFunction(`return (${c})`)();
}, code);

if (Array.isArray(result)) {
	for (let i = 0; i < result.length; i++) {
		if (i > 0) console.log("");
		for (const [key, value] of Object.entries(result[i])) {
			console.log(`${key}: ${value}`);
		}
	}
} else if (typeof result === "object" && result !== null) {
	for (const [key, value] of Object.entries(result as Record<string, unknown>)) {
		console.log(`${key}: ${value}`);
	}
} else {
	console.log(result);
}

await browser.disconnect();
