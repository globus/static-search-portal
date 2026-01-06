import React from "react";
import { render } from "../../../test-utils";
import TableField from "../../../src/components/Fields/TableField";

describe("TableField", () => {
  it("renders table for object", () => {
    const { getByText } = render(<TableField value={{ foo: "bar" }} />);
    expect(getByText("foo")).toBeInTheDocument();
    expect(getByText("bar")).toBeInTheDocument();
  });

  it("renders nothing for invalid value", () => {
    const { container } = render(<TableField value={42} />);
    expect(container.firstChild).toBeNull();
  });
});