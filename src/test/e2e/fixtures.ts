import { createNetworkFixture, type NetworkFixture } from "@msw/playwright";
import { test as testBase } from "@playwright/test";
import { execSync } from "child_process";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import v8toIstanbul from "v8-to-istanbul";

export function generateUUID(): string {
  return crypto.randomBytes(16).toString("hex");
}

export interface AgoraPwFixtures {
  network: NetworkFixture;
}

export interface AgoraPwFixtureConfig {
  coverage?: {
    /**
     * directory where the e2e coverage temporary files will be stored.
     *
     * @default ${reportDir}/.tmp
     */
    tempDir?: string;
    /**
     * The directory where the final coverage report will be stored.
     *
     * @default ${process.cwd()}/coverage/e2e
     */
    reportDir?: string;
    /**
     * List of files to include in the coverage report.
     *
     * @default "[**]"
     */
    include?: string[];
    /**
     * List of files to exclude from the coverage report.
     */
    exclude?: string[];
  };
}

export function newAgoraPwFixture({ coverage = {} }: AgoraPwFixtureConfig) {
  const test = testBase.extend<AgoraPwFixtures>({
    // Create a fixture that will control the network in your tests.
    network: createNetworkFixture({
      initialHandlers: [],
    }),
  });

  const {
    reportDir = path.join(process.cwd(), "./coverage/e2e/"),
    tempDir = path.join(reportDir, "./.tmp"),
    include = ["**"],
    exclude = [],
  } = coverage;

  const excludeCoverageFile = (filePath: string): boolean => {
    return (
      exclude.some((pattern) => path.matchesGlob(filePath, pattern)) ||
      !include.some((pattern) => path.matchesGlob(filePath, pattern))
    );
  };

  test.beforeAll(async () => {
    await fs.promises.mkdir(tempDir, { recursive: true });
  });

  test.beforeEach(async ({ page }) => {
    await page.coverage.startJSCoverage();
  });

  test.afterEach(async ({ page }) => {
    const coverage = await page.coverage.stopJSCoverage();

    for (const entry of coverage) {
      if (!entry.source) continue;

      // Only look for files in the src directory.
      const converter = v8toIstanbul("", 0, { source: entry.source }, excludeCoverageFile);
      await converter.load();

      const report = converter.toIstanbul();

      // Ignore empty reports.
      if (Object.keys(report).length === 0) continue;

      converter.applyCoverage(entry.functions);
      fs.writeFileSync(path.join(tempDir, `playwright_coverage_${generateUUID()}.json`), JSON.stringify(report));
    }
  });

  test.afterAll(async () => {
    console.log("-> \x1b[34m%s\x1b[0m", "Generating coverage report...");
    // Exec nyc command.
    const command = `npx nyc report --reporter=json --report-dir="${reportDir}" --temp-dir=${tempDir} --exclude-after-remap=false`;
    const res = execSync(command);
    console.log("\x1b[32m%s\x1b[0m", "✓", "Coverage generated successfully:\n", res.toString().trim());
  });

  return test;
}
