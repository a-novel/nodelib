import type { ViewportSize } from "playwright";
import type { Page } from "playwright/test";

export async function Screenshot(page: Page, name: string, viewPort: ViewportSize | null, browserName: string) {
  if (!process.env.E2E_TAKE_SCREENSHOTS) return;

  if (viewPort) {
    name = `${name}-${viewPort.width}x${viewPort.height}`;
  }

  await page.screenshot({ path: `__test__/screenshots/${browserName}/${name}.png` });
}
