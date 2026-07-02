import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const distDir = new URL("../dist/", import.meta.url);

const readDistFile = (fileName) =>
  readFile(new URL(fileName, distDir), "utf8");

const indexHtml = await readDistFile("index.html");

assert.match(
  indexHtml,
  /<link rel="manifest" href="\/manifest\.webmanifest"\s*\/?>/,
  "built HTML should link to the web app manifest",
);

assert.match(
  indexHtml,
  /<meta name="theme-color" content="#101820" \/>/,
  "built HTML should set the install theme color",
);

const manifest = JSON.parse(await readDistFile("manifest.webmanifest"));

assert.equal(manifest.name, "Avatar Dropdown Demo");
assert.equal(manifest.short_name, "Avatar Demo");
assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "/");
assert.equal(manifest.theme_color, "#101820");
assert.ok(
  manifest.icons.some(
    (icon) =>
      icon.src === "/pwa-icon.svg" &&
      icon.type === "image/svg+xml" &&
      icon.purpose.includes("maskable"),
  ),
  "manifest should include the SVG maskable app icon",
);

assert.ok(
  existsSync(join(distDir.pathname, "sw.js")),
  "build should generate a service worker",
);

const entryScripts = [...indexHtml.matchAll(/<script[^>]+src="([^"]+)"/g)].map(
  ([, src]) => src.replace(/^\//, ""),
);
const bundles = await Promise.all(entryScripts.map((src) => readDistFile(src)));
const appBundle = bundles.join("\n");

assert.match(
  appBundle,
  /serviceWorker/,
  "app bundle should register a service worker",
);

assert.match(
  appBundle,
  /\/sw\.js/,
  "app bundle should point registration at the generated service worker",
);
