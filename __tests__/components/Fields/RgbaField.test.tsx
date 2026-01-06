import React from "react";
import { render } from "../../../test-utils";
import RgbaField from "../../../src/components/Fields/RgbaField";

describe("RgbaField", () => {
  it("renders RGBA color", () => {
    const { getByText, container } = render(<RgbaField value={[255,0,0,1]} />);
    expect(getByText("[255,0,0,1]")).toBeInTheDocument();

  });

  it("renders nothing for invalid value", () => {
    const { container } = render(<RgbaField value={42} />);
    expect(container.firstChild).toBeNull();
  });
});