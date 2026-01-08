import { render } from "../../../test-utils";
import BytesField from "../../../src/components/Fields/BytesField";

describe("BytesField", () => {
  it("renders readable bytes for number", () => {
    const { getByText } = render(<BytesField value={1024} />);
    expect(getByText(/1.02 KB/i)).toBeInTheDocument();
  });

  it("renders readable bytes for string number", () => {
    const { getByText } = render(<BytesField value="2048" />);
    expect(getByText(/2.04 KB/i)).toBeInTheDocument();
  });

  it("renders nothing for invalid value", () => {
    const { container } = render(<BytesField value={{}} />);
    expect(container.firstChild).toBeNull();
  });
});
