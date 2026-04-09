#!/usr/bin/env bun

import { tmpdir } from "node:os";
import { join } from "node:path";
import { connect } from "./connect.ts";

const browser = await connect();
const page = await browser.getActivePage();

if (!page) {
	console.error("✗ No active tab found");
	process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const filename = `screenshot-${timestamp}.png`;
const filepath = join(tmpdir(), filename);

await page.screenshot({ path: filepath });
console.log(filepath);

await browser.disconnect();
