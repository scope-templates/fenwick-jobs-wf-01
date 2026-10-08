# Fenwick Jobs

Fenwick Jobs, a daily digest built by a workflow task. It reads the activity feed in `data/feed.json`, groups one day's entries by category, and writes a one-line summary for each.

## Running locally

```
npm install
npm run digest -- 2026-10-06
```

`npm run digest` prints the digest as JSON. Without a date it builds the digest for today. `npm run build` compiles `src/` into `dist/`, after which `node dist/digest.js 2026-10-06` does the same thing without `tsx`.

## Workflow

`src/workflow.ts` registers one Render Workflows task, `digest`. It takes a single argument, `{ "date": "YYYY-MM-DD" }`, and returns the digest for that day. The service builds with `npm ci && npm run build` and starts with `npm start`, which runs `dist/workflow.js` under the Render SDK.

Start a run through the Render API:

```
curl -X POST https://api.render.com/v1/task-runs \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"task": "fenwick-jobs/digest", "input": [{"date": "2026-10-06"}]}'
```

To run the task locally, start the Render CLI's task server with `render workflows dev -- npm start` (Render CLI 2.12 or later), then start a run from another terminal with `render workflows tasks start digest --local --input='[{"date": "2026-10-06"}]'`.

## Environment variables

None. The feed is read from `data/feed.json` next to the `src/` directory.

## Layout

- `src/digest.ts`: `buildDigest(date)` and the command-line entry point.
- `src/workflow.ts`: the `digest` task definition.
- `data/feed.json`: the sample activity feed.
