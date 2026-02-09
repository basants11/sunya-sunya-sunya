import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Next.js provides flat-config presets via `eslint-config-next`.
// Using them directly avoids legacy-compat layers that can break under ESLint v9.
const coreWebVitals = require("eslint-config-next/core-web-vitals");
const typescript = require("eslint-config-next/typescript");

export default [...coreWebVitals, ...typescript];

