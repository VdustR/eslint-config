# Test Markdown

```ts
// Export `default` should be ignored.
export default function test() {
  console.log("Hello, world!");
}

// eslint-disable-next-line ts/array-type -- `ts` should validate this.
const a: string[] = ["Hello", "world!"];
```
