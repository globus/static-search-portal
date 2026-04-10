import { screen } from "@testing-library/react";
import { render } from "../../test-utils";
import merge from "lodash/merge";

import result from "../fixtures/GMetaResult.json";

import Result from "../../src/components/Result";

import * as GeneratorKit from "@from-static/generator-kit";

const real = jest.requireActual("@from-static/generator-kit");

describe("Result", () => {
  it("renders the result component correctly", async () => {
    // @ts-expect-error Need to improve the `result` prop type definition
    render(<Result result={result} />);
    await screen.findByText(result.entries[0].content.title);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      result.entries[0].content.title,
    );
  });

  it.only("supports 'components.Result.heading'", async () => {
    const spy = jest.spyOn(GeneratorKit, "getStatic").mockReturnValue(
      merge({}, real.getStatic(), {
        data: {
          attributes: {
            components: {
              Result: {
                heading: "entries[0].content.purpose",
              },
            },
          },
        },
      }),
    );
    // @ts-expect-error Need to improve the `result` prop type definition
    render(<Result result={result} />);
    await screen.findByText(result.entries[0].content.purpose);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      result.entries[0].content.purpose,
    );
    spy.mockRestore();
  });
});
