#!/usr/bin/env node
import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:3000/agent-4', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'agent4-screenshot.png', fullPage: false });
  await browser.close();
  console.log('Screenshot saved to agent4-screenshot.png');
}

main().catch(console.error);
