import type { Meta, StoryObj } from "@storybook/react";
import { useArgs, useCallback, useState } from "@storybook/preview-api";
import { MyComponent } from "./MyComponent";

type Args = MyComponent.Props;

const meta = {
  // eslint-disable-next-line storybook/no-title-property-in-meta -- `storybook` should validate this.
  title: "MyComponent",
  component: MyComponent,
} satisfies Meta<Args>;

const DefaultStory: StoryObj<Args> = {
  render() {
    const [state, setState] = useState(0);
    const [args, updateArgs] = useArgs<Args>();
    const onClick = useCallback(() => {
      setState((prev) => prev + 1);
      updateArgs({ foo: state.toString() });
    }, [state, updateArgs]);
    return <MyComponent {...args} foo={state.toString()} onClick={onClick} />;
  },
};

const camelCaseStory: StoryObj<Args> = {};

export default meta;
export { camelCaseStory, DefaultStory };
