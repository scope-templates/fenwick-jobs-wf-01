import { task, type TaskContext } from "@renderinc/sdk/workflows";
import { buildDigest, type Digest } from "./digest.js";

export interface DigestInput {
  date: string;
}

export const digest = task(
  // The digest is cheap and deterministic: a failed day should surface at once, not after three more attempts.
  { name: "digest", retry: { maxRetries: 0, waitDurationMs: 1000 }, timeoutSeconds: 120 },
  function digest(ctx: TaskContext, input: DigestInput): Digest {
    console.log(`building digest for ${input.date}`);
    const result = buildDigest(input.date);
    console.log(`digest for ${result.date}: ${result.total} item(s) in ${result.sections.length} section(s)`);
    return result;
  },
);
