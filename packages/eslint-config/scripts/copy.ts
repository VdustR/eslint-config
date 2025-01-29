import fs from "fs-extra";
import path from "pathe";
import { packageDirectory } from "pkg-dir";

const filesToCopy = ["README.md", "LICENSE"] satisfies Array<string>;

(async () => {
  const pkgDir = await packageDirectory();
  if (!pkgDir) {
    throw new Error("Could not find package directory");
  }
  const rootPkgDir = await packageDirectory({
    cwd: path.resolve(pkgDir, ".."),
  });

  if (!rootPkgDir) {
    throw new Error("Could not find root package directory");
  }

  for (const file of filesToCopy) {
    await fs.copyFile(path.join(rootPkgDir, file), path.join(pkgDir, file));
  }
})();
