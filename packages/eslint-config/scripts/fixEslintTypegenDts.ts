/**
 * Because `unbuild` compile `import "./eslint-typegen" without resolving the path, we need to fix the path manually.
 */

import fs from "fs-extra";
import path from "pathe";
import { packageDirectory } from "pkg-dir";

(async () => {
  const pkgDir = await packageDirectory();
  if (!pkgDir) {
    throw new Error("Could not find package directory");
  }
  const targetPath = path.join(pkgDir, "dist/esm/vdustr.mjs");
  const content = await fs.readFile(targetPath, "utf-8");
  const fixedContent = content.replaceAll(
    '"./eslint-typegen"',
    '"./eslint-typegen.mjs"',
  );
  await fs.writeFile(targetPath, fixedContent);
})();
