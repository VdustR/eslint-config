// eslint-disable-next-line import/no-empty-named-blocks -- `import/no-empty-named-blocks` should validate this.
import {} from "node:path";
// eslint-disable-next-line unicorn/prefer-node-protocol -- `unicorn` should validate this.
import path from "path";

const a = "a";
// @ts-expect-error -- TypeScript should validate this.
// eslint-disable-next-line no-const-assign -- `eslint` should validate this.
a = 3;

path.resolve(a);
