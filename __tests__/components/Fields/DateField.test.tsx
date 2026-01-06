import React from "react";
import { render } from "../../../test-utils";
import DateField from "../../../src/components/Fields/DateField";

describe("DateField", () => {
  it("renders formatted date for string", () => {
    const date = new Date("2023-01-01T12:34:56Z").toISOString();
    const { getByText } = render(<DateField value={date} />);
    expect(getByText(/2023|01|12|34/i)).toBeInTheDocument();
  });

  it("renders nothing for invalid value", () => {
    const { container } = render(<DateField value={{}} />);
    expect(container.firstChild).toBeNull();
  });
});
