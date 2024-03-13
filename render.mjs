import fsp from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";
import { Eta } from "eta";
import pick from "lodash.pick";

const args = process.argv.slice(2);

const TEMPLATES_DIR = "templates/";
const BUILD_DIR = "dist/";
const FRONTEND_ENVIRONMENT_VARIABLES = [
  "URL",
  "SITE_NAME",
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_AUDIENCE",
];

const eta = new Eta({ views: path.resolve(process.cwd(), TEMPLATES_DIR) });
const templates = await glob(`${TEMPLATES_DIR}*.eta`);

try {
  fs.statSync(BUILD_DIR);
} catch (e) {
  fs.mkdirSync(BUILD_DIR);
}

const render = async (templatePath) => {
  const parsedPath = path.parse(templatePath);
  const rendered = await eta.renderAsync(parsedPath.base, {
    env: pick(process.env, FRONTEND_ENVIRONMENT_VARIABLES),
  });
  await fsp.writeFile(path.resolve(BUILD_DIR, parsedPath.name), rendered, {
    flag: "w+",
  });
  console.log(
    `Rendered ${parsedPath.name}, wrote to ${path.join(
      BUILD_DIR,
      parsedPath.name
    )}`
  );
};

for (const templatePath of templates) {
  await render(templatePath);
}

if (args.includes("--watch")) {
  console.log("Watching for updates...");
  const ac = new AbortController();
  const { signal } = ac;
  // setTimeout(() => ac.abort(), 10000);

  (async () => {
    try {
      const watcher = fsp.watch(TEMPLATES_DIR, { signal });
      for await (const event of watcher) {
        render(path.join(TEMPLATES_DIR, event.filename));
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      throw err;
    }
  })();
}
