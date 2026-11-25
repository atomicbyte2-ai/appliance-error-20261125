import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The funniest honest error message an appliance could show:
// a robot vacuum, stuck under the sofa, keeping a deadpan tally
// of the one witness that refuses to help.
const LINE =
  "ERROR: Stuck under the sofa since Tuesday. The cat has walked past me 214 times. It has not helped once.";

function validate(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry must be a single line");
  }
  // Reject control characters (other than none allowed here).
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("entry must not contain control characters");
  }
}

validate(LINE);

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outputDir, { recursive: true });
const outPath = join(outputDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
// Read back and confirm the file is exactly the line: no trailing
// newline, no extra bytes, no encoding surprise.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the validated line");
}
console.log(`Wrote entry.txt (${LINE.length} characters)`);
