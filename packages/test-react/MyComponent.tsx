import {
  useEffect,
  // eslint-disable-next-line perfectionist/sort-named-imports -- `perfectionist` should validate this.
  useCallback,
  useRef,
  useState,
} from "react";
// eslint-disable-next-line import/no-namespace -- `import/no-namespace` should validate this.
import * as React from "react";
// eslint-disable-next-line perfectionist/sort-imports -- `perfectionist` should validate this.
import path from "pathe";

// eslint-disable-next-line ts/array-type -- `ts` should validate this.
const a: string[] = ["Hello", "world!"];
const b: Array<string> = ["Hello", "world!"];

path.resolve("foo", ...a, ...b);

const onClick = useCallback(() => {}, []);

namespace MyComponent {
  export interface Props {
    foo: string;
    onClick?: (...args: Array<any>) => void;
  }
}

// eslint-disable-next-line jsdoc/require-returns-check -- `jsdoc` should validate this.
/**
 * @returns test
 *
 * @param _args
 */
const noop = (..._args: Array<any>) => {};

const MyComponent: React.FC<MyComponent.Props> = (props) => {
  const [_unusedState] = useState(0);
  const ref = useRef(null);
  noop(ref.current);
  useEffect(() => {
    // eslint-disable-next-line no-console -- `no-console` should validate this.
    console.log(props.foo);
    // eslint-disable-next-line react-compiler/react-compiler -- `react-compiler` should validate this.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `react-hooks` should validate this.
  }, []);
  return (
    <div onClick={onClick}>
      Test
      {/* eslint-disable-next-line react-dom/no-unsafe-target-blank -- `react-dom` should validate this. */}
      <a target="_blank" href="https://example.com">
        Test
      </a>
    </div>
  );
};

const A: React.FC = () => "a";

// eslint-disable-next-line import/no-default-export -- `import/no-default-export` should validate this.
export default MyComponent;

export {
  MyComponent,
  // eslint-disable-next-line perfectionist/sort-named-exports -- `perfectionist` should validate this.
  A,
};
