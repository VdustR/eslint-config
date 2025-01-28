import { useCallback, useEffect, useRef, useState } from "react";

// eslint-disable tsdoc/syntax -- tsdoc should validate this.
/**
 *
 * @param test lol
 */

// @ts-expect-error -- TypeScript should validate this.
// eslint-disable-next-line ts/array-type -- `@typescript-eslint` should validate this.
const arr: string[] = [];

// eslint-disable-next-line react-hooks/rules-of-hooks -- `react-hooks` should validate this.
const onClick = useCallback(() => {}, []);

namespace MyComponent {
  export interface Props {
    foo: string;
  }
}

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

export { MyComponent };
