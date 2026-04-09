#!/usr/bin/env bun

import { spawn, execSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const cdpUrl = process.env.BROWSER_CDP_URL ?? "http://localhost:9222";
const port = new URL(cdpUrl).port || "9222";
const chromePath =
	process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const profileSource =
	process.env.CHROME_PROFILE_SOURCE ??
	`${process.env.HOME}/Library/Application Support/Google/Chrome/`;

const args = process.argv.slice(2);
const useProfile = args.includes("--profile");
const profileDirArg = args.find((a) => a.startsWith("--profile-directory="));
const profileDirectory = profileDirArg ? profileDirArg.split("=").slice(1).join("=") : null;

const invalidArgs = args.filter((a) => a !== "--profile" && !a.startsWith("--profile-directory="));
if (invalidArgs.length > 0) {
	console.log("Usage: start.ts [--profile] [--profile-directory=<name>]");
	console.log("\nOptions:");
	console.log("  --profile                      Copy your Chrome profile (cookies, logins)");
	console.log("  --profile-directory=<name>     Specific Chrome profile (e.g. Default, 'Profile 12')");
	console.log("\nExamples:");
	console.log("  start.ts                                        # Fresh profile");
	console.log("  start.ts --profile                              # Your default Chrome profile");
	console.log("  start.ts --profile --profile-directory=Default  # Specific named profile");
	process.exit(1);
}

// Check if Chrome is already running and accessible on the CDP port
let alreadyRunning = false;
try {
	const browser = await puppeteer.connect({
		browserURL: cdpUrl,
		defaultViewport: null,
	});
	await browser.disconnect();
	alreadyRunning = true;
} catch {}

if (alreadyRunning) {
	console.log(`✓ Chrome already running on :${port}, skipping start`);
	process.exit(0);
}

// Kill existing Chrome (not responding on CDP port, stale process)
try {
	execSync("killall 'Google Chrome'", { stdio: "ignore" });
} catch {}

await new Promise((r) => setTimeout(r, 1000));

// Setup profile directory
const scrapingDir = `${process.env.HOME}/.cache/scraping`;
execSync(`mkdir -p ${scrapingDir}`, { stdio: "ignore" });

if (useProfile) {
	execSync(`rsync -a --delete "${profileSource}" ${scrapingDir}/`, { stdio: "pipe" });
}

// Build Chrome args
const chromeArgs = [
	`--remote-debugging-port=${port}`,
	`--user-data-dir=${scrapingDir}`,
];
if (profileDirectory) {
	chromeArgs.push(`--profile-directory=${profileDirectory}`);
}

// Start Chrome in background
spawn(chromePath, chromeArgs, { detached: true, stdio: "ignore" }).unref();

// Wait for Chrome to be ready
let connected = false;
for (let i = 0; i < 30; i++) {
	try {
		const browser = await puppeteer.connect({
			browserURL: cdpUrl,
			defaultViewport: null,
		});
		await browser.disconnect();
		connected = true;
		break;
	} catch {
		await new Promise((r) => setTimeout(r, 500));
	}
}

if (!connected) {
	console.error("✗ Failed to connect to Chrome");
	process.exit(1);
}

const profileInfo = profileDirectory ? ` (${profileDirectory})` : "";
console.log(`✓ Chrome started on :${port}${useProfile ? ` with your profile${profileInfo}` : ""}`);
