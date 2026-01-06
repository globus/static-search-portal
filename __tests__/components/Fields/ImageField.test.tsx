import React from "react";
import { render } from "../../../test-utils";
import ImageField from "../../../src/components/Fields/ImageField";

describe("ImageField", () => {
  it("renders for string src", () => {
    const { container } = render(<ImageField value="/test.png" />);
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("renders for object src", () => {
    const { container } = render(<ImageField value={{ src: "/test2.png", alt: "desc" }} />);
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("renders nothing for invalid value", () => {
    const { container } = render(<ImageField value={42} />);
    expect(container.firstChild).toBeNull();
  });
});