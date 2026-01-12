import { screen } from "@testing-library/react";
import { render } from "../../test-utils";

import result from "../fixtures/GMetaResult.json";

import Result from "../../src/components/Result";

import _STATIC from "../../static.json" with { type: "json" };

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
     * Change the value of `components.Result.heading`
     */
    _STATIC.data.attributes.components.Result.heading =
      "entries[0].content.purpose";
    // @ts-expect-error Need to improve the `result` prop type definition
    render(<Result result={result} />);
    await screen.findByText(result.entries[0].content.purpose);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      result.entries[0].content.purpose,
    );
  });
});
