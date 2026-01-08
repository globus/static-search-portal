import { render } from "../../../test-utils";
import FallbackField from "../../../src/components/Fields/FallbackField";

describe("FallbackField", () => {
  it("renders dash for null/undefined", () => {
    const { getByText } = render(<FallbackField value={null} />);
    expect(getByText(/—/)).toBeInTheDocument();
  });

  it("renders primitive values", () => {
    const { getByText } = render(<FallbackField value={42} />);
    expect(getByText("42")).toBeInTheDocument();
    expect(
      render(<FallbackField value="foo" />).getByText("foo"),
    ).toBeInTheDocument();
    // Boolean values are rendered as strings, but may not be found directly
    const { container } = render(<FallbackField value={true} />);
    expect(container.textContent).toContain("true");
  });

  it("renders arrays recursively", () => {
    const { getAllByText } = render(<FallbackField value={[1, 2]} />);
    expect(getAllByText(/1|2/).length).toBeGreaterThan(1);
  });

  it("renders objects as JSONTree", () => {
    const { getByText } = render(<FallbackField value={{ foo: "bar" }} />);
    expect(getByText(/foo/)).toBeInTheDocument();
    expect(getByText(/bar/)).toBeInTheDocument();
  });
});
