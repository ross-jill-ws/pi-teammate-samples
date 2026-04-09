/**
 * Shared CDP connection module using Puppeteer.
 */

import puppeteer, { type Page } from "puppeteer-core";

export interface BrowserConnection {
	getActivePage(): Promise<ActivePage | null>;
	newPage(): Promise<ActivePage>;
	disconnect(): Promise<void>;
}

export interface ActivePage {
	goto(url: string, options?: { waitUntil?: string }): Promise<void>;
	evaluate(fn: (code: string) => unknown, code: string): Promise<unknown>;
	screenshot(options: { path: string }): Promise<void>;
}

const cdpUrl = process.env.BROWSER_CDP_URL ?? "http://localhost:9222";

function wrapPage(page: Page): ActivePage {
	return {
		async goto(url, options) {
			await page.goto(url, { waitUntil: (options?.waitUntil as any) ?? "domcontentloaded" });
		},
		async evaluate(fn, code) {
			return page.evaluate(fn, code);
		},
		async screenshot(opts) {
			await page.screenshot(opts);
		},
	};
}

export async function connect(): Promise<BrowserConnection> {
	const browser = await puppeteer.connect({
		browserURL: cdpUrl,
		defaultViewport: null,
	});
	return {
		async getActivePage() {
			const pages = await browser.pages();
			const page = pages.at(-1);
			return page ? wrapPage(page) : null;
		},
		async newPage() {
			return wrapPage(await browser.newPage());
		},
		async disconnect() {
			await browser.disconnect();
		},
	};
}
