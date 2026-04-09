#!/usr/bin/env bun

import { connect } from "./connect.ts";

const url = process.argv[2];
const newTab = process.argv[3] === "--new";

if (!url) {
	console.log("Usage: nav.ts <url> [--new]");
	console.log("\nExamples:");
	console.log("  nav.ts https://example.com       # Navigate current tab");
	console.log("  nav.ts https://example.com --new  # Open in new tab");
	process.exit(1);
}

const browser = await connect();

if (newTab) {
	const page = await browser.newPage();
	await page.goto(url);
	console.log("✓ Opened:", url);
} else {
	const page = await browser.getActivePage();
	if (!page) {
		console.error("✗ No active tab found");
		process.exit(1);
	}
	await page.goto(url);
	console.log("✓ Navigated to:", url);
}

await browser.disconnect();
