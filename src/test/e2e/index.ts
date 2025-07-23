import { getRandomPort } from "get-port-please";
import fs from "node:fs";

function normalizeInput(input: string): string {
  return (
    input
      // Replace non-alphanumeric characters with a hyphen.
      .replace(/[^a-zA-Z0-9]/g, "-")
      // Replace multiple hyphens with a single hyphen.
      .replace(/-+/g, "-")
      // Remove leading and trailing hyphens.
      .replace(/^-|-$/g, "")
      .toLowerCase()
  );
}

/**
 * Check if a port has been allocated, if it hasn't generate a random port and save it.
 * @param {string} input - port test allocation
 * @returns {number} A random port.
 */
export async function derivePort(input: string): Promise<number> {
  input = normalizeInput(input);

  const portFile = `port-${input}.txt`;

  if (!fs.existsSync(portFile)) {
    const portNumber = await getRandomPort();
    await fs.promises.writeFile(portFile, portNumber.toString());
    console.info(`Mapped "${input}" to port ${portNumber}`);
    return portNumber;
  }

  return parseInt(await fs.promises.readFile(portFile, "utf-8"), 10);
}
