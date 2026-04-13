import { screen } from "@testing-library/react";
import { render } from "../../test-utils";
import { get, set } from "lodash";

import result from "../fixtures/GMetaResult.json";
import Result from "../../src/components/Result";
import { getStatic } from "@from-static/generator-kit";

describe("Result", () => {
  it("renders the result component correctly", async () => {
    // @ts-expect-error Need to improve the `result` prop type definition
    render(<Result result={result} />);
    await screen.findByText(result.entries[0].content.title);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      result.entries[0].content.title,
    );
  });

  it("supports 'components.Result.heading'", async () => {
    /**
     * getStatic() returns the same cached object reference every time.
     * Mutate it directly to override config, restoring in `finally` to avoid
     * polluting other tests.
     */
    const config = getStatic();
    const path = "data.attributes.components.Result.heading";
    const original = get(config, path);
    set(config, path, "entries[0].content.purpose");

    try {
      // @ts-expect-error Need to improve the `result` prop type definition
      render(<Result result={result} />);
      await screen.findByText(result.entries[0].content.purpose);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        result.entries[0].content.purpose,
      );
    } finally {
      set(config, path, original);
    }
  });
});
